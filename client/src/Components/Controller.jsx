import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Textfield from '@material-ui/core/Textfield';

const styles = theme => ({
  container: {
    height: 'calc(100% - 30px)',
    paddingTop: 30
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
    height: '50%',
    textAlign: 'center'
  },
  mcbtn: {
    width: '100%',
    height: '100%'
  },
  mousemove: {
    borderRight: '1px solid lightgray',
    borderLeft: '1px solid lightgray',
    borderRadius: '0 25px 25px 0',
    boxShadow: 'inset 0 0 50px 0px lightgray'
  },
  mousescroll: {
    boxShadow: 'inset 0 0 10px 1px lightgray'
  }
});

class Controller extends Component {
  mousemove(e) {
    console.log('hye');
  }
  mouseend(e) {
    console.log('hye');
  }
  mousestart(e) {
    console.log('hye');
  }

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
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Grid item container xs={12} className={classes.mouseControl}>
          <Grid item xs={1} className={classes.mousescroll} />
          <Grid
            item
            xs={9}
            className={classes.mousemove}
            component={Button}
            onTouchEnd={this.mouseend}
            onTouchMove={this.mousemove}
            onTouchStart={this.mousestart}
          >
            {''}
          </Grid>
          <Grid item xs={2}>
            <Grid
              item
              xs={12}
              className={classes.mouseclick}
              style={{
                borderBottom: '1px solid lightgray',
                borderEndStartRadius: 25
              }}
            >
              <Button
                style={{
                  borderRadius: '25px 0 0 0'
                }}
                className={classes.mcbtn}
              >
                LC
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.mouseclick}>
              <Button
                style={{
                  borderRadius: '0 0 0 25px'
                }}
                className={classes.mcbtn}
              >
                RC
              </Button>
            </Grid>
          </Grid>
        </Grid>
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

export default withStyles(styles)(Controller);
