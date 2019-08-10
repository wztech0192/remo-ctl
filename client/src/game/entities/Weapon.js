export default class Weapon {
  constructor(name, atkCD, atkDMG, atkSize, atkSpeed, accuracy, atkTimes) {
    this.name = name;
    this.atkCD = atkCD;
    this.atkDMG = atkDMG;
    this.atkSize = atkSize;
    this.atkSpeed = atkSpeed;
    this.atkTimes = atkTimes || 1;
    this.accuracy = accuracy || 1;
  }
}
