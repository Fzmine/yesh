const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Bird properties
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    draw() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    },
    reset() {
        this.y = canvas.height / 2;
        this.velocity = 0;
    }
};

// Pipes
const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;
let score = 0;

function createPipe() {
    let height = Math.floor(Math.random() * (canvas.height / 2)) + 50;
    pipes.push({ x: canvas.width, y: height, passed: false });
}

function resetGame() {
    bird.reset();
    pipes.length = 0;
    score = 0;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 20, 40);
    
    bird.update();
    bird.draw();
    
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
        
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }
        
        // Collision check
        if (
            (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x && 
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) ||
            bird.y + bird.height >= canvas.height || bird.y <= 0
        ) {
            resetGame();
        }
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        bird.velocity = bird.jump;
    }
});

setInterval(createPipe, 2000);
gameLoop();
