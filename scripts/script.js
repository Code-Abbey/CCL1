let backgroundMusic; // Module-scoped background music
let musicEnabled = false;

function ensureBackgroundMusic() {
    if (!backgroundMusic) {
        backgroundMusic = new Audio('./assets/sounds/emotional-guitar-loop-v13-275455.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
        window.backgroundMusic = backgroundMusic; // Expose for game controls
    }
}

function tryPlayBackgroundMusic() {
    ensureBackgroundMusic();
    if (musicEnabled) {
        backgroundMusic.play().catch(error => console.error("Error playing background music:", error));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("homeContainer")) {
        setupHomePage();
    } else if (document.getElementById("dialogueBox")) {
        setupGamePage();
    }
});

// Home Screen Logic
function setupHomePage() {
    console.log("Home screen loaded.");
    ensureBackgroundMusic();

    const startButton = document.getElementById("startGameBtn");
    if (startButton) {
        startButton.addEventListener("click", () => {
            console.log("Start Game button clicked. Redirecting to game.html...");
            musicEnabled = true;
            sessionStorage.setItem("musicEnabled", "true");
            tryPlayBackgroundMusic();
            window.location.href = "game.html"; // Redirect to the game page
        });
    } else {
        console.error("Error: startGameBtn not found.");
    }
}

// 🎮 Game Page Logic (Handles Dialogue First, Then Starts Game)
function setupGamePage() {
    console.log("Game screen loaded. Checking dialogue system...");
    let gameStarted = false;

    const startGame = () => {
        if (gameStarted) return;
        gameStarted = true;

        const gameContainer = document.getElementById("gameContainer");
        if (gameContainer) {
            gameContainer.classList.remove("hidden");
        } else {
            console.error("Error: gameContainer not found.");
        }

        import('./game.js')
            .then(({ Game }) => {
                console.log("Game.js loaded successfully! Starting game...");
                const game = new Game("gameCanvas");
                game.startGame();
            })
            .catch(error => console.error("Error loading game.js:", error));
    };
    ensureBackgroundMusic();
    musicEnabled = sessionStorage.getItem("musicEnabled") === "true";
    tryPlayBackgroundMusic();

    const gameOverlay = document.getElementById("gameOverlay");
    if (gameOverlay) {
        gameOverlay.classList.add("hidden");
    }

    if (document.getElementById("dialogueBox")) {
        import('./dialogue.js').then(({ Dialogue }) => {
            const dialogues = [
                { speaker: 'Manager', message: 'Hello Mike, are you ready for today’s challenge?' },
                { speaker: 'Mike', message: 'Of course, what’s the plan?' },
                { speaker: 'Manager', message: 'You need to deliver 15 packages in 90 seconds while avoiding obstacles.' },
                { speaker: 'Mike', message: "Got it! Let's do this!" },
            ];

            const dialogue = new Dialogue(dialogues, () => {
                console.log("Dialogue completed, starting game...");
                startGame();
            });

            dialogue.start();
        }).catch(error => {
            console.error("Error loading dialogue.js:", error);
            startGame();
        });
    } else {
        console.error("Error: dialogueBox not found.");
        startGame();
    }

    // If autoplay is blocked, start music on first user interaction
    document.addEventListener(
        "click",
        () => {
            musicEnabled = true;
            sessionStorage.setItem("musicEnabled", "true");
            tryPlayBackgroundMusic();
        },
        { once: true }
    );
}
