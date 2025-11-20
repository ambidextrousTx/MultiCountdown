// In-memory state for all countdowns
const countdowns = [
  { id: 1, endTime: null, isPaused: false, remainingMs: 0, intervalId: null },
  { id: 2, endTime: null, isPaused: false, remainingMs: 0, intervalId: null },
  { id: 3, endTime: null, isPaused: false, remainingMs: 0, intervalId: null }
];

// Initialize each countdown
document.querySelectorAll('.countdown-card').forEach((card, index) => {
  const countdown = countdowns[index];
  
  const daysInput = card.querySelector('[data-input-days]');
  const hoursInput = card.querySelector('[data-input-hours]');
  const minutesInput = card.querySelector('[data-input-minutes]');
  const secondsInput = card.querySelector('[data-input-seconds]');
  
  const daysDisplay = card.querySelector('[data-days]');
  const hoursDisplay = card.querySelector('[data-hours]');
  const minutesDisplay = card.querySelector('[data-minutes]');
  const secondsDisplay = card.querySelector('[data-seconds]');
  
  const startBtn = card.querySelector('[data-start]');
  const pauseBtn = card.querySelector('[data-pause]');
  const resetBtn = card.querySelector('[data-reset]');
  const statusDiv = card.querySelector('[data-status]');
  
  // Start countdown
  startBtn.addEventListener('click', () => {
    if (countdown.isPaused) {
      // Resume from pause
      countdown.isPaused = false;
      countdown.endTime = Date.now() + countdown.remainingMs;
      startTicking(countdown, card);
      updateStatus(statusDiv, 'running', 'Running...');
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    } else {
      // Start new countdown
      const days = parseInt(daysInput.value) || 0;
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      
      const totalMs = (days * 86400000) + (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
      
      if (totalMs === 0) {
        updateStatus(statusDiv, '', 'Please set a duration');
        return;
      }
      
      if (totalMs > 365 * 86400000) {
        updateStatus(statusDiv, '', 'Maximum duration is 1 year');
        return;
      }
      
      countdown.endTime = Date.now() + totalMs;
      countdown.remainingMs = totalMs;
      countdown.isPaused = false;
      
      startTicking(countdown, card);
      updateStatus(statusDiv, 'running', 'Running...');
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    }
  });
  
  // Pause countdown
  pauseBtn.addEventListener('click', () => {
    countdown.isPaused = true;
    clearInterval(countdown.intervalId);
    updateStatus(statusDiv, 'paused', 'Paused');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });
  
  // Reset countdown
  resetBtn.addEventListener('click', () => {
    countdown.isPaused = false;
    countdown.endTime = null;
    countdown.remainingMs = 0;
    clearInterval(countdown.intervalId);
    
    updateDisplay(daysDisplay, hoursDisplay, minutesDisplay, secondsDisplay, 0, 0, 0, 0);
    updateStatus(statusDiv, '', 'Ready to start');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });
});

// Start the ticking interval
function startTicking(countdown, card) {
  const daysDisplay = card.querySelector('[data-days]');
  const hoursDisplay = card.querySelector('[data-hours]');
  const minutesDisplay = card.querySelector('[data-minutes]');
  const secondsDisplay = card.querySelector('[data-seconds]');
  const statusDiv = card.querySelector('[data-status]');
  const startBtn = card.querySelector('[data-start]');
  const pauseBtn = card.querySelector('[data-pause]');
  
  // Clear any existing interval
  if (countdown.intervalId) {
    clearInterval(countdown.intervalId);
  }
  
  // Update immediately
  updateCountdown();
  
  // Then update every second
  countdown.intervalId = setInterval(updateCountdown, 1000);
  
  function updateCountdown() {
    if (countdown.isPaused) return;
    
    const now = Date.now();
    const remaining = countdown.endTime - now;
    
    if (remaining <= 0) {
      // Countdown complete
      clearInterval(countdown.intervalId);
      updateDisplay(daysDisplay, hoursDisplay, minutesDisplay, secondsDisplay, 0, 0, 0, 0);
      updateStatus(statusDiv, 'completed', '🎉 Time\'s up!');
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      countdown.endTime = null;
      countdown.remainingMs = 0;
      
      // Play a sound or notification (optional)
      playCompletionSound();
      return;
    }
    
    countdown.remainingMs = remaining;
    
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    updateDisplay(daysDisplay, hoursDisplay, minutesDisplay, secondsDisplay, days, hours, minutes, seconds);
  }
}

// Update the display
function updateDisplay(daysEl, hoursEl, minutesEl, secondsEl, days, hours, minutes, seconds) {
  daysEl.textContent = String(days).padStart(3, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Update status message
function updateStatus(statusEl, className, message) {
  statusEl.className = 'countdown-status ' + className;
  statusEl.textContent = message;
}

// Optional: Play a sound when countdown completes
function playCompletionSound() {
  // You can add audio here if desired
  // const audio = new Audio('completion.mp3');
  // audio.play();
}
