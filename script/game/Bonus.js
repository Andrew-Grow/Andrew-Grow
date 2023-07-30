import { Circle, Vector } from "../utils/geometry.js";

export default class Bonus extends Circle {
	constructor({ x = 0, y = 0, r = 1, dX = 0, dY = 0, maxSpeed = 1, type = '' }) {
		super(x, y, r)
		this.motion = new Vector(dX, dY)
		this.maxSpeed = maxSpeed
		this.type = type
		console.log(this.type)
	}
}