using System;
namespace WebApplication1.Models
{
    public class Player
    {
        public string PlayerId { get; set; } = Guid.NewGuid().ToString(); // Unique ID for each player
        public string UserId { get; set; } // User's ID from the user management system
        public string GameRoomId { get; set; } // ID of the GameRoom the player is in
        public bool IsHost { get; set; } // Indicates if the player is the host
        public bool IsAlive { get; set; } // Indicates if the player is alive in the game

        public bool IsReady { get; set; } // Indicates if the player is ready to start the game
        public string? Role { get; set; } // Role of the player in the game (Mafia, Citizen, etc.)
        public bool HasVoted { get; set; } // Indicates if the player has voted during the current phase
        public bool HasPerformedAction { get; set; } // Indicates if the player has performed an action during the current phase
        
        public string? Nickname { get; set; } // Nickname

        public Player()
        {
            IsAlive = true; // By default, players are alive at the start of the game
            HasVoted = false;
            HasPerformedAction = false;
        }

        // Additional methods as needed, such as for performing role-specific actions
        // Method to perform role-specific actions
        public void PerformAction(string action)
        {
            // Implement logic based on the player's role and the action
            // Example: if the player is a Mafia member and the action is "Kill", implement the kill logic
            // This method can be expanded or modified based on game rules and roles
            
            // Ensure the player hasn't already performed an action in this phase
            if (!HasPerformedAction)
            {
                // Logic to perform the action
                HasPerformedAction = true;
            }
        }
        
        // Method to cast a vote
        public void Vote(string votedPlayerId)
        {
            // Implement voting logic
            // Ensure the player hasn't already voted in this phase
            if (!HasVoted)
            {
                // Logic to record the vote
                HasVoted = true;
            }
        }
        
        // Method to reset player's actions and votes for the next phase
        public void ResetActionsAndVotes()
        {
            HasVoted = false;
            HasPerformedAction = false;
        }
        
        // Additional methods as needed for player interactions
    }
}