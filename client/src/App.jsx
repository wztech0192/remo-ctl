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

const port = ':1998/';
let ws = null;

class App extends Component {
  state = {
    isConnected: false,
    loading: false,
    open: false,
    showLeft: true,
    showRight: true,
    isLandscape: window.orientation === 90
  };

  componentDidMount() {
    window.addEventListener('orientationchange', () => {
      this.setState({ isLandscape: window.orientation === 90 });
    });
  }

  makeConnection = ip => {
    this.setState({ loading: true });
    ws = new WebSocket('ws://' + ip + port);
    this.startConn();
  };

  startConn = () => {
    //start handshake
    ws.onopen = e => {
      this.output('connected!');

      this.setState({ isConnected: true, loading: false });
    }; //on open event

    ws.onclose = () => {
      this.output('disconnected!');
      console.log('disconnected');
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

  output = msg => {
    this.setState(state => ({
      output: (state.output ? state.output + '\n' : '') + msg
    }));
  };

  toggleModal = () => {
    this.setState(state => ({ open: !state.open }));
  };

  send = data => {
    if (ws !== null) {
      ws.send(data); //send method
    }
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
    return (
      <div className="App">
        {this.state.isConnected ? (
          <Grow in={true} mountOnEnter unmountOnExit>
            <Grid
              container
              direction={this.state.isLandscape ? 'row' : 'column'}
              alignItems="stretch"
              spacing={0}
              style={{ height: '100%' }}
            >
              {this.state.isLandscape && this.landscapeHide('Left')}

              {(!this.state.isLandscape || this.state.showLeft) && (
                <Grid item xs={this.state.isLandscape}>
                  <Header isConnected={this.state.isConnected} />
                  <Output output={this.state.output} />
                  <ActionGroup send={this.send} output={this.output} />
                  <CmdInput send={this.send} output={this.output} />
                </Grid>
              )}

              {(!this.state.isLandscape || this.state.showRight) && (
                <Grid item xs>
                  <Controller send={this.send} />
                </Grid>
              )}

              {this.state.isLandscape && this.landscapeHide('Right')}
            </Grid>
          </Grow>
        ) : (
          <Main
            makeConnection={this.makeConnection}
            loading={this.state.loading}
          />
        )}
        <MessageModal handleClose={this.toggleModal} open={this.state.open} />
      </div>
    );
  }
}

export default App;
