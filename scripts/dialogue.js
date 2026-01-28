export class Dialogue {
    constructor(dialogues, onComplete) {
        this.dialogues = dialogues;
        this.onComplete = onComplete;
        this.currentIndex = 0;
        this.handleKeyDown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                this.nextDialogue();
            }
        };
    }

    start() {
        this.renderDialogue();
    }

    renderDialogue() {
        const dialogueBox = document.getElementById('dialogueBox');
        const dialogueText = document.getElementById('dialogueText');
        const speakerImage = document.getElementById('speakerImage');
        const nextButton = document.getElementById('nextButton');
        const skipButton = document.getElementById('skipButton');

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

        // Update button label on final line
        if (nextButton) {
            nextButton.textContent = this.currentIndex === this.dialogues.length - 1 ? 'Start Delivery' : 'Next';
            nextButton.onclick = () => this.nextDialogue();
        }

        if (skipButton) {
            skipButton.onclick = () => this.endDialogue();
        }

        // Keyboard support
        document.removeEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keydown', this.handleKeyDown);
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
        document.removeEventListener('keydown', this.handleKeyDown);

        // Remove the dialogue container if it exists
        const dialogueContainer = document.getElementById('dialogueContainer');
        if (dialogueContainer) {
            dialogueContainer.remove(); // Completely removes the dialogue box from the DOM
        } else {
            console.warn("Warning: dialogueContainer not found, skipping removal.");
        }

        // Run the game start function safely
        if (typeof this.onComplete === 'function') {
            try {
                this.onComplete();
            } catch (error) {
                console.error("Error running onComplete function:", error);
            }
        }

        if (typeof window.__startGame === 'function') {
            window.__startGame();
        }
    }
}
