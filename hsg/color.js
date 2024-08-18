// Convertations

export function hexToRGB(hex) {
  return [
    parseInt(hex.substring(1, 3), 16), //r
    parseInt(hex.substring(3, 5), 16), //g
    parseInt(hex.substring(5, 7), 16), //b
  ]
}

export function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function hexToHSL(hex) {
  let rgb = hexToRGB(hex)
  return rgbToHSL(...rgb)
}

export function rgbToHSL(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max == min) h = s = 0; // achromatic
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
  }
  return [h * 60, s * 100, l * 100];
}

export function rgbToHSB(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

export function hexToHSB(hex) {
  let rgb = hexToRGB(hex)
  return rgbToHSB(...rgb)
}

export const hsbToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
};

export function valueToHex(c) {
  var hex = c.toString(16);
  return hex
}

export function hsbToHex(h, s, b) {
  let [red, green, blue] = hsbToRGB(h, s, b)
  return rgbToHex(red, green, blue)
}

const scale = 1 / 3
export function hsgToRgb(h, s, g) {
  s /= 100
  g /= 100
  h += 180

  const sigma = g <= 1 / (1 + s) ? 1 : -1 / s
  const as = scale * s * (1 - (sigma * (1 + s) * (1 / (1 + s) - g)) ** 2)
  const max = Math.min(g + as, 1)
  const min = Math.max(g - as, 0)

  const k = (n) => (n + h / 60) % 6;
  const f = (n) => min + (max - min) * Math.max(0, Math.min(k(n), 4 - k(n), 1));

  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}