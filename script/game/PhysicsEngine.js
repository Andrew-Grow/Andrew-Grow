import Field from "./Field.js"
import Racket from "./Racket.js"
import Brick from "./Brick.js"
import { Point, Vector } from "../utils/geometry.js"



export default class PhysicsEngine {
	constructor(cfg, { field, racket, balls = [], bricks = [] }) {
		this.cfg = cfg

		this.field = field
		this.racket = racket
		this.balls = balls
		this.bricks = bricks
	}

	step() {
		// Update Objects
		this.racket.move(...this.racket.motion.values)
		for (let ball of this.balls) {
			ball.move(...ball.motion.values)
		}

		// Handle Collisions
		const collisions = [] //[[obj1, obj2, collisionPoint]]

		// racket
		if (this.racket.left < this.field.left)
			this.racket.x = 0
		else if (this.racket.right >= this.field.right)
			this.racket.x = this.field.right - this.racket.width

		// ball
		for (let ball of this.balls) {
			// walls
			if (ball.left <= this.field.left) ball.motion.x = Math.abs(ball.motion.x)
			if (ball.right >= this.field.right) ball.motion.x = -Math.abs(ball.motion.x)
			if (ball.top <= this.field.top) ball.motion.y = Math.abs(ball.motion.y)
			if (ball.top >= this.field.bottom)
				collisions.push({ ball, field: this.field, point: new Point(ball.x, this.field.bottom) })

			// racket
			if (ball.bottom >= this.racket.top && ball.motion.y >= 0) {
				let collisionPoint = detectCollision(ball, this.racket)
				if (collisionPoint && collisionPoint.y == this.racket.top) {
					const racketCenter = this.racket.width / 2
					const ballToCenter = ball.x - this.racket.x - racketCenter
					const dX = ballToCenter * Math.abs(ballToCenter) / Math.pow(racketCenter, 2) * this.cfg.racketReboundFactor
					ball.setDirection(dX, -1)
				}
			}

			//bricks
			const ballInBlockX = Math.floor(ball.pos.x / this.field.brickSize)
			const ballInBlockY = Math.floor(ball.pos.y / this.field.brickSize)
			let closestCollision = false
			for (let i = ballInBlockX - 2; i <= ballInBlockX + 2; i++) {
				for (let j = ballInBlockY - 2; j <= ballInBlockY + 2; j++) {
					if (this.bricks[i] && this.bricks[i][j] && this.bricks[i][j] instanceof Brick) {
						let collisionPoint = detectCollision(ball, this.bricks[i][j])
						if (collisionPoint) {
							if (!ball.colliding[i + 'x' + j]) {
								ball.colliding[i + 'x' + j] = true
								const reflectionVector = new Vector(...Point.subtract(ball.pos, collisionPoint).values)
								if (!closestCollision || reflectionVector.length < closestCollision.length) closestCollision = reflectionVector
								collisions.push({ ball, brick: this.bricks[i][j], point: collisionPoint })
							}
						}
						else delete ball.colliding[i + 'x' + j]
					}
				}
			}
			if (closestCollision) ball.motion.reflect(closestCollision)
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