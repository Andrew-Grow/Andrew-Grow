export default class Drawer {
	constructor(cfg, game) {
		this.cfg = cfg
		this.game = game

		this.canvas = document.querySelector(cfg.canvasSelector)
		this.ctx = this.canvas.getContext('2d')

		this.scale = this.canvas.width / game.field.width
		this.lastRenderWidth = this.game.field.width

		this.ctx.font = (this.scale * cfg.fontSize) + 'px ' + cfg.fontFamily
		this.ctx.textAlign = "center"
		this.ctx.textBaseline = 'middle'

		this.msFromLastUpdate = 0
	}

	draw(lastUpdateTime) {
		this.msFromLastUpdate = lastUpdateTime ? performance.now() - lastUpdateTime : 0
		if (this.game.field.width != this.lastRenderWidth) this.updateScale()

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		if (this.game.grid) this.drawGrid()
		if (this.game.bricks?.length) for (let i = 0; i < this.game.bricks.length; i++) {
			for (let j = 0; j < this.game.bricks.length; j++) {
				if (this.game.bricks[i] && this.game.bricks[i][j]) this.drawBrick(this.game.bricks[i][j])
			}
		}
		if (this.game.racket) this.drawRacket()
		if (this.game.balls?.length) for (let ball of this.game.balls) {
			this.drawBall(ball)
		}
		if (this.game.bonuses?.length) for (let bonus of this.game.bonuses) {
			this.drawBonus(bonus)
		}
		for (let key in this.game.effects) {
			this.drawEffect(key)
		}
	}

	// Game Objects

	drawBall(ball) {
		const [offsetX, offsetY] = this.getMotionsOffset(ball)

		if (ball.effects.fireball) this.ctx.fillStyle = this.cfg.fireballColor
		else if (ball.effects.speed) this.ctx.fillStyle = this.cfg.acceleratedBallColor
		else this.ctx.fillStyle = this.cfg.ballColor

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

		this.ctx.font = (this.scale * this.cfg.fontSize) + 'px ' + this.cfg.fontFamily
		this.ctx.fillStyle = this.cfg.textColor
		this.ctx.fillText(brick.hp,
			(brick.pos.x + brick.width / 2) * this.scale,
			(brick.pos.y + brick.height / 2 + 1) * this.scale)
	}

	drawRacket() {
		const [offsetX, offsetY] = this.getMotionsOffset(this.game.racket)

		this.ctx.fillStyle = this.cfg.racketColor;
		this.ctx.beginPath();
		this.ctx.rect(
			(this.game.racket.x + offsetX) * this.scale,
			(this.game.racket.y + offsetY) * this.scale,
			this.game.racket.width * this.scale,
			this.game.racket.height * this.scale
		);
		this.ctx.fill()
	}

	drawBonus(bonus) {
		let emoji = '❓'
		if (bonus.type == 'hp') emoji = '❤️'
		else if (bonus.type == 'ball') emoji = '🥎'
		else if (bonus.type == 'shield') emoji = '🛡️'
		else if (bonus.type == 'speed') emoji = '⚡'
		else if (bonus.type == 'fireball') emoji = '☄️'
		this.ctx.font = (this.scale * this.cfg.fontSize * 1.5) + 'px ' + this.cfg.fontFamily
		this.ctx.fillText(emoji,
			bonus.x * this.scale,
			bonus.y * this.scale
		)
	}

	//Effects

	drawEffect(effect) {
		if (effect == 'shield') this.drawShield()
	}

	drawShield() {
		const x1 = (this.game.field.left) * this.scale,
			y1 = (this.game.field.bottom - 16) * this.scale,
			x2 = this.game.field.right * this.scale,
			y2 = this.game.field.bottom * this.scale

		const grd = this.ctx.createLinearGradient(x1, y1, x1, y2)
		grd.addColorStop(0, '#88f0')
		grd.addColorStop(1, '#88f8')
		this.ctx.fillStyle = grd

		this.ctx.beginPath();
		this.ctx.rect(x1, y1, x2, y2);
		this.ctx.fill()
	}

	// Editor

	drawGrid() {
		this.ctx.fillStyle = this.cfg.gridColor
		for (let i = 0; i < this.game.field.width / this.game.field.brickSize; i++) {
			for (let j = 0; j < this.game.field.height / this.game.field.brickSize; j++) {
				if (i % 2 == 0 && j % 2 == 0 || i % 2 != 0 && j % 2 != 0) this.ctx.fillRect(
					i * this.game.field.brickSize * this.scale,
					j * this.game.field.brickSize * this.scale,
					this.game.field.brickSize * this.scale,
					this.game.field.brickSize * this.scale
				)
			}
		}
	}

	// Helpers

	getMotionsOffset(object) {
		const offsetX = object.motion.x * this.msFromLastUpdate / this.game.updateRate
		const offsetY = object.motion.y * this.msFromLastUpdate / this.game.updateRate
		return [offsetX, offsetY]
	}

	updateScale() {
		this.scale = this.canvas.width / this.game.field.width
		this.ctx.font = (this.scale * this.cfg.fontSize) + 'px ' + this.cfg.fontFamily
		this.lastRenderWidth = this.game.field.width
	}
}