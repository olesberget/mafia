using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using shortid;
using System.Text;


namespace WebApplication1.Models
{
    public class GameRoom
    {
        [Key] public string GameId { get; set; } = GenerateShortId();

        private static string GenerateShortId(int desiredLength = 7)
        {
            var random = new Random();
            var numberId = new StringBuilder();

            // Generate a string of random digits, each between 0 and 9
            for (int i = 0; i < desiredLength; i++)
            {
                numberId.Append(random.Next(0, 10));
            }

            return numberId.ToString();
        }

        public bool IsGameActive { get; private set; }
        public List<Player> Players { get; private set; } = new List<Player>();

        public static int MaxPlayers { get; } = 20;
        public static int MinPlayers { get; } = 1;

        private GameManager _gameManager;
        
        public GameRoom()
        {
            // Initialize GameManager here or externally and pass it to the GameRoom
            // _gameManager = new GameManager(this, new Narrator(), new RoleManager(Players), new VoteManager(), new GameTimer(30));
        }

        public void AddPlayer(Player player)
        {
            if (Players.Count < MaxPlayers && !IsGameActive)
            {
                Players.Add(player);
            }
        }

        public bool ActivateGameRoom(GameManager gameManager)
        {
            if (Players.Count >= MinPlayers)
            {
                IsGameActive = true;
                _gameManager = gameManager;
                _gameManager.StartGame();
                return true;
            }
            return false;
        }

        public void EndGame()
        {
            // Logic to end the game, such as determining the winner, cleaning up, etc.
            IsGameActive = false;
            // Additional cleanup logic
        }
        
        
        // Additional methods as needed
    }
}