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
        this.lastDeliveryTime = 0;
        this.comboWindowMs = 4000; // Time window for combo bonus
        this.comboBonus = 2; // Bonus dollars for quick deliveries

        // Timer initialization
        this.timer = new GameTimer(this.timeLimit, () => this.endGame(false));

        this.gameRunning = false;
        this.isPaused = false;
        this.isMuted = false;

        // Track occupied lanes to avoid overlapping obstacles
        this.occupiedLanes = { 0: false, 1: false };

        this.initObstacles(3); // Initialize obstacles with lane tracking
        this.deliverySpawned = false;
        this.initEventListeners();

        // Sound effects
        this.sfx = {
            delivery: new Audio('./assets/sounds/button-202966.mp3'),
            crash: new Audio('./assets/sounds/motorcycle-sound-effects-sfx-179535.mp3')
        };
        this.sfx.delivery.volume = 0.4;
        this.sfx.crash.volume = 0.2;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.road = new Road(this.canvas);
        this.environment = new Environment(this.canvas);
        if (this.player) {
            this.player.onResize();
        }
        if (this.npc) {
            this.npc.calculatePosition(this.road);
        }
        if (this.obstacles.length) {
            this.obstacles.forEach((obstacle) => obstacle.onResize(this.road));
        }
        if (this.deliveryPoints.length) {
            this.deliveryPoints.forEach((point) => point.onResize(this.road));
        }
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
        if (this.deliverySpawned) return;
        this.deliverySpawned = true;
        // Dynamically spread delivery points over the game time
        for (let i = 0; i < this.totalDeliveryPoints; i++) {
            const delay = Math.random() * this.timeLimit * 1000; // Random delay in milliseconds
            setTimeout(() => {
                this.deliveryPoints.push(new DeliveryPoint(this.canvas, this.road));
            }, delay);
        }
    }

    update() {
        if (!this.gameRunning || this.isPaused) return;

        this.environment.update();
        this.road.update();
        this.player.move(this.keys);
        this.player.update();
        this.npc.update(this.road, this.deliveryPoints);

        // Update obstacles and check collisions
        this.obstacles.forEach((obstacle) => {
            obstacle.update(this.player.speed);
            if (obstacle.checkCollision(this.player)) {
                this.playSound(this.sfx.crash);
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
                const now = Date.now();
                if (this.lastDeliveryTime && now - this.lastDeliveryTime <= this.comboWindowMs) {
                    this.totalEarnings += this.comboBonus;
                }
                this.totalEarnings += this.deliveryReward;
                this.lastDeliveryTime = now;
                this.playSound(this.sfx.delivery);

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

        // Draw HUD
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Deliveries: ${this.score}/${this.targetDeliveries}`, 20, 30);
        this.ctx.fillText(`Speed: ${this.player.speed.toFixed(1)}`, 20, 55);
        this.ctx.fillText(`Earnings: $${this.totalEarnings}`, 20, 80);
        this.ctx.fillText('P: Pause  |  M: Mute', 20, 105);
        this.timer.display(this.ctx);

        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '36px Arial';
            this.ctx.fillText('Paused', this.canvas.width / 2 - 60, this.canvas.height / 2);
        }
    }

    startGame() {
        this.gameRunning = true;
        this.scheduleDeliveryPoints();
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
        const bg = window.backgroundMusic;
        if (bg) {
            bg.pause();
            bg.currentTime = 0; // Reset the music
        }
    
        const baseEarnings = this.score * this.deliveryReward;
        const bonusEarnings = success ? this.timer.remainingTime * this.bonusMultiplier : 0;
        this.totalEarnings += bonusEarnings;
        const comboEarnings = Math.max(0, this.totalEarnings - baseEarnings - bonusEarnings);
    
        const message = success
            ? `You Won! Total Earnings: $${this.totalEarnings} ($${baseEarnings} base + $${comboEarnings} combo + $${bonusEarnings} bonus)`
            : `Game Over! Total Earnings: $${this.totalEarnings}`;
    
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
            if (e.key.toLowerCase() === 'p') this.togglePause();
            if (e.key.toLowerCase() === 'm') this.toggleMute();
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
    }

    togglePause() {
        if (!this.gameRunning) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.timer.pause();
        } else {
            this.timer.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const bg = window.backgroundMusic;
        if (bg) {
            bg.muted = this.isMuted;
        }
    }

    playSound(sound) {
        if (!sound || this.isMuted) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// Initialize dialogue and game
const dialogues = [
    { speaker: 'Manager', message: 'Hello Mike,' },
    { speaker: 'Mike', message: 'Hi Lola,' },
    { speaker: 'Manager', message: 'You need to deliver 15 packages in 90 seconds.' },
    { speaker: 'Mike', message: "Let's do this!" },
];
