import { Rectangle, Vector } from "../utils/geometry.js"



export default class Racket extends Rectangle {
	constructor({ x = 0, y = 0, width = 1, height = 1, speed = 0 }) {
		super(x, y, width, height)
		this.speed = speed
		this.motion = new Vector(0, 0)
	}
}