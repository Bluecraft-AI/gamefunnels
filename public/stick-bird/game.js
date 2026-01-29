// Game Configuration
const CONFIG = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    gravity: 0.5,
    jumpForce: -8,
    pipeSpeed: 3,
    pipeSpawnInterval: 2000, // milliseconds
    pipeGap: 150,
    pipeWidth: 60
};

// Game State
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let lastPipeTime = 0;

// Bird Class
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.velocity = 0;
        this.rotation = 0;
    }

    update() {
        if (gameState !== 'playing') return;

        // Apply gravity
        this.velocity += CONFIG.gravity;
        this.y += this.velocity;

        // Rotate based on velocity
        this.rotation = Math.min(Math.max(this.velocity * 3, -25), 90);

        // Keep bird on screen (top)
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = CONFIG.jumpForce;
    }

    draw() {
        CONFIG.ctx.save();
        CONFIG.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        CONFIG.ctx.rotate((this.rotation * Math.PI) / 180);
        
        // Draw bird (simple yellow circle/ellipse)
        CONFIG.ctx.fillStyle = '#FFD700';
        CONFIG.ctx.beginPath();
        CONFIG.ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        CONFIG.ctx.fill();
        
        // Draw eye
        CONFIG.ctx.fillStyle = '#000';
        CONFIG.ctx.beginPath();
        CONFIG.ctx.arc(8, -5, 4, 0, Math.PI * 2);
        CONFIG.ctx.fill();
        
        // Draw beak
        CONFIG.ctx.fillStyle = '#FF8C00';
        CONFIG.ctx.beginPath();
        CONFIG.ctx.moveTo(this.width / 2 - 5, 0);
        CONFIG.ctx.lineTo(this.width / 2 + 5, -3);
        CONFIG.ctx.lineTo(this.width / 2 + 5, 3);
        CONFIG.ctx.closePath();
        CONFIG.ctx.fill();
        
        CONFIG.ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Pipe Class
class Pipe {
    constructor(x, gapY) {
        this.x = x;
        this.gapY = gapY;
        this.width = CONFIG.pipeWidth;
        this.gap = CONFIG.pipeGap;
        this.scored = false;
    }

    update() {
        if (gameState !== 'playing') return;
        this.x -= CONFIG.pipeSpeed;
    }

    draw() {
        // Top pipe
        CONFIG.ctx.fillStyle = '#228B22';
        CONFIG.ctx.fillRect(this.x, 0, this.width, this.gapY - this.gap / 2);
        
        // Top pipe cap
        CONFIG.ctx.fillRect(this.x - 5, this.gapY - this.gap / 2 - 20, this.width + 10, 20);
        
        // Bottom pipe
        CONFIG.ctx.fillRect(this.x, this.gapY + this.gap / 2, this.width, CONFIG.height - (this.gapY + this.gap / 2));
        
        // Bottom pipe cap
        CONFIG.ctx.fillRect(this.x - 5, this.gapY + this.gap / 2, this.width + 10, 20);
    }

    getBounds() {
        return {
            top: {
                x: this.x,
                y: 0,
                width: this.width,
                height: this.gapY - this.gap / 2
            },
            bottom: {
                x: this.x,
                y: this.gapY + this.gap / 2,
                width: this.width,
                height: CONFIG.height - (this.gapY + this.gap / 2)
            },
            gap: {
                x: this.x + this.width,
                y: this.gapY - this.gap / 2,
                width: 5,
                height: this.gap
            }
        };
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// Game Objects
let bird;
let pipes = [];
let groundY = CONFIG.height - 50;

// Initialize Game
function init() {
    CONFIG.canvas = document.getElementById('gameCanvas');
    CONFIG.ctx = CONFIG.canvas.getContext('2d');
    CONFIG.canvas.width = CONFIG.width;
    CONFIG.canvas.height = CONFIG.height;

    // Create bird
    bird = new Bird(100, CONFIG.height / 2);

    // Make canvas focusable and focus it so keyboard events work
    CONFIG.canvas.setAttribute('tabindex', '0');
    CONFIG.canvas.focus();
    
    // Focus canvas when clicked
    CONFIG.canvas.addEventListener('click', function() {
        CONFIG.canvas.focus();
    });
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    CONFIG.canvas.addEventListener('click', handleClick);
    
    // Also focus window/document for immediate keyboard input
    window.focus();

    // Start game loop
    gameLoop();
}

// Input Handlers
function handleKeyDown(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start') {
            startGame();
        } else if (gameState === 'playing') {
            bird.jump();
        }
    } else if (e.code === 'KeyR' && gameState === 'gameover') {
        restartGame();
    }
}

function handleClick(e) {
    if (gameState === 'start') {
        startGame();
    } else if (gameState === 'playing') {
        bird.jump();
    }
}

// Game Functions
function startGame() {
    gameState = 'playing';
    document.getElementById('startScreen').style.display = 'none';
    score = 0;
    pipes = [];
    lastPipeTime = Date.now();
    bird.y = CONFIG.height / 2;
    bird.velocity = 0;
    updateScore();
}

function restartGame() {
    startGame();
    document.getElementById('gameOverScreen').classList.add('hidden');
}

function gameOver() {
    if (gameState === 'gameover') return;
    
    gameState = 'gameover';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

// Spawn Pipes
function spawnPipe() {
    const gapY = Math.random() * (CONFIG.height - CONFIG.pipeGap - 100) + 50;
    pipes.push(new Pipe(CONFIG.width, gapY));
}

// Collision Detection
function checkCollisions() {
    const birdBounds = bird.getBounds();

    // Check ground collision
    if (bird.y + bird.height > groundY) {
        gameOver();
        return;
    }

    // Check pipe collisions
    for (let pipe of pipes) {
        const bounds = pipe.getBounds();
        
        // Check top pipe
        if (birdBounds.x < bounds.top.x + bounds.top.width &&
            birdBounds.x + birdBounds.width > bounds.top.x &&
            birdBounds.y < bounds.top.y + bounds.top.height &&
            birdBounds.y + birdBounds.height > bounds.top.y) {
            gameOver();
            return;
        }

        // Check bottom pipe
        if (birdBounds.x < bounds.bottom.x + bounds.bottom.width &&
            birdBounds.x + birdBounds.width > bounds.bottom.x &&
            birdBounds.y < bounds.bottom.y + bounds.bottom.height &&
            birdBounds.y + birdBounds.height > bounds.bottom.y) {
            gameOver();
            return;
        }

        // Check score (passed through gap)
        if (!pipe.scored && birdBounds.x > bounds.gap.x) {
            pipe.scored = true;
            score++;
            updateScore();
        }
    }
}

// Draw Ground
function drawGround() {
    CONFIG.ctx.fillStyle = '#8B4513';
    CONFIG.ctx.fillRect(0, groundY, CONFIG.width, CONFIG.height - groundY);
    
    // Draw grass
    CONFIG.ctx.fillStyle = '#228B22';
    CONFIG.ctx.fillRect(0, groundY, CONFIG.width, 5);
}

// Game Loop
function gameLoop() {
    // Clear canvas
    CONFIG.ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);

    // Update and draw
    bird.update();
    bird.draw();

    // Spawn pipes
    if (gameState === 'playing') {
        const now = Date.now();
        if (now - lastPipeTime > CONFIG.pipeSpawnInterval) {
            spawnPipe();
            lastPipeTime = now;
        }

        // Update pipes
        pipes.forEach(pipe => pipe.update());
        pipes = pipes.filter(pipe => !pipe.isOffScreen());

        // Draw pipes
        pipes.forEach(pipe => pipe.draw());

        // Check collisions
        checkCollisions();
    } else {
        // Draw pipes even when paused
        pipes.forEach(pipe => pipe.draw());
    }

    // Draw ground
    drawGround();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);
