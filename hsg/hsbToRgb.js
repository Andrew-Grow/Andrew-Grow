// symmetric quadratic
export function hsgToRgb(h, s, g) {
  s /= 100
  g /= 100
  h += 180
  const as = -s * ((g - 0.5) / 0.5) ** 2 + s
  const max = Math.min(g + as / 2, 1)
  const min = Math.max(g - as / 2, 0)

  const k = (n) => (n + h / 60) % 6;
  const f = (n) => min + (max - min) * Math.max(0, Math.min(k(n), 4 - k(n), 1));

  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}

// linear
export function hsgToRgb(h, s, g) {
  s /= 100
  g /= 100
  h += 180
  const max = Math.min(1, g / (1 - 0.5 * s))
  const min = Math.max(0, (1 - s) * g, (g - 0.5) / 0.5)
  console.log(max, min, max - min)

  const k = (n) => (n + h / 60) % 6;
  const f = (n) => min + (max - min) * Math.max(0, Math.min(k(n), 4 - k(n), 1));

  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}

// ???
export function hsgToRgb(h, s, g) {
  s /= 100
  g /= 100
  h += 180
  const max = g + (1 + (g - 1) ** 3) / 2
  const min = g ** 3

  const k = (n) => (n + h / 60) % 6;
  const f = (n) => min + (max - min) * Math.max(0, Math.min(k(n), 4 - k(n), 1));

  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}

// quadratic with linear peak shift
export function hsgToRgb(h, s, g) {
  s /= 100
  g /= 100
  h += 180
  const as = g <= 1 - 0.5 * s ?
    -scale * s * ((-g + 1 - 0.5 * s) / (1 - 0.5 * s)) ** 2 + scale * s :
    -scale * s * ((g - 1 + 0.5 * s) / (0.5 * s)) ** 2 + scale * s
  console.log(g, s, as)
  const max = Math.min(g + as, 1)
  const min = Math.max(g - as, 0)

  const k = (n) => (n + h / 60) % 6;
  const f = (n) => min + (max - min) * Math.max(0, Math.min(k(n), 4 - k(n), 1));

  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}

//quadratic with hyperbolic peak shift
export function hsgToRgb(h, s, g) {
  s /= 100
  g /= 100
  h += 180
  const as = g <= 1 / (1 + s) ?
    scale * s * (1 - ((1 + s) * -(g - 1 / (1 + s))) ** 2) :
    scale * s * (1 - ((1 + s) / s * (g - 1 / (1 + s))) ** 2)
  const max = Math.min(g + as, 1)
  const min = Math.max(g - as, 0)

  const k = (n) => (n + h / 60) % 6;
  const f = (n) => min + (max - min) * Math.max(0, Math.min(k(n), 4 - k(n), 1));

  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}