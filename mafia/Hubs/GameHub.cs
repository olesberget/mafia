using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.Hubs;

public class GameHub : Hub
{
    public static readonly Dictionary<string, string> HostConnectionIds = new Dictionary<string, string>();
    private static readonly Dictionary<string, HashSet<string>> GroupMembers = new Dictionary<string, HashSet<string>>();
    private static readonly Dictionary<string, HashSet<string>> GameStartConfirmations = new Dictionary<string, HashSet<string>>();

    public async Task RegisterHost(string gameId)
    {
        HostConnectionIds[gameId] = Context.ConnectionId;
        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        Console.WriteLine($"Host registered for game {gameId}");
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        Console.WriteLine($"Client disconnected: {Context.ConnectionId}, Error: {exception?.Message}");
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinGroup(string groupName)
    {
        if (!GroupMembers.ContainsKey(groupName))
        {
            GroupMembers[groupName] = new HashSet<string>();
        }

        if (!GroupMembers[groupName].Contains(Context.ConnectionId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            GroupMembers[groupName].Add(Context.ConnectionId);
            Console.WriteLine($"Connection {Context.ConnectionId} joined group {groupName}");
        }
    }

    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        Console.WriteLine($"Connection {Context.ConnectionId} left group {groupName}");
    }

    public async Task SendMessageToGroup(string groupName, string nickname, string message)
    {
        try
        {
            Console.WriteLine($"Sending message to group {groupName}: {message}");
            var formattedMessage = $"{nickname}: {message}";
            await Clients.Group(groupName).SendAsync("ReceiveMessage", formattedMessage);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in SendMessageToGroup: {ex.Message}");
        }
    }
    
    public async Task StartGame(string gameId)
    {
        Console.WriteLine($"Starting game for group {gameId}");
        if (!GroupMembers.TryGetValue(gameId, out var groupMemberIds))
        {
            Console.WriteLine($"No members found for group {gameId}");
            return;
        }

        try
        {
            await Clients.Group(gameId).SendAsync("GameStarted");
            Console.WriteLine($"GameStarted event sent to group {gameId}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending GameStarted to group {gameId}: {ex.Message}");
        }
    }
    
    public async Task ConfirmGameStart(string gameId)
    {
        if (!GameStartConfirmations.ContainsKey(gameId))
        {
            GameStartConfirmations[gameId] = new HashSet<string>();
        }

        GameStartConfirmations[gameId].Add(Context.ConnectionId);
        Console.WriteLine($"GameStart confirmed by {Context.ConnectionId} for game {gameId}");
    }

    public async Task StartNightPhase(string gameId)
    {
        Console.WriteLine($"Attempting to start night phase for game: {gameId}");
        try
        {
            await Clients.Group(gameId).SendAsync("NightPhaseStarted");
            Console.WriteLine($"NightPhaseStarted event sent to group {gameId}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error starting Night Phase for group {gameId}: {ex.Message}");
        }
    }



    public static HashSet<string> GetGroupMembers(string groupName)
    {
        return GroupMembers.TryGetValue(groupName, out var members) ? members : null;
    }

    public static HashSet<string> GetGameStartConfirmations(string gameId)
    {
        return GameStartConfirmations.TryGetValue(gameId, out var confirmations) ? confirmations : null;
    }

    public async Task ConfirmClientReady(string gameId)
    {
        if (!GameStartConfirmations.ContainsKey(gameId))
        {
            GameStartConfirmations[gameId] = new HashSet<string>();
        }

        GameStartConfirmations[gameId].Add(Context.ConnectionId);
        Console.WriteLine($"Client {Context.ConnectionId} is ready for game {gameId}");

        if (CheckAllClientsReady(gameId))
        {
            await Clients.Group(gameId).SendAsync("GameStarted");
        }
    }

    private bool CheckAllClientsReady(string gameId)
    {
        var groupMembers = GetGroupMembers(gameId);
        var confirmedMembers = GetGameStartConfirmations(gameId);

        return groupMembers != null && confirmedMembers != null && groupMembers.SetEquals(confirmedMembers);
    }
    
    public async Task NotifyPlayerListUpdated(string gameId)
    {
        await Clients.Group(gameId).SendAsync("PlayerListUpdated");
    }
    
    public async Task CheckRole(string gameId, string targetPlayerId)
    {
        await Clients.Caller.SendAsync("RoleChecked", targetPlayerId);
    }
    
    
}