import Point from './Point';

export default class Player extends Point {
  constructor(x, y, hp, diameter, property) {
    super(x, y, hp, diameter);
    this.attack = false;
    this.property = property;
    this.attackCD = 0;
  }

  resetCD() {
    this.attackCD = this.property.atkCD;
  }
}
