const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const STARTING_X = canvas.width / 2;
const STARTING_Y = canvas.height / 2;
const GRID_SIZE = 10;

let interval;

const game = {
	speed: 100,
	playing: false,
	score: 0,
	play() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		food.draw();
		snake.draw();
		snake.checkBounds();
		snake.move();
	},
	end() {
		clearInterval(interval);
		game.displayStatus();
		game.playing = false;
	},
	reset() {
		snake.reset();
		food.reset();
		game.score = 0;
		this.displayScore();
	},
	displayStatus() {
		const start = "Press the space key to begin.";
		const lost = "GAME OVER";
		ctx.font = "26px 'Gill Sans'";
		ctx.textAlign = "center";
		if (game.playing) {
			ctx.fillStyle = "red";
			ctx.fillText(lost, STARTING_X, STARTING_Y);
		} else {
			ctx.fillStyle = "green";
			ctx.fillText(start, STARTING_X, STARTING_Y);
		}
	},
	displayScore() {
		document.getElementById("score").textContent = `Score: ${game.score}`;
	},
};

const snake = {
	dirX: 10,
	dirY: 0,
	bodyParts: [
		{
			x: STARTING_X,
			y: STARTING_Y,
		},
		{
			x: STARTING_X - GRID_SIZE,
			y: STARTING_Y,
		},
		{
			x: STARTING_X - GRID_SIZE * 2,
			y: STARTING_Y,
		},
	],
	draw() {
		ctx.beginPath();
		for (let n = 0; n < snake.bodyParts.length; n++) {
			ctx.rect(
				snake.bodyParts[n].x,
				snake.bodyParts[n].y,
				GRID_SIZE,
				GRID_SIZE
			);
		}
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	},
	grow() {
		const tail = this.bodyParts[this.bodyParts.length - 1];
		if (this.dirX != 0) {
			this.bodyParts.push({ x: tail.x + this.dirX * -1, y: tail.y });
		} else if (this.dirY != 0) {
			this.bodyParts.push({ x: tail.x, y: tail.y + this.dirY * -1 });
		}
	},
	move() {
		for (let n = this.bodyParts.length - 1; n > 0; n--) {
			this.bodyParts[n].x = this.bodyParts[n - 1].x;
			this.bodyParts[n].y = this.bodyParts[n - 1].y;
		}
		this.bodyParts[0].x += this.dirX;
		this.bodyParts[0].y += this.dirY;
	},
	changeDirection(key) {
		if (key === "ArrowRight" && this.dirX != -10) {
			this.dirX = 10;
			this.dirY = 0;
		}
		if (key === "ArrowLeft" && this.dirX != 10) {
			this.dirX = -10;
			this.dirY = 0;
		}
		if (key === "ArrowUp" && this.dirY != 10) {
			this.dirX = 0;
			this.dirY = -10;
		}
		if (key === "ArrowDown" && this.dirY != -10) {
			this.dirX = 0;
			this.dirY = 10;
		}
	},
	checkBounds() {
		const headX = this.bodyParts[0].x;
		const headY = this.bodyParts[0].y;
		//Snake hits sides
		if (headX + GRID_SIZE > canvas.width || headX < 0) game.end();
		if (headY + GRID_SIZE > canvas.height || headY < 0) game.end();
		//snake hits self
		for (let n = 1; n < snake.bodyParts.length; n++) {
			if (
				headX > this.bodyParts[n].x - GRID_SIZE &&
				headX < this.bodyParts[n].x + GRID_SIZE &&
				headY > this.bodyParts[n].y - GRID_SIZE &&
				headY < this.bodyParts[n].y + GRID_SIZE
			) {
				game.end();
			}
		}
		//Snake hits food
		if (
			headX > food.x - GRID_SIZE &&
			headX < food.x + GRID_SIZE &&
			headY > food.y - GRID_SIZE &&
			headY < food.y + GRID_SIZE
		) {
			this.grow();
			food.reset();
			game.score += 10;
			game.displayScore();
		}
	},
	reset() {
		this.dirX = 10;
		this.dirY = 0;
		this.bodyParts = [
			{
				x: STARTING_X,
				y: STARTING_Y,
			},
			{
				x: STARTING_X - GRID_SIZE,
				y: STARTING_Y,
			},
			{
				x: STARTING_X - GRID_SIZE * 2,
				y: STARTING_Y,
			},
		];
	},
};

const food = {
	draw() {
		ctx.beginPath();
		ctx.rect(food.x, food.y, GRID_SIZE, GRID_SIZE);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	},
	reset() {
		this.x =
			Math.floor((Math.random() * canvas.width) / GRID_SIZE) * GRID_SIZE;
		this.y =
			Math.floor((Math.random() * canvas.height) / GRID_SIZE) * GRID_SIZE;
	},
};

document.addEventListener("keydown", function (event) {
	if (event.key === " ") {
		if (!game.playing) {
			game.reset();
			game.playing = true;
			interval = setInterval(game.play, game.speed);
		}
	} else {
		snake.changeDirection(event.key);
	}
});

game.displayStatus();
