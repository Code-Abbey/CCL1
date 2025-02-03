export class Dialogue {
    constructor(dialogues, onComplete) {
        this.dialogues = dialogues;
        this.onComplete = onComplete;
        this.currentIndex = 0;
    }

    start() {
        this.renderDialogue();
    }

    renderDialogue() {
        const dialogueBox = document.getElementById('dialogueBox');
        const dialogueContainer = document.getElementById('dialogueContainer');
        const dialogueText = document.getElementById('dialogueText');
        const speakerImage = document.getElementById('speakerImage');

        // Get the current message
        const { speaker, message } = this.dialogues[this.currentIndex];

        // Assign different styles based on speaker
        if (speaker === "Manager") {
            dialogueText.className = "manager";
            speakerImage.src = "./assets/images/manager.png";
        } else {
            dialogueText.className = "mike";
            speakerImage.src = "./assets/images/driver.png";
        }

        // Update dialogue text
        dialogueText.innerHTML = `<strong>${speaker}:</strong> ${message}`;

        // Add event to continue dialogue
        document.getElementById('nextButton').onclick = () => this.nextDialogue();
    }

    nextDialogue() {
        this.currentIndex++;
        if (this.currentIndex < this.dialogues.length) {
            this.renderDialogue();
        } else {
            this.endDialogue();
        }
    }

    endDialogue() {
        console.log("Dialogue finished. Hiding dialogue box and starting game...");

        // Remove the dialogue container if it exists
        const dialogueContainer = document.getElementById('dialogueContainer');
        if (dialogueContainer) {
            dialogueContainer.remove(); // Completely removes the dialogue box from the DOM
        } else {
            console.warn("Warning: dialogueContainer not found, skipping removal.");
        }

        // Check if gameContainer exists before modifying it
        const gameContainer = document.getElementById("gameContainer");
        if (gameContainer) {
            gameContainer.classList.remove("hidden"); // Show the game
        } else {
            console.error("Error: gameContainer not found! The game may not start.");
            return; // Stop execution if gameContainer is missing
        }

        // Run the game start function safely
        if (typeof this.onComplete === 'function') {
            try {
                this.onComplete();
            } catch (error) {
                console.error("Error running onComplete function:", error);
            }
        }
    }
}
