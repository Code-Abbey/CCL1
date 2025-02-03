export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 80; // Width of the player
        this.height = 120; // Height of the player
        this.lane = 0; // Start in the left lane
        this.y = canvas.height - this.height - 100; // Ground position
        this.baseY = this.y; // Fixed ground position
        this.speed = 5; // Default speed
        this.acceleration = 0.2;
        this.maxSpeed = 12;
        this.minSpeed = 2;

        // Flyover properties
        this.isFlying = false;
        this.flyHeight = 150; // Maximum height during flyover
        this.flyDuration = 1500; // Fly duration in milliseconds
        this.flyStartTime = 0;

        // Load player image
        this.image = new Image();
        this.image.src = './assets/images/player.png';

        // Calculate initial position
        this.calculatePosition();
    }

    calculatePosition() {
        const roadWidth = this.canvas.width * 0.3; // Road is 30% of canvas width
        const laneWidth = roadWidth / 2; // Two lanes
        const roadX = (this.canvas.width - roadWidth) / 2; // Center the road
        this.x = roadX + this.lane * laneWidth + (laneWidth - this.width) / 2;
    }

    fly() {
        if (this.isFlying) return; // Prevent multiple flyovers
        this.isFlying = true;
        this.flyStartTime = Date.now();
    }

    move(keys) {
        // Lane changes
        if (keys.a && this.lane > 0) {
            this.lane -= 1;
            this.calculatePosition();
        }
        if (keys.d && this.lane < 1) {
            this.lane += 1;
            this.calculatePosition();
        }

        // Adjust speed with W (accelerate) and S (decelerate)
        if (keys.w) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        }
        if (keys.s) {
            this.speed = Math.max(this.speed - this.acceleration, this.minSpeed);
        }
    }

    update() {
        if (this.isFlying) {
            const elapsed = Date.now() - this.flyStartTime;
            const halfDuration = this.flyDuration / 2;

            if (elapsed <= this.flyDuration) {
                if (elapsed <= halfDuration) {
                    // Ascend during the first half of the flyDuration
                    this.y = this.baseY - (this.flyHeight * (elapsed / halfDuration));
                } else {
                    // Descend during the second half
                    this.y = this.baseY - this.flyHeight + (this.flyHeight * ((elapsed - halfDuration) / halfDuration));
                }
            } else {
                // End flyover and reset to ground position
                this.isFlying = false;
                this.y = this.baseY;
            }
        }
    }

    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            // Draw player image
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to rectangle if image is not loaded
            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Add shadow effect for flying
        const shadowScale = this.isFlying ? (this.baseY - this.y) / this.flyHeight : 1;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.x + this.width / 2,
            this.baseY + this.height,
            (this.width / 2) * shadowScale,
            5 * shadowScale,
            0,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
}
