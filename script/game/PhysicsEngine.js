import Field from "./Field.js"
import Racket from "./Racket.js"
import Brick from "./Brick.js"
import { Point, Vector } from "../utils/geometry.js"



export default class PhysicsEngine {
	constructor(cfg, game) {
		this.cfg = cfg
		this.game = game
	}

	step() {
		// Update Objects
		this.game.racket.move(...this.game.racket.motion.values)
		for (let ball of this.game.balls) {
			ball.move(...ball.motion.values)
		}
		for (let bonus of this.game.bonuses) {
			if (bonus.motion.y < bonus.maxSpeed) bonus.motion.y += this.cfg.gravity
			bonus.move(...bonus.motion.values)
		}

		// Handle Collisions
		const collisions = [] //[[obj1, obj2, collisionPoint]]

		// racket
		if (this.game.racket.left < this.game.field.left)
			this.game.racket.x = 0
		else if (this.game.racket.right >= this.game.field.right)
			this.game.racket.x = this.game.field.right - this.game.racket.width

		// ball
		for (let ball of this.game.balls) {
			// edges
			if (ball.left <= this.game.field.left) ball.motion.x = Math.abs(ball.motion.x)
			if (ball.right >= this.game.field.right) ball.motion.x = -Math.abs(ball.motion.x)
			if (ball.top <= this.game.field.top) ball.motion.y = Math.abs(ball.motion.y)
			if (ball.bottom >= this.game.field.bottom && this.game.field.collisions)
				ball.motion.reflect(new Vector(0, -1))
			if (ball.top >= this.game.field.bottom)
				collisions.push({
					ball,
					field: this.game.field,
					point: new Point(ball.x, this.game.field.bottom)
				})

			// racket
			if (ball.bottom >= this.game.racket.top && ball.motion.y >= 0) {
				let collisionPoint = detectCollision(ball, this.game.racket)
				if (collisionPoint && collisionPoint.y == this.game.racket.top) {
					const racketCenter = this.game.racket.width / 2
					const ballToCenter = ball.x - this.game.racket.x - racketCenter
					const dX = ballToCenter * Math.abs(ballToCenter) / Math.pow(racketCenter, 2) * this.cfg.racketReboundFactor
					ball.setDirection(dX, -1)
				}
			}

			//bricks
			const ballInBlockX = Math.floor(ball.pos.x / this.game.field.brickSize)
			const ballInBlockY = Math.floor(ball.pos.y / this.game.field.brickSize)
			let closestCollision = false
			for (let i = ballInBlockX - 2; i <= ballInBlockX + 2; i++) {
				for (let j = ballInBlockY - 2; j <= ballInBlockY + 2; j++) {
					if (this.game.bricks[i] && this.game.bricks[i][j] && this.game.bricks[i][j] instanceof Brick) {
						let collisionPoint = detectCollision(ball, this.game.bricks[i][j])
						if (collisionPoint) {
							if (!ball.colliding[i + 'x' + j]) {
								ball.colliding[i + 'x' + j] = true
								const reflectionVector = new Vector(...Point.subtract(ball.pos, collisionPoint).values)
								if (!closestCollision || reflectionVector.length < closestCollision.length) closestCollision = reflectionVector
								collisions.push({ ball, brick: this.game.bricks[i][j], point: collisionPoint })
							}
						}
						else delete ball.colliding[i + 'x' + j]
					}
				}
			}
			if (closestCollision) ball.motion.reflect(closestCollision)
		}
		for (let bonus of this.game.bonuses) {
			// edges
			if (bonus.top >= this.game.field.bottom)
				collisions.push({ bonus, field: this.game.field, point: new Point(bonus.x, this.game.field.bottom) })

			// racket
			if (bonus.bottom >= this.game.racket.top && bonus.motion.y >= 0) {
				let collisionPoint = detectCollision(bonus, this.game.racket)
				if (collisionPoint) collisions.push({ bonus, racket: this.game.racket, point: collisionPoint })
			}
		}

		return collisions
	}
}



function detectCollision(circle, rect) {
	// Find Closes point between circle and rectangle
	const closestPoint = new Point(circle.pos.x, circle.pos.y)
	if (circle.pos.x < rect.pos.x) closestPoint.x = rect.pos.x;
	else if (circle.pos.x > rect.pos.x + rect.size.x) closestPoint.x = rect.pos.x + rect.size.x;
	if (circle.pos.y < rect.pos.y) closestPoint.y = rect.pos.y;
	else if (circle.pos.y > rect.pos.y + rect.size.y) closestPoint.y = rect.pos.y + rect.size.y;

	//Compare distance from closest point to circle radius
	if (Point.getDistance(circle.pos, closestPoint) <= circle.r) return closestPoint
	else return false
}

function getReflectionVector(object, collisionPoint) {
	const reflectionVector = new Vector(...Point.subtract(object.pos, collisionPoint).values)
	// const reflectionAngle = Vector.angle(object.motion, reflectionVector)
	// if (reflectionAngle > 0) reflectionVector.flip()
	// console.log(reflectionAngle)
	return reflectionVector
}