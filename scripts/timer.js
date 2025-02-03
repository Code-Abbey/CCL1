export class GameTimer {
    constructor(duration, onEnd) {
        this.totalDuration = duration;
        this.remainingTime = duration;
        this.interval = null;
        this.onEnd = onEnd;
    }

    start() {
        if (this.interval) return; // Prevent multiple intervals
        this.interval = setInterval(() => {
            this.remainingTime--;
            if (this.remainingTime <= 0) {
                this.stop();
                this.onEnd(); // Trigger the end callback
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    display(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Time Left: ${this.formatTime(this.remainingTime)}`, 20, 60);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
}
