// Sound Management
const sounds = {
    ambient: new Howl({
        src: ['audio/ambient.mp3'],
        loop: true,
        volume: 0.5
    }),
    doorCreak: new Howl({
        src: ['audio/door-creak.mp3'],
        volume: 0.8
    }),
    trapped: new Howl({
        src: ['audio/trapped.mp3'],
        volume: 1
    })
};

// Game State
let currentRoom = 1;
let isTransitioning = false;

// DOM Elements
const landingPage = document.getElementById('landing-page');
const gameContainer = document.getElementById('game-container');
const rooms = document.querySelectorAll('.room');
const doors = document.querySelectorAll('.door');
const startButton = document.getElementById('start-btn');
const loadingScreen = document.getElementById('loading-screen');
const trappedMessage = document.getElementById('trapped-message');

// Initialize Game
function initGame() {
    loadingScreen.style.display = 'flex';
    
    // Preload assets
    Promise.all([
        preloadImages(),
        preloadSounds()
    ]).then(() => {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            landingPage.classList.add('active');
        }, 2000);
    });
}

// Preload Functions
function preloadImages() {
    const images = [
        'images/cobweb.png',
        'images/ghost.png',
        'images/skeleton.png',
        'images/candle.png'
    ];
    
    return Promise.all(images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }));
}

function preloadSounds() {
    return new Promise(resolve => {
        sounds.ambient.once('load', resolve);
        sounds.doorCreak.once('load', resolve);
        sounds.trapped.once('load', resolve);
    });
}

// Game Start
function startGame() {
    landingPage.classList.remove('active');
    gameContainer.classList.add('active');
    sounds.ambient.play();
}

// Room Navigation
function navigateToRoom(roomNumber) {
    if (isTransitioning) return;
    isTransitioning = true;

    const currentRoomElement = document.getElementById(`room${currentRoom}`);
    const nextRoomElement = document.getElementById(`room${roomNumber}`);

    // Play door sound
    sounds.doorCreak.play();

    // Animate current room out
    gsap.to(currentRoomElement, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            currentRoomElement.classList.remove('active');
            
            // Check if we're going back to room 1
            if (currentRoom === 3 && roomNumber === 1) {
                showTrappedMessage();
            }

            // Animate next room in
            nextRoomElement.classList.add('active');
            gsap.fromTo(nextRoomElement,
                { opacity: 0 },
                { 
                    opacity: 1,
                    duration: 0.5,
                    onComplete: () => {
                        currentRoom = roomNumber;
                        isTransitioning = false;
                    }
                }
            );
        }
    });
}

// Trapped Message
function showTrappedMessage() {
    sounds.trapped.play();
    trappedMessage.style.display = 'flex';
