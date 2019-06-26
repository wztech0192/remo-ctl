import React, { Component } from 'react';
import Main from './Components/Main';
import MessageModal from './Components/MessageModal';
import Header from './Components/Header';
import Output from './Components/Output';
import CmdInput from './Components/CmdInput';
import ActionGroup from './Components/ActionGroup';
import Grow from '@material-ui/core/Grow';
import Controller from './Components/Controller';
import Grid from '@material-ui/core/Grid';
import LeftArrow from '@material-ui/icons/ArrowLeft';
import RightArrow from '@material-ui/icons/ArrowRight';
import Cookies from 'universal-cookie';
import GameConnector from './Components/Game/GameConnector';
import GameCanvas from './Components/Game/GameCanvas';

const gc = new GameConnector();
const cookies = new Cookies();
let ws = null;

const getSpeed = (strVal, defaultSpeed) => {
  if (strVal === undefined || strVal === null || strVal === '') {
    return defaultSpeed;
  }
  try {
    return parseInt(strVal);
  } catch {
    return defaultSpeed;
  }
};

const config = {
  mouseSpeed: getSpeed(cookies.get('mouseSpeed'), 4),
  motionSpeed: getSpeed(cookies.get('motionSpeed'), 10),
  scrollSpeed: getSpeed(cookies.get('scrollSpeed'), 10)
};

class App extends Component {
  state = {
    isConnected: false,
    loading: false,
    open: false,
    showLeft: true,
    showRight: true,
    isLandscape: window.orientation === 90,
    offline: false,
    drawerOpen: false,
    fullScreen: false,
    gameMode: false
  };

  componentDidMount() {
    window.addEventListener('orientationchange', () => {
      this.setState({ isLandscape: window.orientation === 90 });
    });
  }

  makeConnection = ip => {
    if (ip.toLowerCase() === 'offline') {
      this.setState({ offline: true });
    } else {
      this.setState({ loading: true });
      if (ip.includes('wss://')) {
        ws = new WebSocket(ip);
      } else {
        ws = new WebSocket('ws://' + ip);
      }
      this.startConn();
    }
  };

  startConn = () => {
    //start handshake
    ws.onopen = e => {
      this.output('connected!');
      this.setState({ isConnected: true, loading: false });
    }; //on open event

    ws.onclose = () => {
      this.output('disconnected!');
      this.setState({ isConnected: false, loading: false });
      ws = null;
    }; //on close event

    ws.onmessage = msg => {
      if (msg.data !== undefined && msg.data !== '') {
        var data = msg.data.split('&');
        switch (data[0]) {
          case 'status':
            //toggleConn(lblConn, data[1]);
            this.setState({ isConnected: data[1] === 'ON' });
            break;
          default:
            if (data[1]) this.output(data[1]);
        }
      }
    };
    ws.onerror = () => {
      this.output('Connection Fail!');
      ws = null;
      this.setState({ isConnected: false, loading: false, open: true });
    }; //on error event
  };

  disconnect = () => {
    if (ws) {
      ws.close();
      ws = null;
    }

    this.setState({ isConnected: false, offline: false });
  };

  output = msg => {
    this.setState(state => ({
      output: (state.output ? state.output + '\n' : '') + msg
    }));
  };

  send = (type, actions) => {
    if (this.state.gameMode) {
      gc.dispatch(type, actions);
    } else if (ws !== null) {
      ws.send(type + '&' + actions.join('&')); //send method
    }
  };

  toggleFullScreen = () => {
    this.setState(state => ({ fullScreen: !state.fullScreen }));
  };

  toggleModal = () => {
    this.setState(state => ({ open: !state.open }));
  };

  toggleDrawer = () => {
    this.setState(state => ({ drawerOpen: !state.drawerOpen }));
  };

  toggleGame = bool => {
    if (this.state.gameMode !== bool) this.setState({ gameMode: bool });
  };

  adjustConfig = (name, value) => {
    config[name] = value;
    cookies.set(name, value);
  };

  landscapeHide = type => {
    const indicator = 'show' + type;
    return (
      <Grid
        item
        onClick={() => {
          this.setState(state => ({ [indicator]: !state[indicator] }));
        }}
        style={{
          boxShadow: 'inset 0 0 20px 0px lightgray',
          margin: '0 10px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ['margin' + type]: -20
        }}
      >
        {type === 'Left' ? (
          <React.Fragment>
            &nbsp;
            {this.state.showLeft ? <LeftArrow /> : <RightArrow />}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {this.state.showRight ? <RightArrow /> : <LeftArrow />}
            &nbsp;
          </React.Fragment>
        )}
      </Grid>
    );
  };

  render() {
    const {
      isLandscape,
      showLeft,
      showRight,
      output,
      isConnected,
      loading,
      open,
      offline,
      drawerOpen,
      fullScreen,
      gameMode
    } = this.state;
    return (
      <div className="App">
        <Grow in={offline || isConnected} mountOnEnter unmountOnExit>
          <Grid
            container
            direction={isLandscape ? 'row' : 'column'}
            alignItems="stretch"
            spacing={0}
            style={{ height: '100%' }}
          >
            {isLandscape && !fullScreen && this.landscapeHide('Left')}

            {(!isLandscape || showLeft) && (
              <Grid item xs={isLandscape}>
                <Header
                  isConnected={isConnected}
                  disconnect={this.disconnect}
                  toggleDrawer={this.toggleDrawer}
                />
                <ActionGroup
                  send={this.send}
                  output={this.output}
                  toggleDrawer={this.toggleDrawer}
                  drawerOpen={drawerOpen}
                  config={config}
                  adjustConfig={this.adjustConfig}
                  cookies={cookies}
                  toggleFullScreen={this.toggleFullScreen}
                  toggleGame={this.toggleGame}
                  gameMode={gameMode}
                />
                {gameMode ? (
                  <GameCanvas connector={gc} />
                ) : (
                  !fullScreen && (
                    <React.Fragment>
                      <Output output={output} />
                      <CmdInput send={this.send} output={this.output} />
                    </React.Fragment>
                  )
                )}
              </Grid>
            )}

            {(!isLandscape || showRight) && (
              <Grid item xs>
                <Controller send={this.send} config={config} />
              </Grid>
            )}

            {isLandscape && !fullScreen && this.landscapeHide('Right')}
          </Grid>
        </Grow>

        {!offline && !isConnected && (
          <Main
            makeConnection={this.makeConnection}
            loading={loading}
            cookies={cookies}
            isLandscape={isLandscape}
          />
        )}

        <MessageModal
          makeConnection={this.makeConnection}
          handleClose={this.toggleModal}
          open={open}
        />
      </div>
    );
  }
}

export default App;
