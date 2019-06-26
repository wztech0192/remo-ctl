export default class GameConnector {
  setGame(game) {
    this.game = game;
  }

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
