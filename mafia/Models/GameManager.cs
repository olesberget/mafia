using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class GameManager
    {
        private readonly GameRoom _gameRoom;
        private readonly Narrator _narrator;
        private readonly RoleManager _roleManager;
        private readonly VoteManager _voteManager;
        private readonly GameTimer _gameTimer;
        private bool _isNight;
        private readonly ILogger<GameManager> _logger;
        private readonly ApplicationDbContext _context;

        public GameManager(GameRoom gameRoom, Narrator narrator, RoleManager roleManager,
            VoteManager voteManager, GameTimer gameTimer, ILogger<GameManager> logger, ApplicationDbContext context)
        {
            _gameRoom = gameRoom;
            _narrator = narrator;
            _roleManager = roleManager;
            _voteManager = voteManager;
            _gameTimer = gameTimer;
            _isNight = false;
            _logger = logger;
            _context = context;
        }

        public void StartGame()
        {
            _roleManager.AssignRoles(_gameRoom.Players);
            _context.SaveChanges();
            TransitionToNight();
        }

        public void TransitionToNight()
        {
            _isNight = true;
            _narrator.AnnounceDayNightTransition(_isNight);
            // Initialize night game logic
            _gameTimer.StartTimer(30);
            ProcessNightActions();
        }

        public void TransitionToDay()
        {
            _isNight = false;
            _narrator.AnnounceDayNightTransition(_isNight);
            // Process night actions and prepare for day phase
            _gameTimer.StartTimer(60);
            ProcessDayActions();
        }

        public void ProcessDayActions()
        {
            // Logic for processing day actions (e.g., voting)
            _voteManager.ResetVotes();
            // Additional logic for day phase 
        }

        public void ProcessNightActions()
        {
            // Logic for processing night actions (e.g., Mafia actions)
            // Example: Mafia players select a target to "eliminate"
            // This can be implemented as a method in RoleManager or a separate component
        }
        
        public void EndGame()
        {
            // Logic to determine if the game has reached its conclusion
            // This could involve checking if all Mafia members are eliminated, or if Mafia outnumbers the citizens
            // Announce the game result using the Narrator
        }
        
        // Additional methods as needed for game management
    }
}

