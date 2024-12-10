using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using WebApplication1.Models;


namespace WebApplication1.Models
{
    public class VoteManager
    {
        private Dictionary<string, string> _votes;
        private const string AbstainVote = "Abstain";

        public VoteManager()
        {
            _votes = new Dictionary<string, string>();
        }

        public void CastVote(string voterId, string votedId)
        {
            // If votedId is null or empty, it's considered an abstention
            _votes[voterId] = string.IsNullOrEmpty(votedId) ? AbstainVote : votedId;
        }

        public string CalculateResult()
        {
            var voteCounts = _votes.Values
                .Where(vote => vote != AbstainVote)
                .GroupBy(v => v)
                .Select(group => new { PlayerId = group.Key, Count = group.Count() })
                .OrderByDescending(v => v.Count);

            if (!voteCounts.Any())
            {
                return "No valid votes";
            }

            if (voteCounts.Count() > 1 && voteCounts.First().Count == voteCounts.ElementAt(1).Count)
            {
                return "Tie";
            }

            return voteCounts.First().PlayerId;
        }

        public bool AllPlayersVoted(int totalPlayers)
        {
            return _votes.Count == totalPlayers;
        }

        public Dictionary<string, int> GetDetailedResults()
        {
            return _votes.Values
                .GroupBy(vote => vote)
                .ToDictionary(group => group.Key, group => group.Count());
        }

        public void ResetVotes()
        {
            _votes.Clear();
        }
    }
}

