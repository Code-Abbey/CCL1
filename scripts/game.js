if (!document.getElementById("gameCanvas")) {
    console.error("Error: gameCanvas not found! Make sure gameContainer is visible before running game.js.");
    throw new Error("Game initialization failed: gameCanvas not found.");
}

import { Road } from './road.js';
import { Player } from './player.js';
import { Obstacle } from './obstacle.js';
import { DeliveryPoint } from './deliveryPoint.js';
import { NPC } from './npc.js';
import { Environment } from './environment.js';
import { GameTimer } from './timer.js';
import { Dialogue } from './dialogue.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.keys = { a: false, d: false, w: false, s: false, space: false };

        this.resizeCanvas();

        this.road = new Road(this.canvas);
        this.environment = new Environment(this.canvas);
        this.player = new Player(this.canvas);
        this.obstacles = [];
        this.deliveryPoints = [];
        this.npc = new NPC(this.canvas, this.road);

        // Game configuration
        this.score = 0;
        this.targetDeliveries = 15; // Deliveries needed to win
        this.totalDeliveryPoints = 30; // Total delivery points in the game
        this.timeLimit = 90; // Time in seconds
        this.deliveryReward = 5; // Dollars per delivery
        this.bonusMultiplier = 2; // Dollars per remaining second
        this.totalEarnings = 0;

        // Timer initialization
        this.timer = new GameTimer(this.timeLimit, () => this.endGame(false));

        this.gameRunning = false;

        // Track occupied lanes to avoid overlapping obstacles
        this.occupiedLanes = { 0: false, 1: false };

        this.initObstacles(3); // Initialize obstacles with lane tracking
        this.scheduleDeliveryPoints(); // Spread deliveries dynamically
        this.initEventListeners();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.road = new Road(this.canvas);
        this.environment = new Environment(this.canvas);
    }

    initObstacles(count) {
        const obstacleImages = [
            './assets/images/obstacle1.png',
            './assets/images/obstacle2.png',
            './assets/images/obstacle5.png',
            './assets/images/obstacle6.png',
        ];

        // Preload images
        const loadedImages = obstacleImages.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        this.obstacles = [];
        for (let i = 0; i < count; i++) {
            this.obstacles.push(new Obstacle(this.canvas, this.road, loadedImages, this.occupiedLanes));
        }
    }

    scheduleDeliveryPoints() {
        // Dynamically spread delivery points over the game time
        for (let i = 0; i < this.totalDeliveryPoints; i++) {
            const delay = Math.random() * this.timeLimit * 1000; // Random delay in milliseconds
            setTimeout(() => {
                if (this.gameRunning) {
                    this.deliveryPoints.push(new DeliveryPoint(this.canvas, this.road));
                }
            }, delay);
        }
    }

    update() {
        if (!this.gameRunning) return;

        this.environment.update();
        this.road.update();
        this.player.move(this.keys);
        this.player.update();
        this.npc.update(this.road, this.deliveryPoints);

        // Update obstacles and check collisions
        this.obstacles.forEach((obstacle) => {
            obstacle.update(this.player.speed);
            if (obstacle.checkCollision(this.player)) {
                this.endGame(false);
            }
        });

        // Update delivery points
        this.deliveryPoints.forEach((point, index) => {
            point.update(this.player.speed);
            if (point.checkCollection(this.player)) {
                point.isCollected = true;
                this.deliveryPoints.splice(index, 1); // Remove collected delivery point
                this.score++;

                // Win condition
                if (this.score >= this.targetDeliveries) {
                    this.endGame(true);
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.environment.draw();
        this.road.draw();
        this.player.draw();
        this.npc.draw();
        this.obstacles.forEach((obstacle) => obstacle.draw());
        this.deliveryPoints.forEach((point) => point.draw());

        // Draw score and timer
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Deliveries: ${this.score}/${this.targetDeliveries}`, 20, 30);
        this.timer.display(this.ctx);
    }

    startGame() {
        this.gameRunning = true;
        this.timer.start();
        this.gameLoop();
    }

    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    endGame(success) {
        this.gameRunning = false;
        this.timer.stop();
    
        // Stop background music when the game ends
        if (typeof backgroundMusic !== 'undefined' && backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0; // Reset the music
        }
    
        const baseEarnings = this.score * this.deliveryReward;
        const bonusEarnings = success ? this.timer.remainingTime * this.bonusMultiplier : 0;
        this.totalEarnings = baseEarnings + bonusEarnings;
    
        const message = success
            ? `You Won! Total Earnings: $${this.totalEarnings} ($${baseEarnings} + $${bonusEarnings} bonus)`
            : `Game Over! Total Earnings: $${baseEarnings}`;
    
        // Display overlay
        document.getElementById('overlayMessage').textContent = message;
        document.getElementById('gameOverlay').classList.remove('hidden');
    }    

    restartGame() {
        location.reload(); // Reload the page to restart
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') this.player.fly(); // Fly
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
    }
}

// Initialize dialogue and game
const dialogues = [
    { speaker: 'Manager', message: 'Hello Mike,' },
    { speaker: 'Mike', message: 'Hi Lola,' },
    { speaker: 'Manager', message: 'You need to deliver 15 packages in 90 seconds.' },
    { speaker: 'Mike', message: "Let's do this!" },
];
