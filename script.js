// DOM Elements
const musicToggle = document.getElementById('musicToggle');
const loveMessageElement = document.getElementById('loveMessage');
const heartsContainer = document.getElementById('heartsContainer');

// Love messages array
const loveMessages = [
    "You're my favorite notification",
    "My heart does a little dance when I think of you",
    "You're the WiFi to my internet",
    "You make my soul sparkle",
    "I fall for you more every single day",
    "You're my favorite hello and hardest goodbye",
    "Life is better in rose-colored glasses... especially when I'm looking at you",
    "You're the cheese to my macaroni",
    "My heart is yours, Rose",
    "You're my favorite adventure",
    "I love you more than coffee... and that's saying something",
    "You make every day feel like Valentine's Day",
    "You're the melody in my La Vie en Rose",
    "My love for you grows like a wildflower",
    "You're my favorite dream come true",
    "You're sweeter than dessert",
    "I'm so lucky to have you, Rose",
    "You're my sunshine on cloudy days",
    "My world is better with you in it",
    "You're the rose in my garden of life"
];

// Initialize music player with Howler.js
let musicPlayer;
let isPlaying = false;

// Function to initialize music player
function initMusic() {
    try {
        // Using a royalty-free instrumental track
        musicPlayer = new Howl({
            src: ['https://archive.org/download/78_la-vie-en-rose-orchestre-dir-luypaerts-edith-piaf-edith-piaf/17251%20La%20vie%20en%20rose.mp3'],
            volume: 0.3,
            loop: true,
            onload: function() {
                console.log('Music loaded successfully');
                // Auto-play music after user interaction (due to browser policies)
                // We'll play it when the page loads but with a slight delay to ensure it works
                setTimeout(() => {
                    playMusic();
                }, 1000);
            },
            onloaderror: function(id, err) {
                console.error('Error loading music:', err);
            },
            onplayerror: function() {
                console.error('Error playing music');
                // Fallback to try again
                musicPlayer.once('load', () => {
                    musicPlayer.play();
                });
            }
        });
    } catch (error) {
        console.error('Error initializing Howler.js:', error);
    }
}

// Function to play music
function playMusic() {
    if (musicPlayer && !isPlaying) {
        musicPlayer.play();
        isPlaying = true;
        updateMusicButton();
    }
}

// Function to pause music
function pauseMusic() {
    if (musicPlayer && isPlaying) {
        musicPlayer.pause();
        isPlaying = false;
        updateMusicButton();
    }
}

// Function to toggle music
function toggleMusic() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// Update music button icon
function updateMusicButton() {
    const icon = musicToggle.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        icon.setAttribute('aria-label', 'Pause Music');
    } else {
        icon.className = 'fas fa-play';
        icon.setAttribute('aria-label', 'Play Music');
    }
}

// Current message index
let currentMessageIndex = 0;

// Function to display next love message with fade effect
function displayNextMessage() {
    // Add fade out class to current message
    loveMessageElement.classList.add('fade-out');
    
    // After fade out completes, update the message and fade in
    setTimeout(() => {
        // Move to next message (loop back to start if needed)
        currentMessageIndex = (currentMessageIndex + 1) % loveMessages.length;
        
        // Update the message text
        loveMessageElement.textContent = loveMessages[currentMessageIndex];
        
        // Remove fade out class to reset for next animation
        loveMessageElement.classList.remove('fade-out');
        
        // Trigger reflow to restart animation
        void loveMessageElement.offsetWidth;
        
        // Add the fade-in animation class
        loveMessageElement.style.animation = 'none';
        void loveMessageElement.offsetWidth; // Trigger reflow
        loveMessageElement.style.animation = 'fadeInOut 2s ease-in-out';
    }, 2000); // Match the duration of the fade-out animation
}

// Function to create floating hearts
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    
    // Random position
    const startPosition = Math.random() * window.innerWidth;
    heart.style.left = `${startPosition}px`;
    
    // Random size
    const size = 15 + Math.random() * 15;
    heart.style.fontSize = `${size}px`;
    
    // Random animation duration (5-15 seconds)
    const duration = 5 + Math.random() * 10;
    heart.style.animationDuration = `${duration}s`;
    
    // Random delay
    const delay = Math.random() * 5;
    heart.style.animationDelay = `${delay}s`;
    
    // Add to container
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation completes to prevent too many elements
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, duration * 1000);
}

// Function to generate multiple hearts periodically
function startHeartGenerator() {
    setInterval(() => {
        // Create 1-3 hearts at a time
        const heartCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < heartCount; i++) {
            setTimeout(createFloatingHeart, i * 300);
        }
    }, 2000); // Create new batch of hearts every 2 seconds
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize music player
    initMusic();
    
    // Start rotating love messages every 5 seconds
    displayNextMessage(); // Show the first message
    setInterval(displayNextMessage, 5000);
    
    // Start generating floating hearts
    startHeartGenerator();
    
    // Add event listener to music toggle button
    musicToggle.addEventListener('click', toggleMusic);
    
    // Enable smooth scrolling
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Handle visibility change to pause/resume animations when tab is not active
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Tab is hidden - we could pause non-essential animations here
        } else {
            // Tab is visible - resume if needed
        }
    });
});

// Additional accessibility features
document.addEventListener('keydown', function(event) {
    // Allow spacebar to toggle music
    if (event.code === 'Space' && event.target !== document.body) {
        event.preventDefault();
        toggleMusic();
    }
});

// Error handling for audio
window.addEventListener('error', function(e) {
    if (e.message.toLowerCase().includes('howler')) {
        console.warn('Audio library error, attempting recovery...');
        // Attempt to reinitialize if there was an audio error
        setTimeout(initMusic, 2000);
    }
}, true);

// Handle network status changes
window.addEventListener('online', function() {
    console.log('Connection restored, attempting to reload audio...');
    if (musicPlayer) {
        // Try to reload audio when connection is restored
        setTimeout(initMusic, 1000);
    }
});
