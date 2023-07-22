import { Rectangle } from "../utils/geometry.js"

export default class Field extends Rectangle {
	constructor(mapSize, brickSize = 1, game) {
		super(0, 0, mapSize * brickSize, game ?
			mapSize * brickSize * 4 / 3 :
			mapSize * brickSize)
		this.brickSize = brickSize
	}

	setSize(mapSize) {
		this.width = mapSize * this.brickSize
		this.height = mapSize * this.brickSize
	}

	get mapSize() { return this.width / this.brickSize }
}