# The Delivery Man Game - Project Documentation

## **Overview**
The **Delivery Man Game** is a web-based game built using **HTML, CSS, and JavaScript**. The objective is to deliver packages within a set time while avoiding obstacles. 

### **Key Features**
- 🎮 **Interactive Gameplay** – Control a delivery rider and navigate the streets.
- 🗨 **Dynamic Dialogue System** – Pre-game conversation between the **Manager** and the **Delivery Driver**.
- 🚧 **Obstacles & NPCs** – Avoid moving obstacles and interact with NPCs.
- ⏳ **Game Timer** – Deliver packages before time runs out.
- 🎵 **Background Music** – Enhances the gaming experience.
- 🏆 **Win/Lose Conditions** – Complete 15 deliveries to win or fail if time runs out.

### **▶ Play the Game**
[👉 **Click Here to Play**](https://code-abbey.github.io/CCL1/)

### **GitHub Pages Setup**
1. In GitHub, open the repository **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Select **Branch: main** and **/ (root)**, then save.
4. The site will be available at: `https://<your-username>.github.io/CCL1/`.

---

## **Project Structure**
```
/delivery-game
├── index.html       # Home Screen
├── game.html        # Game & Dialogue
├── styles.css       # Game UI & Styling
├── README.md        # Documentation
├── /assets/
│   ├── /images/     # Game images
│   ├── /sounds/     # Background music
├── /scripts/
│   ├── script.js    # Handles game transitions
│   ├── game.js      # Core game logic
│   ├── dialogue.js  # Dialogue system
│   ├── player.js    # Player movement
│   ├── npc.js       # NPC behavior
│   ├── timer.js     # Countdown timer
│   ├── obstacle.js  # Obstacles
│   ├── road.js      # Road mechanics
│   ├── environment.js # Background environment
│   ├── deliveryPoint.js # Delivery points
```

---

## **Game Flow**
1. **Home Screen (`index.html`)**
   - Displays "Start Game" button.
   - Starts background music when the game begins.
2. **Dialogue System (`dialogue.js`)**
   - Conversation between Manager & Driver.
   - Once completed, the game starts.
3. **Gameplay (`game.js`)**
   - Player must complete 15 deliveries within 90 seconds.
   - Avoid obstacles and move across lanes.
   - NPCs add additional challenges.
4. **Win/Lose Condition**
   - **Win**: Successfully deliver 15 packages.
   - **Lose**: Timer runs out or the player collides with an obstacle.
5. **Game Ends**
   - Displays message with total earnings.
   - "Restart" button appears.

---

## **Key Features & Technical Breakdown**

### **Player Controls (`player.js`)**
```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'a') this.lane--;  // Move left
    if (e.key === 'd') this.lane++;  // Move right
    if (e.key === 'w') this.speed += 0.5; // Accelerate
    if (e.key === 's') this.speed -= 0.5; // Decelerate
    if (e.key === ' ') this.player.fly(); // Jump
});
```
**Handles movement, acceleration, deceleration, and jumping.**
```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'a') this.lane--;  // Move left
    if (e.key === 'd') this.lane++;  // Move right
    if (e.key === ' ') this.player.fly(); // Jump
});
```
**Handles movement, acceleration, and jumping.**

### **Road Mechanics (`road.js`)**
```javascript
export class Road {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    update() {
        // Logic to animate the road
    }
}
```
**Handles road rendering and movement to simulate driving.**

### **Background Environment (`environment.js`)**
```javascript
export class Environment {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    update() {
        // Logic for background animations
    }
}
```
**Manages background elements to enhance gameplay realism.**

### **NPC Behavior (`npc.js`)**
```javascript
export class NPC {
    constructor(canvas, road) {
        this.lane = Math.floor(Math.random() * 2);
        this.y = -120; // Start off-screen
        this.speed = 4 + Math.random() * 2;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) this.reset();
    }
}
```
**NPC moves dynamically across lanes and resets when leaving the screen.**

### **Timer System (`timer.js`)**
```javascript
export class GameTimer {
    constructor(timeLimit, onTimeUp) {
        this.remainingTime = timeLimit;
        this.onTimeUp = onTimeUp;
    }
    start() {
        this.interval = setInterval(() => {
            this.remainingTime--;
            if (this.remainingTime <= 0) {
                clearInterval(this.interval);
                this.onTimeUp();
            }
        }, 1000);
    }
}
```
**Ensures game time limit is enforced.**

### **Win/Lose Condition (`game.js`)**
```javascript
if (this.score >= this.targetDeliveries) {
    this.endGame(true); // Player wins
}

this.obstacles.forEach((obstacle) => {
    if (obstacle.checkCollision(this.player)) {
        this.endGame(false); // Player loses
    }
});
```
**Checks for successful deliveries or collisions to determine game outcome.**

### **Pause & Mute**
- **P** toggles pause.
- **M** toggles mute.

### **Background Music (`script.js`)**
```javascript
let backgroundMusic = new Audio('./assets/sounds/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

function startMusic() {
    backgroundMusic.play().catch(error => console.error("Error playing music:", error));
}
```
**Manages looping background music that plays throughout the game.**

---

## **Future Enhancements**
✔️ **More difficulty levels** (Easy, Medium, Hard).  
✔️ **Power-ups** (Speed boosts, extra time, invincibility).  
✔️ **Sound effects** (Collisions, jumps, deliveries).  
✔️ **Better animations and UI effects**.    

---

## **Summary**
✔️ **Player Controls** – Move with **A/D keys**, accelerate with **W**, decelerate with **S**, and jump with **Spacebar**.  
✔️ **Smooth Gameplay Loop** – The game continuously updates player movement, NPC actions, and animations.  
✔️ **Dynamic NPC Behavior** – NPCs move unpredictably to increase difficulty.  
✔️ **Win Condition** – Successfully deliver **15 packages** before time runs out.  
✔️ **Lose Condition** – Game over if you **collide with an obstacle** or **run out of time**.  
✔️ **Realistic Speed Mechanics** – Players can **accelerate and decelerate** for better maneuverability.  
✔️ **Immersive Experience** – **Background music** plays throughout, and the **road & environment animate** to enhance realism.  

---

## **Final Thoughts**
This project showcases how **JavaScript, HTML5 Canvas, and CSS** integrate to create an interactive game experience. It is my **first game project**, developed using concepts from the **WS2024 Creative Computing** course at [University of Applied Sciences St Pölten](https://www.ustp.at/en/study-programmes/media-digital-technologies/creative-computing?set_language=en).  

The game features **dynamic player controls, NPC behavior, obstacle avoidance, and a pre-game dialogue system**, all combined with **custom animations, audio integration, and a game timer**.  

🔹 **Future Enhancements** – Expanding gameplay with power-ups, more challenging obstacles, and additional levels could make it even more immersive.  

📌 **Personal Note:** I personally designed all the artwork used in this project (**`/assets/images`**) using **Adobe Illustrator**.  

