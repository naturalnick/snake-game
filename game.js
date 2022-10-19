const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const startingX = canvas.width / 2;
const startingY = canvas.height / 2
const gridSize = 10;

let gameSpeed = 100;
let playing = false;
let score = 0;

let interval;

let snake = newSnake();
let food = newFood();

displayGameStatus();

function newSnake() {
    return {
        width: 10,
        dirX: 10,
        dirY: 0,
        bodyParts: [
            {
                x: startingX,
                y: startingY,
            },
            {
                x: startingX - this.width,
                y: startingY,
            },
            {
                x: startingX - (this.width * 2),
                y: startingY,
            }
        ],
        move: function () {
            for (let n = this.bodyParts.length - 1; n > 0; n--) {
                this.bodyParts[n].x = this.bodyParts[n - 1].x
                this.bodyParts[n].y = this.bodyParts[n - 1].y
            }
            this.bodyParts[0].x += this.dirX;
            this.bodyParts[0].y += this.dirY;
        },
        turnUp: function () {
            if (this.dirY != 10) {
                this.dirX = 0;
                this.dirY = -10;
            }
        },
        turnDown: function () {
            if (this.dirY != -10) {
                this.dirX = 0;
                this.dirY = 10;
            }
        },
        turnRight: function () {
            if (this.dirX != -10) {
                this.dirX = 10;
                this.dirY = 0;
            }
        },
        turnLeft: function () {
            if (this.dirX != 10) {
                this.dirX = -10;
                this.dirY = 0;
            }
        },
        grow: function () {
            const tail = this.bodyParts[this.bodyParts.length - 1];
            if (this.dirX != 0) {
                this.bodyParts.push({ x: tail.x + (this.dirX * -1), y: tail.y });
            } else if (this.dirY != 0) {
                this.bodyParts.push({ x: tail.x, y: tail.y + (this.dirY * -1) });
            }
        }
    }
}

function newFood(x, y) {
    return {
        width: 10,
        x: x,
        y: y,
        eaten: false,
    }
}

function drawSnake() {
    ctx.beginPath();
    for (let n = 0; n < snake.bodyParts.length; n++) {
        ctx.rect(snake.bodyParts[n].x, snake.bodyParts[n].y, snake.width, snake.width);
    }
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawFood() {
    if (food.eaten) {
        ctx.clearRect(food.x, food.y, food.width, food.width);
        generateNewFood();
    }
    ctx.beginPath();
    ctx.rect(food.x, food.y, food.width, food.width);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function generateNewFood() {
    const foodX = getRoundedRand(food.width, canvas.width - food.width);
    const foodY = getRoundedRand(food.width, canvas.height - food.width);
    food = newFood(foodX, foodY);
}

function checkBounds() {
    const headX = snake.bodyParts[0].x;
    const headY = snake.bodyParts[0].y;
    //Snake hits sides
    if (headX + snake.width > canvas.width || headX < 0) endGame();
    if (headY + snake.width > canvas.height || headY < 0) endGame();
    //Snake hits food
    if ((headX > food.x - food.width && headX < food.x + food.width) &&
        (headY > food.y - food.width && headY < food.y + food.width)) {
        snake.grow();
        food.eaten = true;
        score++;
        displayScore();
    }
    //snake hits self
    for (let n = 1; n < snake.bodyParts.length; n++) {
        if ((headX > snake.bodyParts[n].x - snake.width && headX < snake.bodyParts[n].x + snake.width) &&
            headY > snake.bodyParts[n].y - snake.width && headY < snake.bodyParts[n].y + snake.width) {
            endGame();
        }
    }
}

function playGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    checkBounds();
    snake.move();
}

function endGame() {
    clearInterval(interval);
    displayGameStatus();
    playing = false;
}

function resetGame() {
    snake = newSnake();
    generateNewFood();
    score = 0;
    displayScore();
}

function getRoundedRand(min, max) {
    const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    const roundedNum = Math.round(randomNum / gridSize) * gridSize;
    return roundedNum;
}

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        snake.turnRight();
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        snake.turnLeft();
    } else if (event.key === "Up" || event.key === "ArrowUp") {
        snake.turnUp();
    } else if (event.key === "Down" || event.key === "ArrowDown") {
        snake.turnDown();
    } else if (event.key === " " || event.key === "Space") {
        if (!playing) {
            resetGame();
            interval = setInterval(playGame, gameSpeed);
            playing = true;
        }
    }
}

function displayGameStatus() {
    const start = "Press the space key to begin.";
    const lost = "GAME OVER";
    ctx.font = "26px 'Gill Sans'";
    ctx.textAlign = "center";
    if (playing) {
        ctx.fillStyle = "red";
        ctx.fillText(lost, startingX, startingY);
    } else {
        ctx.fillStyle = "green";
        ctx.fillText(start, startingX, startingY);
    }
}

function displayScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}