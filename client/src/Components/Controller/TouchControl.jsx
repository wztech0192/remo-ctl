import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { MDCRipple } from '@material/ripple';
import '@material/ripple/dist/mdc.ripple.css';

class TouchControl extends Component {
  componentDidMount() {
    const { mmbtn, mlbtn, mrbtn, mscroll } = this.refs;
    this.registerScrollEvent(mscroll);
    this.registerClickEvent(mlbtn, 'left');
    this.registerClickEvent(mrbtn, 'right');
    this.registerMainEvent(mmbtn);
  }

  registerScrollEvent(scroll) {
    let scrollY = null;
    scroll.addEventListener(
      'touchstart',
      e => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        scrollY = touch.pageY;
      },
      false
    );
    scroll.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const relY = Math.round(scrollY - touch.pageY);
        this.props.send(`mw&${relY}`);
        scrollY = touch.pageY;
      },
      false
    );
    scroll.addEventListener('touchend', e => e.preventDefault(), false);
  }

  registerClickEvent(btn, direction) {
    MDCRipple.attachTo(btn);
    btn.addEventListener(
      'touchstart',
      e => {
        e.preventDefault();
        this.props.send(`mc&${direction}`);
      },
      false
    );
    btn.addEventListener(
      'touchend',
      e => {
        e.preventDefault();
        this.props.send(`me&${direction}`);
      },
      false
    );
  }

  registerMainEvent(btn) {
    const point = {};
    let isTab = false;
    MDCRipple.attachTo(btn);
    const { moveBall, mmbtn, staticBall } = this.refs;
    const mouseMove = (e, isFirst) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const relX = touch.pageX - mmbtn.offsetLeft - 25;
      const relY = touch.pageY - mmbtn.offsetTop - 25;

      if (isFirst) {
        moveBall.style.display = 'block';
        staticBall.style.display = 'block';
        staticBall.style.marginLeft = relX + 'px';
        staticBall.style.marginTop = relY + 'px';
        point.x = relX;
        point.y = relY;
      }
      moveBall.style.marginLeft = relX + 'px';
      moveBall.style.marginTop = relY + 'px';
      const dx = relX - point.x;
      const dy = relY - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.ceil(dist / 6);
      let angle = Math.round((Math.atan2(dx, dy) * 180) / Math.PI - 90);
      if (angle < 0) {
        angle += 360;
      }
      this.props.send(`mm&${angle}&${speed}`);
    };

    btn.addEventListener(
      'touchstart',
      e => {
        e.preventDefault();
        mouseMove(e, true);
        isTab = false;
        setTimeout(() => {
          if (isTab) {
            this.props.send('mc&left');
            this.props.send('me&left');
          }
        }, 150);
      },
      false
    );

    btn.addEventListener('touchmove', mouseMove, false);

    btn.addEventListener(
      'touchend',
      e => {
        e.preventDefault();
        isTab = true;
        this.props.send('ms&');
        moveBall.style.display = 'none';
        staticBall.style.display = 'none';
      },
      false
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid item container xs={12} className={classes.mouseControl}>
        <Grid item xs={1} className={classes.mousescroll} ref="mscroll" />
        <Grid
          item
          xs={9}
          className={`${classes.mousemove} mdc-ripple-surface`}
          ref="mmbtn"
        >
          <div className={classes.moveball} ref="moveBall" />
          <div className={classes.staticball} ref="staticBall" />
        </Grid>
        <Grid item xs={2}>
          <Grid item xs={12} className={classes.mouseclick}>
            <div ref="mlbtn" className={`${classes.mcbtn} mdc-ripple-surface`}>
              LC
            </div>
          </Grid>
          <Grid item xs={12} className={classes.mouseclick}>
            <div ref="mrbtn" className={`${classes.mcbtn} mdc-ripple-surface`}>
              RC
            </div>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default TouchControl;
