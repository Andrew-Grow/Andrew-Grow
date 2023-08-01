import { countBricks, mapToBricks } from "../utils/map.js"
import Drawer from "./Drawer.js"
import PhysicsEngine from "./PhysicsEngine.js"
import Player from './Player.js'
import Field from "./Field.js"
import Racket from "./Racket.js"
import Ball from "./Ball.js"
import Brick from "./Brick.js"
import { displayHP, displayTime, displayCompleteness } from "../utils/ui.js"
import Bonus from "./Bonus.js"
import Effect from "./Effect.js"

export default class Game {
	constructor(cfg, map) {
		this.cfg = cfg
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
		this.addBall()

		// bonuses
		this.bonuses = []
		this.effects = []

		// hp
		this.hp = cfg.game.startingHP

		// time
		this.currentTime = performance.now()
		this.endTime = this.currentTime + cfg.game.roundTime

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
				this.removeBall(collision.ball)
				if (!this.balls.length) {
					this.hp--
					this.addBall()
				}
			}

			if (collision.ball && collision.brick) {
				collision.brick.damage()
				if (collision.brick.hp <= 0) {
					this.removeBrick(collision.brick)
					if (Math.random() * 100 < 100) this.addBonus({
						x: collision.brick.x + collision.brick.width / 2,
						y: collision.brick.y + collision.brick.height / 2
					})
				}
			}

			if (collision.bonus && collision.racket) {
				this.removeBonus(collision.bonus)
				if (collision.bonus.type == 'hp' && this.hp < 3) this.hp++
				else if (collision.bonus.type == 'ball') this.addBall()
				else if (collision.bonus.type == 'shield') this.addEffect()
			}

			if (collision.bonus && collision.field) {
				this.removeBonus(collision.bonus)
			}
		}

		// Following Game Logic
		for (let effect of this.effects) {
			if (effect.start + effect.duration <= this.currentTime) this.removeEffect(effect)
		}

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
		const newBall = new Ball({
			x: this.racket.left + (this.racket.width / 2),
			y: this.racket.top,
			dX: Math.random() - 0.5,
			dY: -1,
			...this.cfg.ball,
			...props
		})
		this.balls.push(newBall)
		return newBall
	}

	removeBall(ball) {
		this.balls = this.balls.filter(el => el !== ball)
	}

	removeBrick(brick) {
		const x = Math.floor(brick.x / brick.width)
		const y = Math.floor(brick.y / brick.width)
		if (this.bricks[x][y]) {
			this.bricksLeft--
			this.bricks[x][y] = false
		}
		console.log('bricks Left: ', this.bricksLeft)
	}

	addBonus(props) {
		const types = ['hp', 'ball', 'shield']
		this.bonuses.push(new Bonus({
			...this.cfg.bonus,
			...props,
			dY: -1,
			type: types[Math.floor(Math.random() * types.length)]
		}))
	}

	removeBonus(bonus) {
		this.bonuses = this.bonuses.filter(el => el !== bonus)
	}

	addEffect() {
		if (this.effects.length) this.effects[0].start = this.currentTime
		else {
			this.effects.push(new Effect({
				duration: this.cfg.game.effectDuration,
				start: this.currentTime
			}))
			this.field.collisions = true
		}
	}

	removeEffect(effect) {
		this.effects = this.effects.filter(el => el !== effect)
		this.field.collisions = false
	}
}