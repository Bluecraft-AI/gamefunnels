// Script to generate Stick Bird screenshot
// Run with: node scripts/generate-stick-bird-screenshot.js

const fs = require('fs');
const path = require('path');

// Check if canvas is available
let canvas;
try {
  canvas = require('canvas');
} catch (e) {
  console.log('Canvas package not found. Installing...');
  console.log('Please run: npm install canvas');
  process.exit(1);
}

const { createCanvas } = canvas;

// Create canvas
const width = 800;
const height = 600;
const canvasEl = createCanvas(width, height);
const ctx = canvasEl.getContext('2d');

// Draw background gradient
const gradient = ctx.createLinearGradient(0, 0, 0, height);
gradient.addColorStop(0, '#87CEEB');
gradient.addColorStop(0.5, '#E0F6FF');
gradient.addColorStop(1, '#87CEEB');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Draw ground
const groundY = 550;
ctx.fillStyle = '#8B4513';
ctx.fillRect(0, groundY, width, 50);

// Draw ground line
ctx.strokeStyle = '#654321';
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(0, groundY);
ctx.lineTo(width, groundY);
ctx.stroke();

// Draw pipes
const pipeWidth = 60;
const pipeGap = 150;

// Pipe 1
const pipe1X = 300;
const pipe1GapY = 250;
ctx.fillStyle = '#228B22';
// Top pipe
ctx.fillRect(pipe1X, 0, pipeWidth, pipe1GapY - pipeGap / 2);
// Top pipe cap
ctx.fillRect(pipe1X - 5, pipe1GapY - pipeGap / 2 - 20, pipeWidth + 10, 20);
// Bottom pipe
ctx.fillRect(pipe1X, pipe1GapY + pipeGap / 2, pipeWidth, height - (pipe1GapY + pipeGap / 2));
// Bottom pipe cap
ctx.fillRect(pipe1X - 5, pipe1GapY + pipeGap / 2, pipeWidth + 10, 20);

// Pipe 2
const pipe2X = 550;
const pipe2GapY = 300;
// Top pipe
ctx.fillRect(pipe2X, 0, pipeWidth, pipe2GapY - pipeGap / 2);
// Top pipe cap
ctx.fillRect(pipe2X - 5, pipe2GapY - pipeGap / 2 - 20, pipeWidth + 10, 20);
// Bottom pipe
ctx.fillRect(pipe2X, pipe2GapY + pipeGap / 2, pipeWidth, height - (pipe2GapY + pipeGap / 2));
// Bottom pipe cap
ctx.fillRect(pipe2X - 5, pipe2GapY + pipeGap / 2, pipeWidth + 10, 20);

// Draw bird
const birdX = 150;
const birdY = 280;
const birdWidth = 40;
const birdHeight = 30;

ctx.save();
ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);
ctx.rotate(-15 * Math.PI / 180); // Slight upward angle

// Draw bird body (yellow circle)
ctx.fillStyle = '#FFD700';
ctx.beginPath();
ctx.ellipse(0, 0, birdWidth / 2, birdHeight / 2, 0, 0, Math.PI * 2);
ctx.fill();

// Draw eye
ctx.fillStyle = '#000';
ctx.beginPath();
ctx.arc(8, -5, 4, 0, Math.PI * 2);
ctx.fill();

// Draw beak
ctx.fillStyle = '#FF8C00';
ctx.beginPath();
ctx.moveTo(birdWidth / 2 - 5, 0);
ctx.lineTo(birdWidth / 2 + 5, -3);
ctx.lineTo(birdWidth / 2 + 5, 3);
ctx.closePath();
ctx.fill();

ctx.restore();

// Draw score
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.fillText('5', width / 2, 80);

// Save image to public/images (Next.js static files location)
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const outputPath = path.join(imagesDir, 'Stick Bird Game.png');
const buffer = canvasEl.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('✅ Screenshot generated successfully!');
console.log(`Saved to: ${outputPath}`);
