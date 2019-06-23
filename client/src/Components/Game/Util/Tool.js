//utility tools
import Point from '../GameObject/Point';

export const randBoolean = () => {
  return Math.random() >= 0.5;
};

export const calVelocity = (p1, p2, speed) => {
  var xDif = p1.x - p2.x,
    yDif = p1.y - p2.y,
    angle = Math.atan2(xDif, yDif) / Math.PI,
    xS = -Math.sin(angle * Math.PI) * speed,
    yS = -Math.cos(angle * Math.PI) * speed;
  return { xS, yS };
};

export const orbitalPath = (p1, p2, speed) => {
  var xDif = p1.x - p2.x,
    yDif = p1.y - p2.y,
    angle = Math.atan2(xDif, yDif) / Math.PI,
    xS = -Math.cos(angle * Math.PI) * speed,
    yS = Math.sin(angle * Math.PI) * speed;
  return { xS, yS };
};

export const circularPath = (p1, p2, speed, adjustAngle) => {
  var path = adjustPathPoint(p1, p2, adjustAngle);
  orbitalPath(p1, path, speed);
};

export const adjustPathPoint = (p1, p2, adjustAngle) => {
  var angle = findAngle(p1, p2),
    distance = findDist(p1, p2),
    angleRad = ((angle - adjustAngle) * Math.PI) / 180;
  return findAdjustAnglePoint(p2, distance, angleRad);
};

export const findAdjustAnglePoint = (p, distance, angleRad) => {
  var newX = p.x + distance * Math.cos(angleRad),
    newY = p.y + distance * Math.sin(angleRad);
  return new Point(newX, newY);
};

export const testCollision = (p1, p2, ballSize) => {
  return ballSize * p1.radius + ballSize * p2.radius - findDist(p1, p2) >= 0;
};

export const findAngle = (p1, p2) => {
  var rad = Math.atan2(p1.y - p2.y, p1.x - p2.x),
    angle = rad * (180 / Math.PI);
  return angle < 0 ? angle + 360 : angle;
};

export const findDist = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};
