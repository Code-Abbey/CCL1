let backgroundMusic; // Global variable for background music

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

    // Initialize and play background music
    backgroundMusic = new Audio('./assets/sounds/emotional-guitar-loop-v13-275455.mp3');
    backgroundMusic.loop = true; // Make sure it loops
    backgroundMusic.volume = 0.5; // Adjust volume if needed
    backgroundMusic.play().catch(error => console.error("Error playing background music:", error));

    const startButton = document.getElementById("startGameBtn");
    if (startButton) {
        startButton.addEventListener("click", () => {
            console.log("Start Game button clicked. Redirecting to game.html...");
            window.location.href = "game.html"; // Redirect to the game page
        });
    } else {
        console.error("Error: startGameBtn not found.");
    }
}

// 🎮 Game Page Logic (Handles Dialogue First, Then Starts Game)
function setupGamePage() {
    console.log("Game screen loaded. Checking dialogue system...");

    if (!backgroundMusic) {
        backgroundMusic = new Audio('./assets/sounds/emotional-guitar-loop-v13-275455.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(error => console.error("Error playing background music:", error));
    }

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
                const dialogueContainer = document.getElementById("dialogueContainer");
                if (dialogueContainer) {
                    dialogueContainer.remove();
                }

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
            });

            dialogue.start();
        });
    } else {
        console.error("Error: dialogueBox not found.");
    }
}
