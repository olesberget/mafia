using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class RoleManager
    {
        private const string MafiaRole = "Mafia";
        private const string CitizenRole = "Citizen";
        private const string DetectiveRole = "Detective";
        private const string DoctorRole = "Doctor";
        
        public void AssignRoles(List<Player> players)
        {
            var random = new Random();
            int numberOfMafias = players.Count / 4;
            int numberOfDetectives = 1;
            int numberOfDoctors = 1;

            Console.WriteLine($"Assigning roles to {players.Count} players.");

            // Assign special roles (Detective and Doctor) first
            AssignSpecialRole(players, DetectiveRole, random, numberOfDetectives);
            AssignSpecialRole(players, DoctorRole, random, numberOfDoctors);

            // Assign Mafia and Citizen roles
            foreach (var player in players.Where(p => string.IsNullOrEmpty(p.Role)))
            {
                if (numberOfMafias > 0)
                {
                    player.Role = MafiaRole;
                    numberOfMafias--;
                    Console.WriteLine($"Assigned Mafia role to PlayerId: {player.PlayerId}");
                }
                else
                {
                    player.Role = CitizenRole;
                    Console.WriteLine($"Assigned Citizen role to PlayerId: {player.PlayerId}");
                }
            }
            
            Console.WriteLine("Completed role assignment.");
        }

        private void AssignSpecialRole(List<Player> players, string role, Random random, int numberOfRoles)
        {
            while (numberOfRoles > 0)
            {
                int index = random.Next(players.Count);
                var selectedPlayer = players[index];

                if (string.IsNullOrEmpty(selectedPlayer.Role))
                {
                    selectedPlayer.Role = role;
                    numberOfRoles--;
                    Console.WriteLine($"Assigned {role} role to PlayerId: {selectedPlayer.PlayerId}");
                }
            }
        }


        public void HandleRoleAction(string playerId, string action, List<Player> players)
        {
            var player = players.Find(p => p.PlayerId == playerId);
            if (player == null || !player.IsAlive) return;

            switch (player.Role)
            {
                case MafiaRole:
                    if (action == "Kill") PerformMafiaAction(playerId, players);
                    break;
                case DetectiveRole:
                    if (action == "Investigate") PerformDetectiveAction(playerId, players);
                    break;
                case DoctorRole:
                    if (action == "Heal") PerformDoctorAction(playerId, players);
                    break;
                // Additional cases for other roles
            }
        }

        private void PerformMafiaAction(string playerId, List<Player> players)
        {
            // Implement Mafia's kill action
            // Example: Mark a player as not alive
        }

        private void PerformDetectiveAction(string playerId, List<Player> players)
        {
            // Implement Detective's investigate action
            // Example: Reveal the role of another player to the detective
        }

        private void PerformDoctorAction(string playerId, List<Player> players)
        {
            // Implement Doctor's heal action
            // Example: Prevent a player from being killed this turn
        }

        public bool CheckWinCondition(List<Player> players)
        {
            // Implement logic to check if a win condition is met
            // Example: All Mafia members are eliminated or Mafia outnumbers the citizens
            return false;
        }

        // Additional methods as needed for role management
    }
}

