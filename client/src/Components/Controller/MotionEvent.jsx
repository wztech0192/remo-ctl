import { Component } from 'react';
import { MDCRipple } from '@material/ripple';

const eventStructure = [];
let oldRefs = null;
let motionStart = false;
let relX, relY;
let active = false;

class TouchEvent extends Component {
  componentWillUnmount() {
    this.unregisterAllEvent();
  }

  componentDidMount() {
    if (oldRefs !== this.props.allRefs || eventStructure.length <= 0) {
      //construct eventStructure
      const { mmbtn, mlbtn, mrbtn, mscroll } = this.props.allRefs;
      oldRefs = this.props.allRefs;
      this.constructMotionEvent();
      this.constructScrollEvent(mscroll.current);
      this.constructClickEvent(mlbtn.current, 'left');
      this.constructClickEvent(mrbtn.current, 'right');
      this.constructMainEvent(mmbtn.current);
    }
    this.registerAllEvent();
  }

  registerAllEvent() {
    eventStructure.forEach(({ el, eventList }) => {
      for (let key in eventList) {
        el.addEventListener(key, eventList[key], false);
      }
    });
    //check if user has active the sensor
    setTimeout(() => {
      if (!active) {
        alert(
          'Motion Sensor Is Not Responding.\n' +
            '--------------------\n' +
            'To enable motion sensor:\n' +
            '* Use https instead of http\n' +
            "* Enable 'Motion/Orientation' setting in browser"
        );
      }
    }, 150);
  }

  unregisterAllEvent() {
    eventStructure.forEach(({ el, eventList }) => {
      for (let key in eventList) {
        el.removeEventListener(key, eventList[key], false);
      }
    });
    active = false;
  }

  constructScrollEvent(scroll) {
    let scrollY = null;
    const { config, send } = this.props;
    eventStructure.push({
      el: scroll,
      eventList: {
        touchstart: e => {
          e.preventDefault();
          motionStart = true;
          const touch = e.changedTouches[0];
          scrollY = touch.pageY;
        },
        touchmove: e => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          const relY = Math.round(scrollY - touch.pageY) * config.scrollSpeed;
          if (relY !== 0) send('mw', [relY]);
          scrollY = touch.pageY;
        },
        touchend: e => {
          e.preventDefault();
          motionStart = false;
        }
      }
    });
  }

  constructMotionEvent() {
    let bet, alp;
    const { config, send, allRefs } = this.props;
    const { moveBall } = allRefs;
    eventStructure.push({
      el: window,
      eventList: {
        deviceorientation: e => {
          if (!active && e.alpha) {
            active = true;
          }
          var alpha = e.alpha > 180 ? e.alpha - 360 : e.alpha;
          if (motionStart) {
            var deltaX = alp - alpha;
            var deltaY = bet - e.beta;
            deltaX =
              deltaX < -0.05 || deltaX > 0.05
                ? Math.round(deltaX * config.motionSpeed)
                : 0;
            deltaY =
              deltaY < -0.05 || deltaY > 0.05
                ? Math.round(deltaY * config.motionSpeed)
                : 0;
            if (deltaX !== 0 && deltaX !== 0) {
              send('mm', [deltaX, deltaY]);
              relX += deltaX / 2;
              relY += deltaY / 2;
              moveBall.current.style.marginLeft = relX + 'px';
              moveBall.current.style.marginTop = relY + 'px';
            }
          }
          bet = e.beta;
          alp = alpha;
        }
      }
    });
  }

  constructClickEvent(btn, direction) {
    const { send } = this.props;
    MDCRipple.attachTo(btn);
    eventStructure.push({
      el: btn,
      eventList: {
        touchstart: e => {
          e.preventDefault();
          motionStart = true;
          send('mc', [direction]);
        },
        touchend: e => {
          e.preventDefault();
          motionStart = false;
          send('me', [direction]);
        }
      }
    });
  }

  constructMainEvent(btn) {
    let isTap = false;
    MDCRipple.attachTo(btn);
    const { send, allRefs } = this.props;
    const { moveBall, mmbtn, staticBall } = allRefs;
    eventStructure.push({
      el: btn,
      eventList: {
        touchstart: e => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          relX = touch.pageX - mmbtn.current.offsetLeft - 25;
          relY = touch.pageY - mmbtn.current.offsetTop - 25;
          moveBall.current.style.display = 'block';
          staticBall.current.style.display = 'block';
          staticBall.current.style.marginLeft = relX + 'px';
          staticBall.current.style.marginTop = relY + 'px';
          moveBall.current.style.marginLeft = relX + 'px';
          moveBall.current.style.marginTop = relY + 'px';
          motionStart = true;
          isTap = false;
          setTimeout(() => {
            if (isTap) {
              send('mc', ['left']);
              send('me', ['left']);
            }
          }, 150);
        },
        touchend: e => {
          e.preventDefault();
          moveBall.current.style.display = 'none';
          staticBall.current.style.display = 'none';
          isTap = true;
          motionStart = false;
        }
      }
    });
  }

  render() {
    return null;
  }
}

export default TouchEvent;
