using WebApplication1.Models;
using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class Narrator
    {
        private Random _random = new Random();

        public string IntroduceStory()
        {
            var introductions = new List<string>
            {
                "aaa", "bbb", "ccc"
            };

            return introductions[_random.Next(introductions.Count)];
        }

        public string AnnounceDayNightTransition(bool isNight)
        {
            if (isNight)
            {
                var nightStories = new List<string>
                {
                    "aaa", "bbb", "ccc"
                };

                return nightStories[_random.Next(nightStories.Count)];
            }
            else
            {
                var dayStories = new List<string>
                {
                    "aaa", "bbb", "ccc"
                };

                return dayStories[_random.Next(dayStories.Count)];
            }
        }

        public string AnnounceEvent(string eventDescription)
        {
            // Custom logic to enhance event description
            return $"An event unfolds: {eventDescription}";
        }

        public string AnnouncePlayerElimination(string playerName)
        {
            var eliminationMessages = new List<string>
            {
                $"{playerName} has met a mysterious end...",
                $"A tragic fate has befallen {playerName}...",
                $"Silence falls as {playerName} is no longer among us..."
            };

            return eliminationMessages[_random.Next(eliminationMessages.Count)];
        }
        // Additional methods as needed for different narrative elements
    }
}

