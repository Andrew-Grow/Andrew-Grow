export default class Drawer {
	constructor(cfg, { field, bricks, racket, balls, grid, updateRate }) {
		this.cfg = cfg
		this.canvas = document.querySelector(cfg.canvasSelector)
		this.ctx = this.canvas.getContext('2d')

		this.scale = this.canvas.width / field.width
		this.lastRenderWidth = field.width

		this.ctx.font = (this.scale * cfg.fontSize) + 'px ' + cfg.fontFamily
		this.ctx.textAlign = "center"
		this.ctx.textBaseline = 'middle'

		this.bricks = bricks
		this.racket = racket
		this.balls = balls
		this.field = field
		this.grid = grid
		this.gameUpdateRate = updateRate

		this.msFromLastUpdate = 0
	}

	draw(msFromLastUpdate) {
		if (msFromLastUpdate) this.msFromLastUpdate = msFromLastUpdate
		if (this.field.width != this.lastRenderWidth) this.updateScale()

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		if (this.grid) this.drawGrid()
		if (this.bricks?.length) for (let i = 0; i < this.bricks.length; i++) {
			for (let j = 0; j < this.bricks.length; j++) {
				if (this.bricks[i] && this.bricks[i][j]) this.drawBrick(this.bricks[i][j])
			}
		}
		if (this.racket) this.drawRacket()
		if (this.balls?.length) for (let ball of this.balls) {
			this.drawBall(ball)
		}
	}

	drawBall(ball) {
		const [offsetX, offsetY] = this.getMotionsOffset(ball)

		this.ctx.fillStyle = this.cfg.ballColor
		this.ctx.beginPath()
		this.ctx.arc(
			(ball.x + offsetX) * this.scale,
			(ball.y + offsetY) * this.scale,
			ball.r * this.scale,
			0, 2 * Math.PI
		)
		this.ctx.fill()
	}

	drawBrick(brick) {
		this.ctx.fillStyle = brick.color
		this.ctx.beginPath()
		this.ctx.rect(
			brick.x * this.scale,
			brick.y * this.scale,
			brick.width * this.scale,
			brick.height * this.scale)
		this.ctx.fill()

		this.ctx.fillStyle = this.cfg.textColor
		this.ctx.fillText(brick.hp,
			(brick.pos.x + brick.width / 2) * this.scale,
			(brick.pos.y + brick.height / 2 + 1) * this.scale)
	}

	drawRacket() {
		const [offsetX, offsetY] = this.getMotionsOffset(this.racket)

		this.ctx.fillStyle = this.cfg.racketColor;
		this.ctx.beginPath();
		this.ctx.rect(
			(this.racket.x + offsetX) * this.scale,
			(this.racket.y + offsetY) * this.scale,
			this.racket.width * this.scale,
			this.racket.height * this.scale
		);
		this.ctx.fill()
	}

	drawGrid() {
		this.ctx.fillStyle = this.cfg.gridColor
		for (let i = 0; i < this.field.width / this.field.brickSize; i++) {
			for (let j = 0; j < this.field.height / this.field.brickSize; j++) {
				if (i % 2 == 0 && j % 2 == 0 || i % 2 != 0 && j % 2 != 0) this.ctx.fillRect(
					i * this.field.brickSize * this.scale,
					j * this.field.brickSize * this.scale,
					this.field.brickSize * this.scale,
					this.field.brickSize * this.scale
				)
			}
		}
	}

	getMotionsOffset(object) {
		const offsetX = object.motion.x * this.msFromLastUpdate / this.gameUpdateRate
		const offsetY = object.motion.y * this.msFromLastUpdate / this.gameUpdateRate
		return [offsetX, offsetY]
	}

	updateScale() {
		this.scale = this.canvas.width / this.field.width
		this.ctx.font = (this.scale * this.cfg.fontSize) + 'px ' + this.cfg.fontFamily
		this.lastRenderWidth = this.field.width
	}
}