const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const startingX = canvas.width / 2;
const startingY = canvas.height / 2
const gridSize = 10;

let gameSpeed = 500;
let stopped = false;
let score = 0;

const snake = {
    width: 10,
    length: 3,
    dirX: 10,
    dirY: 0,
    bodyParts: [
        {
            x: startingX,
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
        if (this.dirX != 0) {
            this.bodyParts.push({x: this.bodyParts[this.bodyParts.length - 1].x + (this.dirX * -1), y: this.bodyParts[this.bodyParts.length - 1].y});
        } else if (this.dirY != 0) {
            this.bodyParts.push({x: this.bodyParts[this.bodyParts.length - 1].x, y: this.bodyParts[this.bodyParts.length - 1].y + (this.dirY * -1)});
        }
    }
}

const food = {
    x: 200,
    y: 200,
    width: 10,
    eaten: false,
    reset: function () {
        this.x = generateGridPosition(food.width, canvas.width - food.width);
        this.y = generateGridPosition(food.width, canvas.height - food.width);
        this.eaten = false;
    }
}

function drawSnake() {
    ctx.beginPath();
    console.log(snake.bodyParts)
    for (let n = 0; n < snake.bodyParts.length; n++) {
        ctx.rect(snake.bodyParts[n].x, snake.bodyParts[n].y, snake.width, snake.width);
    }
    ctx.fillStyle = "black";
    ctx.fill();
    // ctx.closePath();
}

function drawFood() {
    if (food.eaten) {
        ctx.clearRect(food.x, food.y, food.width, food.width);
        food.reset();
    }
    ctx.beginPath();
    ctx.rect(food.x, food.y, food.width, food.width);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function checkBounds() {
    //Snake hits sides
    if (snake.bodyParts[0].x + snake.width > canvas.width || snake.bodyParts[0].x < 0) endGame();
    if (snake.bodyParts[0].y + snake.width > canvas.height || snake.bodyParts[0].y < 0) endGame();
    //Snake hits food
    if ((snake.bodyParts[0].x > food.x - food.width && snake.bodyParts[0].x < food.x + food.width) &&
        (snake.bodyParts[0].y > food.y - food.width && snake.bodyParts[0].y < food.y + food.width)) {
        snake.grow();
        food.eaten = true;
        updateScore();
    }
    //snake hits self
    //code
}

function playGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    checkBounds();
    snake.move();
}

function endGame() {
    alert("GAME OVER");
    document.location.reload();
    clearInterval(interval);
}

const interval = setInterval(playGame, gameSpeed);

function generateGridPosition(min, max) {
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
    }
}

function updateScore() {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
}