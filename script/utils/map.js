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

export function getCompressedSave(bricks, size = bricks.length) {
	let uniqueBricks = []
	let compressedIndexMap = []

	for (let i = 0; i < size; i++) {
		compressedIndexMap.push([])
		for (let j = 0; j < size; j++) {
			let currentValue = getCompressedBrickData(bricks[i][j])

			let spcindex = uniqueBricks.indexOf(currentValue)
			if (spcindex < 0) spcindex = uniqueBricks.push(currentValue) - 1

			if (compressedIndexMap[i].length == 0 || compressedIndexMap[i][compressedIndexMap[i].length - 1]?.value != spcindex) {
				compressedIndexMap[i].push({ value: spcindex, count: 1 })
			} else {
				compressedIndexMap[i][compressedIndexMap[i].length - 1].count++
			}
		}
	}

	return uniqueBricks.join(' ') + '\n' + compressedIndexMap.map(
		row => row.map(
			el => el.value.toString(36) + el.count.toString(36)
		).join(" ")
	).join("\n")
}

export function getMap(compressedSave) {
	let [uniqueBricks, ...indexMap] = compressedSave.split('\n')
	uniqueBricks = uniqueBricks.split(' ').map(brick => brick = getBrick(brick))
	indexMap = indexMap.map(col => col = col.split(' ').map(el => el = {
		value: parseInt(el[0], 36),
		count: parseInt(el[1], 36)
	}))

	let map = []
	for (let i = 0; i < indexMap.length; i++) {
		map[i] = []
		for (let j = 0; j < indexMap[i].length; j++) {
			for (let k = 0; k < indexMap[i][j].count; k++) map[i].push(uniqueBricks[indexMap[i][j].value])
		}
	}

	return map
}

function getCompressedBrickData(brick) {
	if (brick) return brick.hp.toString(36) + brick.color.substring(1)
	else return '0'
}

function getBrick(compressedBrickData) {
	if (compressedBrickData == '0') return false
	else return {
		hp: parseInt(compressedBrickData[0], 36),
		color: '#' + compressedBrickData.substring(1)
	}
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
