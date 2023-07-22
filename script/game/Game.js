import { countBricks, mapToBricks } from "../utils/map.js"
import Drawer from "./Drawer.js"
import PhysicsEngine from "./PhysicsEngine.js"
import Player from './Player.js'
import Field from "./Field.js"
import Racket from "./Racket.js"
import Ball from "./Ball.js"
import Brick from "./Brick.js"
import { displayHP, displayTime, displayCompleteness } from "../utils/ui.js"

export default class Game {
	constructor(cfg, map) {
		this.player = new Player()

		// map
		this.bricks = mapToBricks(map, cfg.brick.size)
		this.totalBricks = countBricks(this.bricks)
		this.bricksLeft = this.totalBricks

		this.field = new Field(map.length, cfg.brick.size, true)

		//racket
		this.racket = new Racket({
			x: (this.field.width - cfg.racket.width) / 2,
			y: this.field.height - cfg.racket.bottom,
			width: cfg.racket.width,
			height: cfg.racket.height,
			speed: cfg.racket.speed
		})

		// balls
		this.balls = []
		const newBall = this.addBall({ speed: cfg.ball.speed, r: cfg.ball.radius })
		this.respawnBall(newBall)

		// hp
		this.hp = cfg.game.startingHP

		// time
		this.endTime = performance.now() + cfg.game.roundTime
		this.currentTime = 0

		// engine
		this.updateRate = cfg.game.updateRate
		this.physicsEngine = new PhysicsEngine(cfg.physicsEngine, this)
		this.drawer = new Drawer(cfg.drawer, this)
		this.continues = true

		// elements
		this.hpElement = document.querySelector(cfg.game.hpSelector)
		this.timerElement = document.querySelector(cfg.game.timerSelector)
		this.completenessElement = document.querySelector(cfg.game.completenessSelector)

		this.render()
	}

	gameloop() {
		// Handle User Input
		if (this.player.moving) this.racket.motion.x = this.player.moving * this.racket.speed
		else this.racket.motion.x = 0

		// Update Game Objects
		const collisions = this.physicsEngine.step()
		this.currentTime = performance.now()

		// Process Collisions
		for (let collision of collisions) {
			if (collision.ball && collision.field) {
				this.respawnBall(collision.ball)
				this.hp--
			}
			if (collision.ball && collision.brick) {
				collision.brick.damage()
				if (collision.brick.hp <= 0) {
					this.removeBrick(collision.brick)
					this.bricksLeft--
				}
			}
		}

		// Following Game Logic
		const timeLeft = this.endTime - this.currentTime
		const completeness = (this.totalBricks - this.bricksLeft) / this.totalBricks

		displayHP(this.hpElement, this.hp)
		displayTime(this.timerElement, timeLeft)
		displayCompleteness(this.completenessElement, completeness)

		if (this.bricksLeft <= 0) this.end(true)
		else if (this.hp <= 0 || timeLeft <= 0) this.end(false)
	}

	render(timeStamp) {
		const msFromLastUpdate = timeStamp - this.currentTime
		this.drawer.draw(msFromLastUpdate)
		if (this.continues) window.requestAnimationFrame(this.render.bind(this))
	}

	// Game Process

	start() {
		this.continues = true
		this.gameloopInterval = setInterval(this.gameloop.bind(this), this.updateRate)
	}

	stop() {
		this.continues = false
		clearInterval(this.gameloopInterval)
	}

	end(win) {
		this.stop()
		if (win) alert('Congratultaions! You won!')
		else alert('Game over')
	}

	// Game Events

	addBall(props) {
		const newBall = new Ball(props)
		this.balls.push(newBall)
		return newBall
	}

	respawnBall(ball) {
		ball.setPosition(
			this.racket.left + (this.racket.width / 2) + (Math.random() * 20 - 10),
			this.racket.top - 20
		)
		ball.setDirection(0, 1)
	}

	removeBrick(brick) {
		const x = Math.floor(brick.x / brick.width)
		const y = Math.floor(brick.y / brick.width)
		this.bricks[x][y] = false
	}
}