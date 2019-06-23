import React, { Component } from 'react';
import Game from './Game';

class GameCanvas extends Component {
  componentDidMount() {
    this.game = new Game(this.refs.canvas);
    this.props.connector.setGame(this.game);
  }

  componentWillUnmount() {
    this.props.connector.setGame(null);
    this.game.gameStop();
    this.game = null;
  }

  render() {
    return <canvas ref="canvas" width="100%" height="250px" />;
  }
}

export default GameCanvas;
