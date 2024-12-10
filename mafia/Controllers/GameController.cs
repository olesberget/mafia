using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using WebApplication1.Models;
using WebApplication1.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebApplication1.Hubs;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GameController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly ILogger<GameManager> _gameManagerLogger;

        public GameController(ApplicationDbContext context, ILogger<GameController> logger,
            UserManager<ApplicationUser> userManager, IHubContext<GameHub> hubContext,
            ILogger<GameManager> gameManagerLogger)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _hubContext = hubContext;
            _gameManagerLogger = gameManagerLogger;
        }

        [HttpPost("hostgame")]
        public async Task<ActionResult> HostGame()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var gameRoom = new GameRoom();
            _context.GameRooms.Add(gameRoom);
            await _context.SaveChangesAsync();
            
            // Register the host in the SignalR group
            await _hubContext.Clients.Client(HttpContext.Connection.Id).SendAsync("RegisterHost", gameRoom.GameId);

            return Ok(new { gameId = gameRoom.GameId, isHost = true });
        }


        public class JoinGameRequest
        {
            public string GameId { get; set; }
            public string Nickname { get; set; }
        }

        [HttpPost("joingame")]
        public async Task<ActionResult> JoinGame([FromBody] JoinGameRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.GameId) ||
                string.IsNullOrWhiteSpace(request.Nickname))
            {
                _logger.LogWarning("Invalid input - gameId or nickname is missing.");
                return BadRequest("GameId and Nickname are required.");
            }

            try
            {
                string userId;
                string nickname = request.Nickname;

                if (User.Identity.IsAuthenticated)
                {
                    userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var user = await _userManager.FindByIdAsync(userId);
                    nickname = user?.Nickname ?? nickname; // Use nickname from database if available
                    _logger.LogInformation($"Authenticated user. UserId: {userId}, Nickname: {nickname}");
                }
                else
                {
                    userId = CreateTemporaryUser(nickname);
                    _logger.LogInformation($"Unauthenticated user. Temporary UserId: {userId}, Nickname: {nickname}");
                }

                var gameRoom = _context.GameRooms.Include(gr => gr.Players).FirstOrDefault(gr => gr.GameId == request.GameId);
                if (gameRoom == null || gameRoom.IsGameActive)
                {
                    _logger.LogWarning($"Game room not found or already active. GameId: {request.GameId}");
                    return NotFound("Game room not found or game is already active.");
                }
                
                if (gameRoom.Players.Count >= GameRoom.MaxPlayers)
                {
                    _logger.LogWarning($"Game room is full. GameId: {request.GameId}");
                    return BadRequest("Game room is full.");
                }

                var player = new Player
                {
                    UserId = userId, 
                    GameRoomId = request.GameId, 
                    IsHost = false, 
                    Nickname = nickname
                };
                
                _context.Players.Add(player);
                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    $"Player joined game. GameId: {request.GameId}, UserId: {userId}, Nickname: {nickname}, PlayerId: {player.PlayerId}");

                // Notify all clients in the game room that a new player has joined.
                await _hubContext.Clients.Group(request.GameId)
                    .SendAsync("PlayerJoined", new { UserId = userId, Nickname = nickname });

                // Retrieve the host's connection ID for this game
                if (GameHub.HostConnectionIds.TryGetValue(request.GameId, out var hostConnectionId))
                {
                    // Notify the host that a new player has joined
                    await _hubContext.Clients.Client(hostConnectionId)
                        .SendAsync("PlayerJoined", new { UserId = userId, Nickname = nickname });
                }
                
                // Notify all clients in the game room to update their player list
                await _hubContext.Clients.Group(request.GameId).SendAsync("PlayerListUpdated");
                
                _logger.LogInformation($"Sending response. GameId: {gameRoom.GameId}, UserId: {userId}, Nickname: {nickname}, PlayerId: {player.PlayerId}");
                return Ok(new { gameId = gameRoom.GameId, isHost = false, playerId = player.PlayerId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while joining the game.");
                return StatusCode(500, "Internal server error");
            }
        }
        
        [HttpGet("getplayers")]
        public ActionResult GetPlayersInGame([FromQuery] string gameId, [FromQuery] string? playerId)
        {
            if (string.IsNullOrWhiteSpace(gameId))
            {
                return BadRequest("GameId is required!");
            }

            var playersInGame = _context.Players
                .Where(p => p.GameRoomId == gameId && p.PlayerId != playerId && !p.IsHost)
                .Select(p => new { p.Nickname, p.UserId, p.PlayerId })
                .ToList();

            return Ok(playersInGame);
        }

        
        
        
        [HttpPost("updatePlayerReadyStatus")]
        public async Task<ActionResult> UpdatePlayerReadyStatus(string gameId, string playerId, [FromBody] bool isReady)
        {
            _logger.LogInformation($"UpdatePlayerReadyStatus called - gameId: {gameId}, playerId: {playerId}, isReady: {isReady}");

            var player = await _context.Players.FirstOrDefaultAsync(p => p.GameRoomId == gameId && p.PlayerId == playerId);
            if (player == null)
            {
                return NotFound("Player not found");
            }

            player.IsReady = isReady;
            await _context.SaveChangesAsync();

            var readyPlayersCount = await _context.Players.CountAsync(p => p.GameRoomId == gameId && p.IsReady);
            var totalPlayersCount = await _context.Players.CountAsync(p => p.GameRoomId == gameId);

            await _hubContext.Clients.Group(gameId).SendAsync("PlayerReadyStatusChanged", playerId, isReady, readyPlayersCount, totalPlayersCount);

            return Ok();
        }
        
        [HttpGet("checkAllPlayersReady")] //Ready Continue
        public ActionResult CheckAllPlayersReady(string gameId)
        {
            var allReady = _context.Players.Where(p => p.GameRoomId == gameId).All(p => p.IsReady);
            return Ok(allReady);
        }
        
        [HttpPost("startgame")]
        public async Task<ActionResult> StartGame([FromBody] StartGameRequest request)
        {
            var gameRoom = _context.GameRooms
                .Include(gr => gr.Players)
                .FirstOrDefault(gr => gr.GameId == request.GameId);

            if (gameRoom == null)
            {
                return NotFound("Game Room not found.");
            }

            if (gameRoom.IsGameActive)
            {
                return BadRequest("Game is already active");
            }

            if (gameRoom.Players.Count >= GameRoom.MinPlayers)
            {
                var gameManager = new GameManager(gameRoom, new Narrator(), new RoleManager(), new VoteManager(), new GameTimer(), _gameManagerLogger, _context);
                gameRoom.ActivateGameRoom(gameManager);
                _context.SaveChanges();
                
                _logger.LogInformation($"Game {request.GameId} started successfully with {gameRoom.Players.Count} players.");
                await _hubContext.Clients.Group(gameRoom.GameId).SendAsync("GameStarted");
                _logger.LogInformation($"Game {request.GameId} started successfully with {gameRoom.Players.Count} players.");
                
                Task.Run(() => CheckGameStartConfirmations(gameRoom.GameId));
                
                return Ok(new { message = "Game started successfully." });
            }
            else
            {
                _logger.LogWarning($"Attempted to start game {request.GameId} with insufficient players.");
                return BadRequest("Not enough players to start the game.");
            }
        }
        
        private async Task CheckGameStartConfirmations(string gameId)
        {
            // Wait for a short period to allow clients to send confirmations
            await Task.Delay(10000); // 10 seconds

            var confirmedIds = GameHub.GetGameStartConfirmations(gameId);
            var playersInGroup = GameHub.GetGroupMembers(gameId);

            // Check for missing confirmations
            if (confirmedIds != null && playersInGroup != null)
            {
                var playersWithoutConfirmation = playersInGroup.Except(confirmedIds);

                foreach (var playerId in playersWithoutConfirmation)
                {
                    // Resend GameStarted to specific clients
                    await _hubContext.Clients.Client(playerId).SendAsync("GameStarted");
                    _logger.LogInformation($"Resending GameStarted to player {playerId} for game {gameId}");
                }
            }
        }
        
        [HttpGet("getplayerrole")]
        public ActionResult GetPlayerRole(string gameId, string playerId)
        {
            _logger.LogInformation($"Received request for player role with GameId: {gameId} and PlayerId: {playerId}");
            
            if (string.IsNullOrWhiteSpace(gameId) || string.IsNullOrWhiteSpace(playerId))
            {
                return BadRequest("GameId and PlayerId are required.");
            }
            
            var player = _context.Players.FirstOrDefault(p => p.GameRoomId == gameId && p.PlayerId == playerId);
            if (player == null)
            {
                _logger.LogWarning($"Player not found for GameId: {gameId} and PlayerId: {playerId}");
                return NotFound("Player not found");
            }
            _logger.LogInformation($"Returning player data: {JsonConvert.SerializeObject(player)}");
            return Ok(new { Role = player.Role, Description = GetRoleDescription(player.Role) });
        }

        [HttpGet("getplayerinfo")]
        public ActionResult GetPlayerInfo(string gameId, string playerId)
        {
            if (string.IsNullOrWhiteSpace(gameId) || string.IsNullOrWhiteSpace(playerId))
            {
                return BadRequest("GameId and PlayerId are required.");
            }
            
            var player = _context.Players.FirstOrDefault(p => p.GameRoomId == gameId && p.PlayerId == playerId);
            
            if (player == null)
            {
                return NotFound("Player not found");
            }
            
            return Ok(new { Nickname = player.Nickname });
        }
        
        [HttpPost("killplayer")]
        public async Task<ActionResult> KillPlayer([FromBody] KillPlayerRequest request)
        {
            var targetPlayer = await _context.Players.FirstOrDefaultAsync(p => p.PlayerId == request.TargetPlayerId && p.GameRoomId == request.GameId);
            if (targetPlayer == null)
            {
                return NotFound("Target player not found.");
            }

            targetPlayer.IsAlive = false;
            await _context.SaveChangesAsync();

            // Notify clients about the update
            await _hubContext.Clients.Group(request.GameId).SendAsync("PlayerKilled", request.TargetPlayerId);

            return Ok();
        }
        
        public class KillPlayerRequest
        {
            public string GameId { get; set; }
            public string TargetPlayerId { get; set; }
        }
        
        [HttpPost("saveplayer")]
        public async Task<ActionResult> SavePlayer([FromBody] SavePlayerRequest request)
        {
            var playerToSave = await _context.Players.FirstOrDefaultAsync(p => p.PlayerId == request.TargetPlayerId && p.GameRoomId == request.GameId);
            if (playerToSave == null)
            {
                return NotFound("Target player not found.");
            }

            // Only set isAlive to true if it's currently false
            if (!playerToSave.IsAlive)
            {
                playerToSave.IsAlive = true;
                await _context.SaveChangesAsync();
            }

            // Optionally, notify clients
            await _hubContext.Clients.Group(request.GameId).SendAsync("PlayerSaved", request.TargetPlayerId);

            return Ok();
        }

        public class SavePlayerRequest
        {
            public string GameId { get; set; }
            public string TargetPlayerId { get; set; }
        }
        
        [HttpGet("checkrole")]
        public async Task<ActionResult> CheckPlayerRole(string gameId, string targetPlayerId)
        {
            var player = _context.Players.FirstOrDefault(p => p.PlayerId == targetPlayerId && p.GameRoomId == gameId);
            if (player == null)
            {
                return NotFound("Player not found");
            }
            
            return Ok(new { PlayerId = player.PlayerId, Role = player.Role });
        }
        

        private string GetRoleDescription(string role)
        {
            switch (role)
            {
                case "Mafia": return "Mafia Description";
                case "Citizen": return "Citizen Description";
                case "Doctor": return "Doctor Description";
                case "Detective": return "Detective Description";
                default: return "No description available";
            }
        }


    private string CreateTemporaryUser(string nickname)
        {
            // Create and return a temporary user ID (e.g., a GUID)
            return Guid.NewGuid().ToString();
        }

    public class StartGameRequest
        { 
            public string GameId { get; set; }
        }
    }
}