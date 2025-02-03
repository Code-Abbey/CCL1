export class NPC {
    constructor(canvas, road) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 80; // Width of the NPC
        this.height = 120; // Height of the NPC
        this.lane = Math.floor(Math.random() * 2); // Start in a random lane
        this.y = canvas.height - this.height - 200; // Initial vertical position
        this.speed = 3; // Base speed of the NPC
        this.targetLane = this.lane; // Initial target lane

        // Load NPC image
        this.image = new Image();
        this.image.src = './assets/images/npc.png';

        this.calculatePosition(road);
    }

    calculatePosition(road) {
        const laneWidth = road.width / 2;
        const roadX = road.x;
        this.x = roadX + this.lane * laneWidth + (laneWidth - this.width) / 2;
    }

    decideBehavior(deliveryPoints) {
        const activePoints = deliveryPoints.filter((point) => !point.isCollected);

        if (activePoints.length > 0) {
            const closestPoint = activePoints.reduce((closest, point) => {
                const distance = Math.abs(this.y - point.y);
                return distance < Math.abs(this.y - closest.y) ? point : closest;
            });

            this.targetLane = closestPoint.lane; // Set target lane to the lane of the closest delivery point
        }
    }

    move() {
        if (this.lane < this.targetLane) {
            this.lane++;
        } else if (this.lane > this.targetLane) {
            this.lane--;
        }
    }

    update(road, deliveryPoints) {
        this.decideBehavior(deliveryPoints);
        this.move();
        this.calculatePosition(road);

        // Simulate NPC moving vertically along the road
        this.y += this.speed;

        // Reset NPC position if it moves off-screen
        if (this.y > this.canvas.height) {
            this.y = -this.height; // Start back off-screen
            this.lane = Math.floor(Math.random() * 2); // Randomize lane
            this.calculatePosition(road);
        }
    }

    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            // Draw NPC image
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to rectangle if image is not loaded
            this.ctx.fillStyle = 'orange';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
