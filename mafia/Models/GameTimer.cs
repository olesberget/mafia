using System;
using System.Timers;
using Humanizer;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class GameTimer
    {
        private System.Timers.Timer _timer;
        public event Action OnTimerComplete;

        public GameTimer()
        {
            _timer = new System.Timers.Timer();
            _timer.Elapsed += OnTimerElapsed;
            _timer.AutoReset = false;
        }

        private void OnTimerElapsed(object sender, ElapsedEventArgs e)
        {
            // Logic to be executed when timer expires
            _timer.Stop();
            OnTimerComplete?.Invoke(); // Notify when timer completes
        }
        

        public void StartTimer(int durationInSeconds)
        {
            _timer.Interval = durationInSeconds * 1000;
            _timer.Start();
        }

        public void StopTimer()
        {
            _timer.Stop();
        }

        public bool isRunning()
        {
            return _timer.Enabled;
        }
    }
}

