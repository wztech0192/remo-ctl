import Point from './Point';
import { randBoolean } from '../tools';

//mob extend of point
export default class Mob extends Point {
  constructor(x, y, hp, diameter, speed) {
    super(x, y, hp, diameter);
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
