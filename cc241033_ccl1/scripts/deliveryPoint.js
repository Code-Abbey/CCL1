export class DeliveryPoint {
    constructor(canvas, road) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const laneWidth = road.width / 2;
        const roadX = road.x;

        this.lane = Math.floor(Math.random() * 2); // Randomly select a lane
        this.width = 30;
        this.height = 40;
        this.x = roadX + this.lane * laneWidth + (laneWidth - this.width) / 2;
        this.y = this.getRandomYPosition(); // Start off-screen
        this.isCollected = false;

        // Load delivery point image
        this.image = new Image();
        this.image.src = './assets/images/deliveryLoc.png';
    }

    getRandomYPosition() {
        return Math.random() * -300 - this.height; // Randomize Y position above screen
    }

    update(playerSpeed) {
        this.y += playerSpeed; // Move downward with player speed

        // Reset position if off-screen
        if (this.y > this.canvas.height) {
            this.y = this.getRandomYPosition();
            this.lane = Math.floor(Math.random() * 2); // Randomize lane
        }
    }

    draw() {
        if (!this.isCollected) {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    checkCollection(player) {
        return (
            !this.isCollected &&
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}
