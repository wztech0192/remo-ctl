import Player from './GameObject/Player';
import Mob from './GameObject/Mob';
import Point from './GameObject/Point';
import Weapon from './GameObject/Weapon';
import * as Util from './Util/Tool';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
//const movementSpeed = 10;
const mobColor = 'rgba(0, 0, 0, 0.54)';
const playerColor = 'rgb(0, 155, 160)';

const getHighestScore = () => {
  var score = cookies.get('highestscore');
  if (score === undefined || score === null || score === '') {
    return 0;
  }
  try {
    return parseInt(score);
  } catch {
    return 0;
  }
};

export default class Game {
  constructor(canvas) {
    canvas.width = document.body.clientWidth - 20;
    canvas.height = 250;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.highestScore = getHighestScore();
    this.animate = null;
    this.gameReset();
    this.draw();
    this.drawPauseStatus();
  }

  gameReset() {
    this.mobList = [];
    this.bloodList = [];
    this.bullets = [];
    if (this.score > this.highestScore) {
      this.highestScore = this.score;
      cookies.set('highestscore', this.highestScore);
    }
    this.score = 0;
    this.spawnMob = 0;
    this.selectedWeapon = 0;
    this.level = 1;
    this.weaponList = [
      new Weapon('Pistol', 20, 5, 5, 4),
      new Weapon('Sniper', 35, 30, 10, 7),
      new Weapon('Rifle', 3, 1, 2, 4, 10, 2),
      new Weapon('Shotgun', 25, 1, 4, 3, 10, 10)
    ];
    this.player = this.generatePlayer();
  }

  generatePlayer() {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const diameter = 20;
    const hp = 100;
    return new Player(
      x,
      y,
      hp,
      diameter,
      new Point(x, y, 1, 10),
      this.weaponList[0]
    );
  }

  isGameRunning = () => {
    return this.animate !== null;
  };

  gameStop = isGameOver => {
    if (this.isGameRunning()) {
      clearTimeout(this.spawning);
      this.spawning = null;
      cancelAnimationFrame(this.animate);
      this.animate = null;
    }
    this.drawPauseStatus(isGameOver);
  };

  gameLoop = () => {
    if (this.player.hp > 0) {
      this.generateMob();
      this.mobAction();
      this.bloodAction();
      this.attackFrom(this.player);
      this.bulletAction();
      this.draw();
      this.animate = requestAnimationFrame(this.gameLoop);
    } else {
      this.gameStop(true);
      this.gameReset();
    }
  };

  aimMove(xS, yS) {
    var newX = this.player.target.x + xS;
    var newY = this.player.target.y + yS;
    if (newX > 0 && newX < this.canvas.width) {
      this.player.target.x = newX;
    }
    if (newY > 0 && newY < this.canvas.height) {
      this.player.target.y = newY;
    }
  }

  changeWeapon(dx) {
    if (!this.changeCD) {
      if (dx > 0) {
        if (this.selectedWeapon > 0) this.selectedWeapon--;
      } else {
        if (this.selectedWeapon < this.weaponList.length - 1)
          this.selectedWeapon++;
      }
      this.player.weapon = this.weaponList[this.selectedWeapon];
      this.changeCD = true;
      setTimeout(() => (this.changeCD = false), 350);
    }
  }

  setPlayerAttackStatus(isAttack) {
    this.player.attack = isAttack;
  }

  attackFrom(attacker) {
    if (attacker.attackCD > 0) attacker.attackCD--;
    else if (attacker.attack) {
      for (let i = 0; i < attacker.weapon.atkTimes; i++) {
        var bullet = new Point(
          attacker.x,
          attacker.y,
          attacker.weapon.atkDMG,
          attacker.weapon.atkSize
        );
        if (attacker.weapon.accuracy > 1) {
          //accuracy base on this number, the larger number the lower accuracy
          let accuracy = attacker.weapon.accuracy;
          var newP = {
            x: attacker.target.x + (accuracy - Math.random() * accuracy * 2),
            y: attacker.target.y + (accuracy - Math.random() * accuracy * 2)
          };
          Util.setPath(bullet, newP, attacker.weapon.atkSpeed);
        } else {
          Util.setPath(bullet, attacker.target, attacker.weapon.atkSpeed);
        }
        this.bullets.push(bullet);
      }
      attacker.resetCD();
    }
  }

  bulletAction() {
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      bullet.move();
      if (
        bullet.hp < 0 ||
        bullet.x < 0 ||
        bullet.x > this.canvas.width ||
        bullet.y < 0 ||
        bullet.y > this.canvas.height
      ) {
        this.bullets.splice(i, 1);
      } else if (this.mobList.length > 0) {
        //detect bullet-mob collision
        this.mobList.forEach(mob => {
          if (Util.isCollide(bullet, mob)) {
            this.addBlood(mob, bullet);
            let bHP = bullet.hp;
            bullet.hp -= mob.hp;
            mob.hp -= bHP;
          }
        });
      }
    }
  }

  generateMob() {
    if (!this.spawning && this.mobList <= 0 && this.spawnMob <= 0) {
      this.spawning = setTimeout(() => {
        this.level++;
        this.spawnMob = 3 + this.level;
        this.spawning = null;
      }, 3000);
    }

    if (this.spawnMob > 0) {
      const rand = [Util.randBoolean(), Util.randBoolean()];
      const diameter = 5 + Math.random() * 20;
      const hp = 5;
      let mob;
      if (rand[0] && rand[1])
        mob = new Mob(
          this.canvas.width,
          Math.random() * this.canvas.height,
          hp,
          diameter
        );
      else if (!rand[0] && !rand[1])
        mob = new Mob(
          Math.random() * this.canvas.width,
          this.canvas.height,
          hp,
          diameter
        );
      else if (rand[0])
        mob = new Mob(Math.random() * this.canvas.width, 0, hp, diameter);
      else mob = new Mob(0, Math.random() * this.canvas.height, hp, diameter);

      const speed = 0.1 + Math.sqrt(this.level) / 10;
      Util.setPath(mob, this.player, speed);
      this.mobList.push(mob);
      this.spawnMob--;
    }
  }

  mobAction() {
    for (var i = 0; i < this.mobList.length; i++) {
      let mob = this.mobList[i];
      if (mob.hp <= 0) {
        this.score++;
        this.mobList.splice(i, 1);
      } else {
        let speed = 0.2 + Math.sqrt(this.level) / 8;
        if (mob.targetCD > 0) {
          //travel toward target when cd is positive
          mob.targetCD--;
          if (this.level >= 0) {
            //circular path
            if (mob.directionCD <= 0) {
              // change direction
              let directionAngle = 20 + Math.random() * 120;
              mob.updateDirection(150, directionAngle);
            }
            if (mob.direction)
              Util.setCircularPath(mob, this.player, speed, mob.directionAngle);
            else
              Util.setCircularPath(
                mob,
                this.player,
                -speed,
                -mob.directionAngle
              );
          }
          mob.directionCD--;
        } else if (mob.targetCD === 0) {
          //randomize targeting cd from -100 to 100
          mob.targetCD = 200 * Math.random() - 100;
        } else mob.targetCD++; //travel without target when cd is negative
        mob.move();
        if (Util.isCollide(mob, this.player)) {
          this.player.hp -= mob.hp;
          this.addBlood(this.player, mob);
          this.mobList.splice(i, 1);
        }
      }
    }
  }

  addBlood(p1, p2) {
    var num = p2.hp;
    for (var i = 0; i < num; ++i) {
      const bld = new Point(
        p2.x,
        p2.y,
        Math.random() * 100,
        p1.radius * (0.6 * Math.random() + 0.2)
      );
      let xs2, ys2;
      if (p2.vel) {
        xs2 = p2.vel.xS;
        ys2 = p2.vel.yS;
      } else {
        xs2 = -p1.vel.xS * 2;
        ys2 = -p1.vel.yS * 2;
      }
      var sp = (Math.abs(xs2) + Math.abs(ys2)) / 2;
      const xS = (xs2 > 0 ? sp : -sp) * Math.random();
      const yS = (ys2 > 0 ? sp : -sp) * Math.random();
      bld.setVelocity({ xS, yS });
      this.bloodList.push(bld);
    }
  }

  bloodAction() {
    for (let i = 0; i < this.bloodList.length; i++) {
      let b = this.bloodList[i];
      b.move();
      if (--b.hp <= 0) {
        this.bloodList.splice(i, 1);
      }
    }
  }

  /**CANVAS DRAW */

  draw() {
    this.ctx.fillStyle = 'rgba(250, 250, 250, .6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //clear canvas
    this.ctx.strokeStyle = playerColor;
    this.ctx.fillStyle = playerColor;
    this.drawObject(this.player);
    this.drawAim(this.player.target, false);
    this.drawEachObject(this.bullets);
    this.ctx.fillStyle = mobColor;
    this.drawEachObject(this.bloodList);
    this.drawEachObject(this.mobList);
    this.ctx.closePath();
    this.drawInfo();
  }

  drawObject(obj) {
    this.ctx.beginPath();
    this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  drawAim(obj) {
    this.ctx.beginPath();
    this.ctx.moveTo(obj.x - obj.radius, obj.y);
    this.ctx.lineTo(obj.x + obj.radius, obj.y);
    this.ctx.stroke();
    this.ctx.moveTo(obj.x, obj.y - obj.radius);
    this.ctx.lineTo(obj.x, obj.y + obj.radius);
    this.ctx.stroke();
  }

  drawEachObject(objs) {
    objs.forEach(val => {
      this.drawObject(val);
    });
  }

  //draw information on center of canvas
  drawInfo() {
    this.ctx.fillText('Score: ' + this.score, 20, 10);
    this.ctx.fillText(
      'Highest Score: ' + this.highestScore,
      20,
      this.canvas.height - 10
    );
    this.ctx.fillText('Health: ' + this.player.hp, this.canvas.width - 70, 10);
    this.ctx.fillText(
      this.player.weapon.name,
      this.canvas.width - 70,
      this.canvas.height - 10
    );
  }

  drawPauseStatus(isGameOver) {
    this.ctx.fillText(
      isGameOver ? 'You Die! Touch To Restart' : 'Touch Me To Start!',
      this.canvas.width / 2 - 35,
      30
    );
  }
}
