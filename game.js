const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const gridSize = 20;
const canvasSize = 400;
const initialSnakeLength = 1;
const snakeSpeed = 200;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let blueFood = null;
let redWall = null;
let score = 0;
let gameInterval;
let blueFoodTimeout;
let redWallTimeout;
let isGameRunning = false;

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    // Draw the body first
    ctx.fillStyle = 'cornflowerblue';
    for (let i = snake.length - 1; i > 0; i--) {
        drawRect(snake[i].x, snake[i].y, 'cornflowerblue');
    }
    // Draw the head last
    ctx.fillStyle = 'teal';
    drawRect(snake[0].x, snake[0].y, 'teal');
}

function drawFood() {
    drawRect(food.x, food.y, 'green');
    if (blueFood) {
        drawRect(blueFood.x, blueFood.y, 'blue');
    }
}

function drawWalls() {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvasSize, canvasSize);
    if (redWall) {
        ctx.fillStyle = 'red';
        if (redWall === 'top') {
            ctx.fillRect(0, 0, canvasSize, gridSize);
        } else if (redWall === 'bottom') {
            ctx.fillRect(0, canvasSize - gridSize, canvasSize, gridSize);
        } else if (redWall === 'left') {
            ctx.fillRect(0, 0, gridSize, canvasSize);
        } else if (redWall === 'right') {
            ctx.fillRect(canvasSize - gridSize, 0, gridSize, canvasSize);
        }
    }
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else if (blueFood && head.x === blueFood.x && head.y === blueFood.y) {
        score = Math.max(0, score - 1);
        scoreDisplay.textContent = `Score: ${score}`;
        if (snake.length > 1) {
            snake.pop();
        }
        clearTimeout(blueFoodTimeout);
        blueFood = null;
        scheduleBlueFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        // Bounce the snake back into the canvas
        if (head.x < 0) head.x = 0;
        if (head.x >= 20) head.x = 19;
        if (head.y < 0) head.y = 0;
        if (head.y >= 20) head.y = 19;
        direction.x = -direction.x;
        direction.y = -direction.y;
    }

    if (redWall) {
        if ((redWall === 'top' && head.y === 0) ||
            (redWall === 'bottom' && head.y === 19) ||
            (redWall === 'left' && head.x === 0) ||
            (redWall === 'right' && head.x === 19)) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameInterval);
    clearTimeout(blueFoodTimeout);
    clearTimeout(redWallTimeout);
    isGameRunning = false;
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over!', canvasSize / 2 - 100, canvasSize / 2);
}

function scheduleBlueFood() {
    const delay = Math.floor(Math.random() * (18 - 13 + 1) + 13) * 1000;
    blueFoodTimeout = setTimeout(() => {
        blueFood = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        setTimeout(() => {
            blueFood = null;
            scheduleBlueFood();
        }, 10000);
    }, delay);
}

function scheduleRedWall() {
    const delay = Math.floor(Math.random() * (13 - 1 + 1) + 1) * 1000;
    redWallTimeout = setTimeout(() => {
        const walls = ['top', 'bottom', 'left', 'right'];
        redWall = walls[Math.floor(Math.random() * walls.length)];
        setTimeout(() => {
            redWall = null;
            scheduleRedWall();
        }, 10000);
    }, delay);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
    drawWalls();
    moveSnake();
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x === 0) { // Left arrow
        direction = { x: -1, y: 0 };
    } else if (key === 38 && direction.y === 0) { // Up arrow
        direction = { x: 0, y: -1 };
    } else if (key === 39 && direction.x === 0) { // Right arrow
        direction = { x: 1, y: 0 };
    } else if (key === 40 && direction.y === 0) { // Down arrow
        direction = { x: 0, y: 1 };
    }
}

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        gameInterval = setInterval(gameLoop, snakeSpeed);
        scheduleBlueFood();
        scheduleRedWall();
    }
}

function restartGame() {
    gameOver();
    startGame();
}

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
