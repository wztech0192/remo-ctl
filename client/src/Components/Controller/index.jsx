import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Textfield from '@material-ui/core/Textfield';
import TouchControl from './TouchControl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MotionIcon from '@material-ui/icons/ScreenRotation';
import TouchIcon from '@material-ui/icons/TouchApp';

const styles = theme => ({
  container: {
    height: 'calc(100% - 50px)'
  },
  mouseControl: {
    height: 'calc(100% - 30px)'
  },
  keyboard: {
    height: 30,
    width: '100%',
    textAlign: 'center'
  },
  mouseclick: {
    height: '50%'
  },
  mcbtn: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 10px 0px lightgray',
    userSelect: 'none'
  },

  mousemove: {
    boxShadow: 'inset 0 0 30px 0px lightgray'
  },

  mousescroll: {
    boxShadow: 'inset -2px 0 10px 1px lightgray',
    borderRadius: '25px 0 0 25px'
  },
  moveball: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '100%',
    boxShadow: 'inset 0 0 10px 0 black',
    display: 'none'
  },
  staticball: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '100%',
    boxShadow: ' 0 0 30px 0 black',
    display: 'none'
  }
});

class ControllerIndex extends Component {
  state = {
    mode: 0
  };

  handleModeChange = (event, newValue) => {
    this.setState({ mode: newValue });
  };

  keyboard = e => {
    var key;
    switch (e.keyCode) {
      case 13:
        key = '{ENTER}';
        break;
      case 8:
        key = '{BACKSPACE}';
        break;
      case 27:
        key = '{ESC}';
        break;
      default:
        key = this.value;
    }
    this.value = '';
    this.props.send('ky&' + key);
  };

  render() {
    const { classes, send } = this.props;

    return (
      <div className={classes.container}>
        <Tabs
          variant="fullWidth"
          textColor="primary"
          value={this.state.mode}
          onChange={this.handleModeChange}
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <Tab
            label={
              <span>
                <TouchIcon style={{ verticalAlign: 'sub' }} />
                &nbsp; Touch
              </span>
            }
          />
          <Tab
            label={
              <span>
                <MotionIcon style={{ verticalAlign: 'bottom' }} />
                &nbsp; Motion
              </span>
            }
          />
        </Tabs>
        <TouchControl classes={classes} send={send} />
        <Textfield
          className={classes.keyboard}
          placeholder="Keyboard"
          value=""
          onKeyUp={this.keyboard}
          inputProps={{ style: { textAlign: 'center' } }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ControllerIndex);
