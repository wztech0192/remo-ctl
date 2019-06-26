import Point from './Point';

export default class Player extends Point {
  constructor(x, y, hp, diameter, target, weapon) {
    super(x, y, hp, diameter);
    this.attack = false;
    this.target = target;
    this.weapon = weapon;
    this.attackCD = 0;
  }

  resetCD() {
    this.attackCD = this.weapon.atkCD;
  }
}
