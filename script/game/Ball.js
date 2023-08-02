import { Circle, Vector } from "../utils/geometry.js"

export default class Ball extends Circle {
	constructor({ x = 0, y = 0, radius: r = 1, dX = 0, dY = 1, speed = 0 }) {
		super(x, y, r)
		this.speed = speed
		this.motion = new Vector(dX, dY)
		this.motion.setLength(this.speed)
		this.colliding = {}
		this.effects = {}
	}

	setDirection(dX, dY) {
		this.motion.setDirection(new Vector(dX, dY))
	}

	setSpeed(val) {
		this.speed = val
		this.motion.setLength(val)
	}

	throw(dX, dY) {
		this.motion.set(dX, dY)
		this.motion.setLength(this.speed)
	}
}