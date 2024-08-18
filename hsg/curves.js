export const ellipseCurve = (x, s, b) => {
  const y = b + ((100 - b) / 100) * Math.sqrt(Math.pow(100, 2) - Math.pow((100 / s * x), 2))
  return y
}

export const superellipseCurve = (x, s, b, r = 3) => {
  const y = b + ((100 - b) / 100) * Math.pow((Math.pow(100, r) - Math.pow((100 / s * x), r)), 1 / r)
  return y
}

export function bezierCurve(P0, P1, P2, t) {
  const x = (1 - t) ** 3 * P0[0] + 3 * (1 - t) * t * P1[0] + t ** 3 * P2[0];
  const y = (1 - t) ** 3 * P0[1] + 3 * (1 - t) * t * P1[1] + t ** 3 * P2[1];
  return [x, y];
}

export function cubicBezierCurve(P0, P1, P2, P3, t) {
  const x = (1 - t) ** 3 * P0[0] + 3 * (1 - t) ** 2 * t * P1[0] + 3 * (1 - t) * t ** 2 * P2[0] + t ** 3 * P3[0];
  const y = (1 - t) ** 3 * P0[1] + 3 * (1 - t) ** 2 * t * P1[1] + 3 * (1 - t) * t ** 2 * P2[1] + t ** 3 * P3[1];
  return [x, y];
}