export class Obstacle {
    constructor(canvas, road, images, occupiedLanes) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const laneWidth = road.width / 2;
        const roadX = road.x;

        this.lane = this.getAvailableLane(occupiedLanes); // Get an available lane
        this.width = laneWidth - 40; // Slightly smaller than the lane
        this.height = 60; // Adjust height for obstacle image
        this.x = roadX + this.lane * laneWidth + (laneWidth - this.width) / 2; // Position in lane
        this.y = this.getRandomYPosition(); // Start off-screen
        this.speed = road.speed + 2; // Slightly faster than road

        // Load obstacle images
        this.images = images;
        this.image = this.getRandomImage(); // Randomly pick an image

        // Mark the lane as occupied
        occupiedLanes[this.lane] = true;
        this.occupiedLanes = occupiedLanes;
    }

    getAvailableLane(occupiedLanes) {
        const availableLanes = [0, 1].filter((lane) => !occupiedLanes[lane]); // Find lanes that are not occupied
        if (availableLanes.length === 0) {
            return Math.floor(Math.random() * 2); // Fallback if no lanes are free (shouldn't happen)
        }
        return availableLanes[Math.floor(Math.random() * availableLanes.length)]; // Randomly select an available lane
    }

    getRandomImage() {
        // Randomly select an image from the array
        return this.images[Math.floor(Math.random() * this.images.length)];
    }

    getRandomYPosition() {
        return Math.random() * -500 - this.height; // Position off-screen
    }

    update(playerSpeed) {
        this.y += playerSpeed; // Move down at player's speed

        // Reset position if off-screen
        if (this.y > this.canvas.height) {
            this.y = this.getRandomYPosition();
            this.lane = this.getAvailableLane(this.occupiedLanes); // Get a new available lane
            this.x = (this.canvas.width * 0.3 / 2) * this.lane + 
                     ((this.canvas.width - this.canvas.width * 0.3) / 2) + 
                     ((this.canvas.width * 0.3 / 2 - this.width) / 2);
            this.image = this.getRandomImage(); // Change image

            // Mark the new lane as occupied
            this.occupiedLanes[this.lane] = true;
        }
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        const playerBottom = player.y + player.height;
        const playerTop = player.y;
        const playerLeft = player.x;
        const playerRight = player.x + player.width;

        const obstacleBottom = this.y + this.height;
        const obstacleTop = this.y;
        const obstacleLeft = this.x;
        const obstacleRight = this.x + this.width;

        // Ignore collision if the player is flying
        if (player.isFlying || playerBottom <= obstacleTop) {
            return false;
        }

        // Check for overlap between player and obstacle
        return (
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight &&
            playerBottom > obstacleTop &&
            playerTop < obstacleBottom
        );
    }
}
