import React, { Component } from 'react';
import Main from './Components/Main';
import MessageModal from './Components/MessageModal';
import Header from './Components/Header';
import Output from './Components/Output';
import CmdInput from './Components/CmdInput';
import ActionGroup from './Components/ActionGroup';
import Grow from '@material-ui/core/Grow';
import Controller from './Components/Controller';

const port = ':1998/';
let ws = null;

class App extends Component {
  state = {
    isConnected: false,
    loading: false,
    open: false
  };

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
          case 'cmd':
          case 'b':
            if (data[1]) this.output(data[1]);
            break;
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
    console.log(this.state.output);
  };

  toggleModal = () => {
    this.setState(state => ({ open: !state.open }));
  };

  send = data => {
    if (ws !== null) {
      ws.send(data); //send method
    }
  };

  render() {
    return (
      <div className="App">
        {this.state.isConnected ? (
          <Grow in={true} mountOnEnter unmountOnExit>
            <div className="box">
              <div className="row header">
                <Header isConnected={this.state.isConnected} />
                <Output output={this.state.output} />
                <ActionGroup send={this.send} output={this.output} />
                <CmdInput send={this.send} output={this.output} />
              </div>
              <div className="row content">
                <Controller send={this.send} />
              </div>
            </div>
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
