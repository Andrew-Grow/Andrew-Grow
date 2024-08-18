import { bezierCurve, cubicBezierCurve } from "./curves.js";

// Функция для аппроксимации длины кривой и сохранения всех точек
export function findCurvePoints(controlPoints, segments = 1000) {
  let points = [];
  let lengths = [];
  let totalLength = 0;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = cubicBezierCurve(...controlPoints, t);
    points.push(point);

    if (i > 0) {
      const prevPoint = points[i - 1];
      const segmentLength = Math.sqrt((point[0] - prevPoint[0]) ** 2 + (point[1] - prevPoint[1]) ** 2);
      totalLength += segmentLength;
      lengths.push(totalLength);
    } else {
      lengths.push(0);
    }
  }

  return { points, lengths, totalLength };
}



export function findEqualIntervalPoints(controlPoints, numPoints) {
  const { points, lengths, totalLength } = findCurvePoints(controlPoints);
  const segmentLength = totalLength / (numPoints - 1);

  let equalIntervalPoints = [controlPoints[0]];

  for (let i = 1; i < numPoints - 1; i++) {
    const targetLength = i * segmentLength;
    let j = 0;

    while (lengths[j] < targetLength) {
      j++;
    }

    // Линейная интерполяция для более точного результата
    const t = (targetLength - lengths[j - 1]) / (lengths[j] - lengths[j - 1]);
    const interpolatedPoint = [
      points[j - 1][0] + t * (points[j][0] - points[j - 1][0]),
      points[j - 1][1] + t * (points[j][1] - points[j - 1][1])
    ];

    equalIntervalPoints.push(interpolatedPoint);
  }

  equalIntervalPoints.push(controlPoints[controlPoints.length - 1]);
  return equalIntervalPoints;
}



export function findPointByPosition(controlPoints, position) {
  const { points, lengths, totalLength } = findCurvePoints(controlPoints);
  const targetLength = totalLength * position / 100;

  let j = 0;
  while (lengths[j] < targetLength && j < lengths.length - 1) {
    j++;
  }

  // Линейная интерполяция для более точного результата
  const t = (targetLength - lengths[j - 1]) / (lengths[j] - lengths[j - 1]);
  const interpolatedPoint = [
    points[j - 1][0] + t * (points[j][0] - points[j - 1][0]),
    points[j - 1][1] + t * (points[j][1] - points[j - 1][1])
  ];

  return interpolatedPoint;
}



// Saturation compensation for dark colors

const compensationFactor = 1.33

export function darkSaturation(s, b) {
  return s * (b * (compensationFactor - 1) / 100 + 1)
}