import { drawChart, drawPoint, resetChart } from "./chart.js";
import { findEqualIntervalPoints, findPointByPosition, darkSaturation } from "./shades.js";
import { hsbToHex, hsbToRGB, hsgToRgb, rgbToHex, rgbToHSB } from "./color.js";
import { bezierCurve, cubicBezierCurve } from "./curves.js";



const hueInput = document.querySelector('#hue')
const saturationInput = document.querySelector('#saturation')
const brightnessInput = document.querySelector('#brightness')

const shadesNumberInput = document.querySelector('#shadesNumber')
const generateShadesButton = document.querySelector('#generateShades')

const shadePositionInput = document.querySelector('#shadePosition')
const generateShadeButton = document.querySelector('#generateShade')

const resetButton = document.querySelector('#reset')

const output = document.querySelector('#output')



function generateShades() {
  // get input values
  const h = parseInt(hueInput.value) || 0
  const s = parseInt(saturationInput.value) || 0
  const b = parseInt(brightnessInput.value) || 100
  const n = parseInt(shadesNumberInput.value)
  if (!n) return

  // make points
  const P0 = [0, 100]
  const P1 = [s, 100]
  const P2 = [s, b]
  const P3 = [s, 0]
  const points = findEqualIntervalPoints([P0, P1, P2, P3], n)

  // make shades
  const shades = points.map(point => hsbToHex(h, ...point))

  // display result
  drawChart(points, shades[Math.floor((shades.length - 1) / 2)])
  shades.forEach(shade => output.appendChild(createColorSample(shade)))

  // display rgb
  const shadesRgb = points.map(point => hsbToRGB(h, ...point))
  const rPoints = [], gPoints = [], bPoints = []
  shadesRgb.forEach((el, i) => {
    gPoints.push([i * 100 / (shadesRgb.length - 1), el[1] / 255 * 100])
    bPoints.push([i * 100 / (shadesRgb.length - 1), el[2] / 255 * 100])
    rPoints.push([i * 100 / (shadesRgb.length - 1), el[0] / 255 * 100])
  })
  drawChart(rPoints, '#ff0000')
  drawChart(gPoints, '#00ff00')
  drawChart(bPoints, '#0000ff')

  // display absolute saturation
  const asPoints = []
  for (let i = 0; i < shadesRgb.length; i++) {
    const v = Math.max(...shadesRgb[i])
    const as = v - Math.min(...shadesRgb[i])
    asPoints.push([i * 100 / (shadesRgb.length - 1), as / 255 * 100])
  }
  drawChart(asPoints, '#000')
}

generateShadesButton.addEventListener('click', generateShades)



function generateShade() {
  // get input values
  const h = parseInt(hueInput.value) || 0
  const s = parseInt(saturationInput.value) || 0
  const b = parseInt(brightnessInput.value) || 100
  const position = parseInt(shadePositionInput.value)
  if (!position) return

  // make points
  const P0 = [0, 100]
  const P1 = [s, b]
  const P2 = [darkSaturation(...P1), 0]
  const point = findPointByPosition([P0, P1, P2], position)

  // make shade
  const shade = hsbToHex(h, ...point)

  // display result
  drawPoint(...point, shade)
  output.appendChild(createColorSample(shade))
}

generateShadeButton.addEventListener('click', generateShade)



function createColorSample(color) {
  let newElement = document.createElement('div')
  newElement.className = 'colorSample'
  newElement.style.background = color
  newElement.innerHTML = color
  newElement.addEventListener('click', () => {
    navigator.clipboard.writeText(color)
  })
  return newElement
}



function reset() {
  resetChart()
  output.innerHTML = '';
}

resetButton.addEventListener('click', reset)



// HSG

const hHSGInput = document.querySelector('#hHSG')
const sHSGInput = document.querySelector('#sHSG')
const nHSGInput = document.querySelector('#nHSG')
const getHSGButton = document.querySelector('#getHSG')

getHSGButton.addEventListener('click', getHSGPalette)

function getHSGPalette() {
  // get input values
  const h = parseInt(hHSGInput.value) || 0
  const s = parseInt(sHSGInput.value) || 0
  let n = parseInt(nHSGInput.value)
  if (!n) return
  n -= 1

  // make colors
  const colors = []
  const hsbColors = []
  const rPoints = [], gPoints = [], bPoints = []
  for (let i = n; i >= 0; i--) {
    const hsg = [h, s, 100 / n * i]

    const rgb = hsgToRgb(...hsg)
    const hex = rgbToHex(...rgb)
    const hsb = rgbToHSB(...rgb)
    hsbColors.push([hsb[1], hsb[2]])
    rPoints.push([(n - i) * 100 / (n), rgb[0] / 255 * 100])
    gPoints.push([(n - i) * 100 / (n), rgb[1] / 255 * 100])
    bPoints.push([(n - i) * 100 / (n), rgb[2] / 255 * 100])
    colors.push(hex)
  }

  // display result
  colors.forEach(color => output.appendChild(createColorSample(color)))

  // display rgb & hsb values
  drawChart(hsbColors, colors[Math.floor(colors.length / 2)])
  drawChart(rPoints, '#ff0000')
  drawChart(gPoints, '#00ff00')
  drawChart(bPoints, '#0000ff')
}

// function hsgTest() {
//   const shades = []
//   const hsbShades = []
//   const n = 16
//   const rPoints = [], gPoints = [], bPoints = []
//   for (let i = n; i >= 0; i--) {
//     const hsg = [330, 25, 100 / n * i]
//     const rgb = hsgToRgb(...hsg)
//     const hex = rgbToHex(...rgb)
//     const hsb = rgbToHSB(...rgb)
//     hsbShades.push([hsb[1], hsb[2]])
//     rPoints.push([(n - i) * 100 / (n), rgb[0] / 255 * 100])
//     gPoints.push([(n - i) * 100 / (n), rgb[1] / 255 * 100])
//     bPoints.push([(n - i) * 100 / (n), rgb[2] / 255 * 100])
//     shades.push(hex)
//     output.appendChild(createColorSample(hex))
//   }

//   drawChart(hsbShades, shades[Math.floor(shades.length / 2)])
//   drawChart(rPoints, '#ff0000')
//   drawChart(gPoints, '#00ff00')
//   drawChart(bPoints, '#0000ff')
// }
// hsgTest()