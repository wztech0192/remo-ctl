import Point from './Point';

//mob extend of point
export default class Mob extends Point {
  constructor(x, y, diameter, hp, speed) {
    super(x, y, diameter, hp);
    this.speed = speed;
    this.directionCD = Math.random() * 50;
    this.direction = randBoolean();
    this.directionAngle = 10 + Math.random() * 100;
    this.targetCD = Math.random() * 100;
  }

  updateDirection(maxCD, directionAngle) {
    this.directionCD = Math.random() * maxCD;
    this.direction = randBoolean();
    this.directionAngle = directionAngle;
  }
}
