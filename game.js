const canvas = document.getElementById("game-canvas");
canvas.width = 500;
canvas.height = 400;
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;

let animationInterval = undefined;

const game = {
	speed: 200,
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
		clearInterval(animationInterval);
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
			ctx.fillText(lost, canvas.width / 2, canvas.height / 2);
		} else {
			ctx.fillStyle = "green";
			ctx.fillText(start, canvas.width / 2, canvas.height / 2);
		}
	},
	displayScore() {
		document.getElementById("score").textContent = `Score: ${game.score}`;
	},
};

const snake = {
	STARTING_X: canvas.width / 2 - GRID_SIZE / 2, //
	STARTING_Y: canvas.height / 2,
	dirX: GRID_SIZE,
	dirY: 0,
	isTurning: false,
	bodyParts: [
		{
			x: this.STARTING_X,
			y: this.STARTING_Y,
		},
		{
			x: this.STARTING_X - GRID_SIZE,
			y: this.STARTING_Y,
		},
		{
			x: this.STARTING_X - GRID_SIZE * 2,
			y: this.STARTING_Y,
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
		ctx.fillStyle = "green";
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
		this.isTurning = false;
	},
	changeDirection(key) {
		if (key === "ArrowRight" && this.dirX != -GRID_SIZE) {
			this.dirX = GRID_SIZE;
			this.dirY = 0;
		}
		if (key === "ArrowLeft" && this.dirX != GRID_SIZE) {
			this.dirX = -GRID_SIZE;
			this.dirY = 0;
		}
		if (key === "ArrowUp" && this.dirY != GRID_SIZE) {
			this.dirX = 0;
			this.dirY = -GRID_SIZE;
		}
		if (key === "ArrowDown" && this.dirY != -GRID_SIZE) {
			this.dirX = 0;
			this.dirY = GRID_SIZE;
		}
		this.isTurning = true;
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
		this.dirX = GRID_SIZE;
		this.dirY = 0;
		this.bodyParts = [
			{
				x: this.STARTING_X,
				y: this.STARTING_Y,
			},
			{
				x: this.STARTING_X - GRID_SIZE,
				y: this.STARTING_Y,
			},
			{
				x: this.STARTING_X - GRID_SIZE * 2,
				y: this.STARTING_Y,
			},
		];
	},
};

const food = {
	draw() {
		ctx.beginPath();
		ctx.rect(food.x, food.y, GRID_SIZE, GRID_SIZE);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	},
	reset() {
		this.x =
			Math.floor((Math.random() * canvas.width) / GRID_SIZE) * GRID_SIZE;
		this.y =
			Math.floor((Math.random() * canvas.height) / GRID_SIZE) * GRID_SIZE;
	},
	//prevent food drop on snake tail
	checkBounds() {
		for (let n = 0; n < snake.bodyParts.length; n++) {
			if (
				this.x > this.bodyParts[n].x - GRID_SIZE &&
				this.x < this.bodyParts[n].x + GRID_SIZE &&
				this.y > this.bodyParts[n].y - GRID_SIZE &&
				this.y < this.bodyParts[n].y + GRID_SIZE
			) {
				this.reset();
				console.log("had to move food.");
			}
		}
	},
};

document.addEventListener("keydown", function (event) {
	if (event.key === " ") {
		if (!game.playing) {
			game.reset();
			game.playing = true;
			animationInterval = setInterval(game.play, game.speed);
		}
	} else {
		!snake.isTurning && snake.changeDirection(event.key);
	}
});

game.displayStatus();
