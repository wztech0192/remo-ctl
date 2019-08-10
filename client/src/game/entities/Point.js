//point object
export default class Point {
  constructor(x, y, hp, diameter) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.diameter = diameter;
    this.radius = diameter / 2;
  }
  setXY(x, y) {
    this.x = x;
    this.y = y;
  }
  move() {
    this.x += this.vel.xS;
    this.y += this.vel.yS;
  }
  setVelocity(velocity) {
    this.vel = velocity;
  }
}
