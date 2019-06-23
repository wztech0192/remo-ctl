import Player from './GameObject/Player';
import Point from './GameObject/Point';
import * as Util from './Util/Tool';
import QuadTree from './Util/QuadTree';

//const movementSpeed = 10;

export default class Game {
  constructor(canvas) {
    canvas.width = document.body.clientWidth - 20;
    canvas.height = 250;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.quadtree = new QuadTree(1, canvas);
    this.gameReset();
    this.gameLoop();
  }

  gameReset() {
    this.enemies = [];
    this.bullets = [];
    this.level = 1;
    this.player = this.generatePlayer();
  }

  generatePlayer() {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const diameter = 20;
    const hp = 100;
    const property = {
      atkCD: 6,
      atkDMG: 10,
      atkSize: 5,
      atkSpeed: 4,
      target: new Point(x, y, 1, 10)
    };
    return new Player(x, y, hp, diameter, property);
  }

  gameStop() {
    if (this.animate !== null) {
      cancelAnimationFrame(this.animate);
      this.animate = null;
    }
  }

  gameLoop = () => {
    this.attackFrom(this.player);
    this.bulletAction();
    this.draw();
    this.animate = requestAnimationFrame(this.gameLoop);
  };

  aimMove(xS, yS) {
    this.player.property.target.x += xS;
    this.player.property.target.y += yS;
  }

  increaseBulletSize(dx) {
    const newVal = this.player.property.atkSize + dx / 100;
    if (newVal > 1) {
      this.player.property.atkSize = newVal;
    }
  }

  togglePlayerAttack() {
    this.player.attack = !this.player.attack;
  }

  attackFrom(attacker) {
    if (attacker.attackCD > 0) attacker.attackCD--;
    else if (attacker.attack) {
      var bullet = new Point(
        attacker.x,
        attacker.y,
        attacker.property.atkDMG,
        attacker.property.atkSize
      );
      var velocity = Util.calVelocity(
        bullet,
        attacker.property.target,
        attacker.property.atkSpeed
      );
      bullet.setVelocity(velocity);
      this.bullets.push(bullet);
      attacker.resetCD();
    }
    /*if (!turret.isEmpty()) {
      turret.forEach(node => {
        bulletFire(node.val);
      });*/
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
      }
    }

    /* while (node !== null) {
      var b = node.val;
      b.move();
      if (--b.life <= 0) {
        bullets.shift();
      } else if (!mob.isEmpty()) {
        //detect bullet-mob collision
        var node2 = quadtree.retrieve(new LinkedList(), b).first;
        while (node2 !== null) {
          var m = node2.val;
          if (testCollision(b, m, ballSize)) {
            addBlood(m, b, mobColor);
            bullets.remove(node);
            if (--m.life <= 0) {
              score++;
              mob.removeByValue(m);
            }
            break;
          }
          node2 = node2.next;
        }
      }
      node = node.next;
    }*/
  }

  /**CANVAS DRAW */

  draw() {
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //clear canvas
    this.ctx.strokeStyle = '#666666';
    this.quadtree.drawGrid(this.ctx);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.54)';
    this.drawObject(this.player);
    this.drawAim(this.player.property.target, false);
    this.drawEachObject(this.bullets);
    //drawEachObject(this.turret);
    //this.ctx.fillStyle = mobColor;
    this.drawEachObject(this.enemies);
    /* this.blood.forEach(node => {
      if (this.ctx.fill !== node.val.color) this.ctx.fillStyle = node.val.color;
      this.drawObject(node.val);
    });*/
    this.ctx.closePath();
    /*this.ctx.fillStyle = 'gray';
    this.ctx.fillText('Turret Remain: ' + remainTurret, 10, 25);
    this.ctx.fillText('Turret Status: ' + turretstat, 10, 50);
    if (remainTurret > 0) this.ctx.fillText("Press 'T' to Deploy", 10, 75);
    this.ctx.fillText('Health: ' + this.player.life, canvas.width / 2 - 45, 25);
    this.ctx.fillText('Level: ' + level, canvas.width - 150, 25);
    this.ctx.fillText('Score: ' + score, canvas.width - 150, 50);
    this.ctx.fillText('Highest Level: ' + highestLevel, canvas.width - 175, 75);*/
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
  drawInfo(str) {
    this.ctx.font = '350% Comic Sans MS';
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(str, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.textAlign = 'left';
    this.ctx.font = '125% Comic Sans MS';
  }
}
