const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize bird properties
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    gravity: 0.8,
    lift: -15,
    speed: 0,
    image: new Image()
};
bird.image.src = 'game_objects/yellowbird-midflap.png';

// Initialize pipe properties
const pipes = [];
const pipeWidth = 52;
const pipeHeight = 200;
const pipeGap = 150;
const pipeDistance = 300;

// Load images
const bgImage = new Image();
bgImage.src = 'game_objects/background-day.png';

const baseImage = new Image();
baseImage.src = 'game_objects/base.png';

const topPipeImage = new Image();
topPipeImage.src = 'game_objects/pipe-green-up.png';

const bottomPipeImage = new Image();
bottomPipeImage.src = 'game_objects/pipe-green-down.png';

// Draw functions
function drawBird() {
    ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(x, y) {
    ctx.drawImage(topPipeImage, x, y, pipeWidth, pipeHeight); // Top pipe
    ctx.drawImage(bottomPipeImage, x, y + pipeHeight + pipeGap, pipeWidth, canvas.height); // Bottom pipe
}

function drawBase() {
    ctx.drawImage(baseImage, 0, canvas.height - baseImage.height);
}

// Collision detection function
function detectCollision(bird, pipe) {
    const birdBounds = {
        left: bird.x,
        right: bird.x + bird.width,
        top: bird.y,
        bottom: bird.y + bird.height
    };

    const topPipeBounds = {
        left: pipe.x,
        right: pipe.x + pipeWidth,
        top: pipe.y,
        bottom: pipe.y + pipeHeight
    };

    const bottomPipeBounds = {
        left: pipe.x,
        right: pipe.x + pipeWidth,
        top: pipe.y + pipeHeight + pipeGap,
        bottom: canvas.height
    };

    const hitTopPipe = birdBounds.right > topPipeBounds.left &&
                       birdBounds.left < topPipeBounds.right &&
                       birdBounds.bottom > topPipeBounds.top;

    const hitBottomPipe = birdBounds.right > bottomPipeBounds.left &&
                          birdBounds.left < bottomPipeBounds.right &&
                          birdBounds.top < bottomPipeBounds.bottom;

    return hitTopPipe || hitBottomPipe;
}

// Update game function
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    drawBird();
    bird.y += bird.speed;
    bird.speed += bird.gravity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeDistance) {
        pipes.push({ x: canvas.width, y: Math.floor(Math.random() * (canvas.height - pipeGap - pipeHeight)) });
    }

    pipes.forEach((pipe, index) => {
        drawPipe(pipe.x, pipe.y);
        pipe.x -= 2;

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }

        if (detectCollision(bird, pipe)) {
            console.log("Collision detected");
            // Restart the game if collision is detected
            location.reload();
        }
    });

    drawBase();

    requestAnimationFrame(updateGame);
}

// Start game on key press
document.addEventListener('keydown', () => {
    bird.speed = bird.lift;
});

updateGame();
