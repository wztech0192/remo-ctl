import React, { Component } from 'react';
import { gameConnector } from 'tools';

class GameCanvas extends Component {
  componentDidMount() {
    gameConnector.startGame(this.refs.canvas);
  }

  componentWillUnmount() {
    gameConnector.stopGame();
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width="100%"
        height="250px"
        onClick={gameConnector.toggleGamePause}
      />
    );
  }
}

export default GameCanvas;
