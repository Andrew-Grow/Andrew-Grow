import { Rectangle } from "../utils/geometry.js";



export default class Brick extends Rectangle {
	constructor({ x, y, size, hp = 1, color = '' }) {
		super(x, y, size, size)
		this.hp = hp
		this.color = color
	}

	damage() {
		if (this.hp > 0) this.hp--
	}
}