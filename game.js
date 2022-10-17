const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let gameSpeed = 25;

const snake = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 10,
    height: 10,
    dirX: 2,
    dirY: 0,
    move: function() {
        this.x += this.dirX;
        this.y += this.dirY;
    },
    turnUp: function() {
        if (this.dirY != 2) {
            this.dirX = 0;
            this.dirY = -2;
        }
    },
    turnDown: function() {
        if (this.dirY != -2) {
            this.dirX = 0;
            this.dirY = 2;
        }
    },
    turnRight: function() {
        if (this.dirX != -2) {
            this.dirX = 2;
            this.dirY = 0;
        }
    },
    turnLeft: function() {
        if (this.dirX != 2) {
            this.dirX = -2;
            this.dirY = 0;
        }
    },
    grow: function() {
        this.width += 10;
    }
}

const food = {
    x: 50,
    y: 50,
    width: 10,
    height: 10,
    reset: function() {
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
    if (snake.x + snake.dirX > canvas.width - snake.width + 2) return false; //what is 2?
    if (snake.x + snake.dirX < snake.width) return false;
    if (snake.y + snake.dirY > canvas.height - snake.height + 2) return false;
    if (snake.y + snake.dirY < snake.height) return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();

    if (checkBounds() === false) {
        alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
    }
    snake.move();
}

const interval = setInterval(draw, 30);

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