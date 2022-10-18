const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let gameSpeed = 30;
let stopped = false;

const snake = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 10,
    height: 10,
    dirX: 2,
    dirY: 0,
    lastDirX: 0,
    lastDirY: 0,
    stopped: false,
    move: function () {
        this.x += this.dirX;
        this.y += this.dirY;
    },
    turnUp: function () {
        if (this.dirY != 2) {
            this.dirX = 0;
            this.dirY = -2;
        }
    },
    turnDown: function () {
        if (this.dirY != -2) {
            this.dirX = 0;
            this.dirY = 2;
        }
    },
    turnRight: function () {
        if (this.dirX != -2) {
            this.dirX = 2;
            this.dirY = 0;
        }
    },
    turnLeft: function () {
        if (this.dirX != 2) {
            this.dirX = -2;
            this.dirY = 0;
        }
    },
    stop: function () {
        this.lastDirX = this.dirX;
        this.lastDirY = this.dirY;
        this.dirX = 0;
        this.dirY = 0;
        stopped = true;
    }
    // grow: function () {

    // },
    // tail: {
    //     width: globalThis.width,
    //     height: globalThis.height,

    // }
}

const food = {
    x: 50,
    y: 50,
    width: 10,
    height: 10,
    reset: function () {
        x = Math.floor(Math.random() * canvas.width - food.width);
        y = Math.floor(Math.random() * canvas.width - food.width);
    }
}

function drawSnake() {
    ctx.beginPath();
    ctx.rect(snake.x, snake.y, snake.width, snake.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawFood() {
    ctx.beginPath();
    ctx.rect(food.x, food.y, food.width, food.height);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function checkBounds() {
    // console.log(snake.x + " " + (snake.y))
    // console.log(snake.x > food.x)
    if (snake.x + snake.width > canvas.width || snake.x < 0) endGame();
    if (snake.y + snake.height > canvas.height || snake.y < 0) endGame();
    if ((snake.x - food.width > food.x && snake.x < food.x + food.width) && (snake.y - food.height > food.y && snake.y < food.y + food.height)) {
        snake.stop();
    }


}
//snake.x + snake.dirX < food.x + food.width
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    checkBounds();
    snake.move();
}

function endGame() {
    alert("GAME OVER");
    document.location.reload();
    clearInterval(interval);
}

const interval = setInterval(draw, gameSpeed);

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
    console.log(event.key)
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