// Init

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasScale = canvas.width / 100

resetChart()

export function drawChart(points, color = randomColor()) {
  // draw lines
  for (let i = 0; i < points.length - 1; i++) {
    drawLine(...points[i], ...points[i + 1], color)
  }

  // draw points
  for (let i = 0; i < points.length; i++) {
    drawPoint(...points[i], color)
  }
}

export function resetChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(5)
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777216).toString(16)
}

function translatePoint(x, y) { //translate coordinates to the chart dimensions
  x = x * canvasScale
  y = 1000 - y * canvasScale
  return [x, y]
}

function drawGrid(xStep, yStep = xStep) {
  const xLines = canvas.width / xStep * canvasScale
  const yLines = canvas.height / yStep * canvasScale

  ctx.strokeStyle = ('#eee')
  ctx.strokeWidth = 2.5

  for (let i = 0; i < xLines; i++) {
    drawLine(i * xStep, 0, i * xStep, canvas.height)
  }

  for (let i = 0; i < yLines; i++) {
    drawLine(0, i * yStep, canvas.width, i * yStep)
  }
}

// Draw Shapes

function drawLine(x1, y1, x2, y2, color = randomColor) {
  ctx.lineWidth = 2.5
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(...translatePoint(x1, y1))
  ctx.lineTo(...translatePoint(x2, y2))
  ctx.stroke()
}

export function drawPoint(x, y, color = randomColor) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(...translatePoint(x, y), ctx.lineWidth * 2, 0, (Math.PI / 180) * 360)
  ctx.fill()
}