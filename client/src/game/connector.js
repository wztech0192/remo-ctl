import Game from 'game';

export default class GameConnector {
  hasGame() {}

  startGame(canvas) {
    this.game = new Game(canvas);
  }

  stopGame() {
    this.game.gameStop();
    this.game = null;
  }

  toggleGamePause = () => {
    if (!this.game) return;
    if (this.game.isGameRunning()) {
      this.game.gameStop();
    } else {
      this.game.gameLoop();
    }
  };

  dispatch(type, actions) {
    switch (type) {
      case 'mw':
        this.game.changeWeapon(actions[0]);
        break;
      case 'mm':
        this.game.aimMove(actions[0], actions[1]);
        break;
      case 'mc':
        this.game.setPlayerAttackStatus(true);
        break;
      case 'me':
        this.game.setPlayerAttackStatus(false);
        break;
      default:
    }
  }
}
