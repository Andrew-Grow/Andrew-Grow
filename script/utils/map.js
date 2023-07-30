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
  let specimens = []
  let indexMap = []
  for (let i = 0; i < size; i++) {
    indexMap.push([])
    for (let j = 0; j < size; j++) {
      let currentValue = getCompressedBrickData(bricks[i][j])
      let spcindex = specimens.indexOf(currentValue)
      if (spcindex >= 0) indexMap[i][j] = spcindex
      else indexMap[i][j] = specimens.push(currentValue) - 1
    }
  }
  return JSON.stringify([specimens, indexMap])
}

export function getMegaCompressedSave(bricks, size = bricks.length) {
  let specimens = []
  let compressedIndexMap = []

  for (let i = 0; i < size; i++) {
    compressedIndexMap.push([])
    for (let j = 0; j < size; j++) {
      let currentValue = getCompressedBrickData(bricks[i][j])

      let spcindex = specimens.indexOf(currentValue)
      if (spcindex < 0) spcindex = specimens.push(currentValue) - 1

      if (compressedIndexMap[i].length == 0 || compressedIndexMap[i][compressedIndexMap[i].length - 1]?.value != spcindex) {
        compressedIndexMap[i].push({ value: spcindex, count: 1 })
      } else {
        compressedIndexMap[i][compressedIndexMap[i].length - 1].count++
      }
    }
  }

  return specimens.join(' ') + '\n' + compressedIndexMap.map(
    row => row.map(
      el => el.value.toString(36) + el.count.toString(36)
    ).join(" ")
  ).join("\n")
}

// export function getCompressedSave(bricks, size = bricks.length) {
//   let compressedMapData = []
//   for (let i = 0; i < size; i++) {
//     compressedMapData.push([])
//     for (let j = 0; j < size; j++) {
//       let currentValue = getCompressedBrickData(bricks[i][j])
//       if (compressedMapData[i].length == 0 || compressedMapData[i][compressedMapData[i].length - 1]?.value != currentValue) {
//         compressedMapData[i].push({ value: currentValue, count: 1 })
//       } else {
//         compressedMapData[i][compressedMapData[i].length - 1].count++
//       }
//     }
//   }
//   const result = compressedMapData.map(row => row.map(el => el.value.toString(16) + " " + el.count.toString(16)).join(" ")).join("\n")
//   console.log(result)
//   return result
// }

function getCompressedBrickData(brick) {
  if (brick) return brick.hp.toString(16) + brick.color.substring(1)
  else return '0'
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
