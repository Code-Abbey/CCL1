export class Environment {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scrollYLeft = 0; // Independent scroll position for left wing
        this.scrollYRight = 0; // Independent scroll position for right wing

        // Speeds for left and right wings (independent of the road speed)
        this.leftSpeed = 2; // Slower speed for left wing
        this.rightSpeed = 2; // Even slower speed for right wing

        // Preload specific images for the left and right environments
        this.leftImages = [];
        this.rightImages = [];
        this.leftImagePaths = [
            './assets/images/houseLeftWing.png', // Left environment image
            //'./assets/images/garden.png', // Shared left and right environment image
        ];
        this.rightImagePaths = [
            './assets/images/houseRightWing.png', // Right environment image
            //'./assets/images/garden.png', // Shared left and right environment image
        ];

        this.preloadImages();
    }

    preloadImages() {
        // Preload images for the left wing
        this.leftImagePaths.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.leftImages.push(img);
        });

        // Preload images for the right wing
        this.rightImagePaths.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.rightImages.push(img);
        });
    }

    update() {
        // Scroll the left and right wings at their respective speeds
        this.scrollYLeft += this.leftSpeed;
        this.scrollYRight += this.rightSpeed;

        // Reset scroll positions for looping
        if (this.scrollYLeft >= this.canvas.height) {
            this.scrollYLeft = 0;
        }
        if (this.scrollYRight >= this.canvas.height) {
            this.scrollYRight = 0;
        }
    }

    draw() {
        const roadWidth = this.canvas.width * 0.3; // The road is 30% of the canvas width
        const roadX = (this.canvas.width - roadWidth) / 2; // Center the road
        const wingWidth = (this.canvas.width - roadWidth) / 2; // Width for each wing

        // Draw the left wing
        this.drawWing(this.leftImages, 0, wingWidth, this.scrollYLeft);

        // Draw the right wing
        const rightWingX = roadX + roadWidth; // Start from the right edge of the road
        this.drawWing(this.rightImages, rightWingX, wingWidth, this.scrollYRight);
    }

    drawWing(images, x, width, scrollY) {
        const imageHeight = this.canvas.height; // Each image should cover the full height of the canvas
        let y = scrollY - this.canvas.height; // Start just above the screen

        let currentImageIndex = 0; // Track the current image to draw
        while (y < this.canvas.height) {
            const img = images[currentImageIndex]; // Get the image sequentially
            if (img.complete && img.naturalWidth > 0) {
                this.ctx.drawImage(img, x, y, width, imageHeight); // Draw the image
            }

            y += imageHeight; // Move to the next vertical position
            currentImageIndex = (currentImageIndex + 1) % images.length; // Loop through images
        }
    }
}
