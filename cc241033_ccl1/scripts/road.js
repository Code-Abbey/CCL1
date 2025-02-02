export class Road {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width * 0.3; // Road is 30% of canvas width
        this.x = (canvas.width - this.width) / 2; // Center the road
        this.height = canvas.height;
        this.scrollY = 0;
        this.speed = 2; // Scrolling speed
        this.edgeLineOffset = 10; // Offset for the yellow lines from the edge of the road
    }

    update() {
        this.scrollY += this.speed;

        // Reset scrollY to create a continuous loop
        if (this.scrollY >= this.canvas.height) {
            this.scrollY = 0;
        }
    }

    draw() {
        const laneWidth = this.width / 2;

        // Draw the road background
        for (let i = 0; i <= 1; i++) {
            this.ctx.fillStyle = '#444'; // Road color
            this.ctx.fillRect(
                this.x,
                this.scrollY - i * this.canvas.height,
                this.width,
                this.canvas.height
            );

            // Lane divider
            this.ctx.strokeStyle = 'yellow';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([20, 15]);
            const laneDividerX = this.x + laneWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(laneDividerX, this.scrollY - i * this.canvas.height);
            this.ctx.lineTo(laneDividerX, this.scrollY - i * this.canvas.height + this.canvas.height);
            this.ctx.stroke();
        }

        // Add the yellow edge lines inside the road
        this.drawYellowLines();
    }

    drawYellowLines() {
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([]); // Solid lines

        // Left edge line (with offset)
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.edgeLineOffset, 0);
        this.ctx.lineTo(this.x + this.edgeLineOffset, this.canvas.height);
        this.ctx.stroke();

        // Right edge line (with offset)
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width - this.edgeLineOffset, 0);
        this.ctx.lineTo(this.x + this.width - this.edgeLineOffset, this.canvas.height);
        this.ctx.stroke();
    }
}
