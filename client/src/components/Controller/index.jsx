import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Textfield from '@material-ui/core/Textfield';
import TouchEvent from './TouchEvent';
import MotionEvent from './MotionEvent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MotionIcon from '@material-ui/icons/ScreenRotation';
import TouchIcon from '@material-ui/icons/TouchApp';
import Grid from '@material-ui/core/Grid';
import styles from './ControllerStyle';
import '@material/ripple/dist/mdc.ripple.css';
import { connect } from 'react-redux';
import { send } from 'store/actions/connAction';
import { config } from 'tools';
import Typography from '@material-ui/core/Typography';

const mapDispatchToProps = { send };

class ControllerIndex extends PureComponent {
  allRefs = {
    mmbtn: React.createRef(),
    mscroll: React.createRef(),
    mlbtn: React.createRef(),
    mrbtn: React.createRef(),
    moveBall: React.createRef(),
    staticBall: React.createRef()
  };

  state = {
    mode: 0
  };

  handleModeChange = (event, newValue) => {
    this.setState({ mode: newValue });
  };

  keyboard = e => {
    var key;
    if (e.key.length === 1) {
      key = e.key;
    } else {
      key = `{${e.key.toUpperCase()}}`;
    }
    this.props.send('ky', [key]);
  };

  render() {
    const { classes, send } = this.props;
    const allRefs = this.allRefs;

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
        <Grid item container xs={12} className={classes.mouseControl}>
          <Grid
            item
            xs={1}
            className={classes.mousescroll}
            ref={allRefs.mscroll}
          />
          <Grid
            item
            xs={9}
            className={`${classes.mousemove} mdc-ripple-surface`}
            ref={allRefs.mmbtn}
          >
            <div className={classes.moveball} ref={allRefs.moveBall} />
            <div className={classes.staticball} ref={allRefs.staticBall} />
          </Grid>
          <Grid item xs={2}>
            <Grid item xs={12} className={classes.mouseclick}>
              <div
                ref={allRefs.mlbtn}
                className={`${classes.mcbtn} mdc-ripple-surface`}
                data-mdc-ripple-is-bounded
              >
                <Typography color="textSecondary">LC</Typography>
              </div>
            </Grid>
            <Grid item xs={12} className={classes.mouseclick}>
              <div
                ref={allRefs.mrbtn}
                className={`${classes.mcbtn} mdc-ripple-surface`}
                data-mdc-ripple-is-bounded
              >
                <Typography color="textSecondary">RC</Typography>
              </div>
            </Grid>
          </Grid>
        </Grid>

        {this.state.mode === 0 ? (
          <TouchEvent allRefs={allRefs} send={send} config={config} />
        ) : (
          <MotionEvent allRefs={allRefs} send={send} config={config} />
        )}
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

export default connect(
  false,
  mapDispatchToProps
)(withStyles(styles)(ControllerIndex));
