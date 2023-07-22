import Brick from '../game/Brick.js'



//Save

export function bricksToMap(bricks, mapSize = bricks.length) {
	const map = []
	for (let i = 0; i < mapSize; i++) {
		map[i] = []
		for (let j = 0; j < mapSize; j++) {
			if (bricks[i][j]) {
				map[i][j] = { hp: bricks[i][j].hp, color: bricks[i][j].color }
			}
			else map[i][j] = false
		}
	}
	return map
}

export function mapToSave(map) {
	return JSON.stringify(map)
}

export function bricksToSave(bricks, mapSize) {
	return mapToSave(bricksToMap(bricks, mapSize))
}

// Load

export function mapToBricks(map, brickSize) {
	const bricks = []
	for (let i = 0; i < map.length; i++) {
		bricks[i] = []
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j]) {
				bricks[i][j] = new Brick({
					x: i * brickSize,
					y: j * brickSize,
					size: brickSize,
					hp: map[i][j].hp,
					color: map[i][j].color
				})
			}
			else bricks[i][j] = false
		}
	}
	return bricks
}

export function saveToMap(save) {
	return JSON.parse(save)
}

export function saveToBricks(save, brickSize) {
	return mapToBricks(saveToMap(save), brickSize)
}

//Maps

export function getBlankMap(size = 25) {
	const bricks = []
	for (let i = 0; i < size; i++) {
		bricks[i] = []
		for (let j = 0; j < size; j++) {
			bricks[i][j] = false
		}
	}
	return bricks
}

export function getSampleMap(size = 25, hp = 3) {
	const bricks = []
	for (let i = 0; i < size; i++) {
		bricks[i] = []
		for (let j = 0; j < size; j++) {
			if (i % 4 == 2 && j % 4 == 2) bricks[i][j] = {
				hp: hp,
				color: '#088'
			}
			else bricks[i][j] = false
		}
	}
	return bricks
}

export function countBricks(map) {
	let count = 0
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j]) count++
		}
	}
	return count
}