import { Component } from 'react';
import { MDCRipple } from '@material/ripple';
const eventStructure = [];
let oldRefs = null;

class TouchEvent extends Component {
  componentWillUnmount() {
    this.unregisterAllEvent();
  }

  componentDidMount() {
    if (oldRefs !== this.props.allRefs || eventStructure.length <= 0) {
      //construct eventStructure
      const { mmbtn, mlbtn, mrbtn, mscroll } = this.props.allRefs;
      oldRefs = this.props.allRefs;
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
  }

  unregisterAllEvent() {
    eventStructure.forEach(({ el, eventList }) => {
      for (let key in eventList) {
        el.removeEventListener(key, eventList[key], false);
      }
    });
  }

  constructScrollEvent(scroll) {
    let scrollY = null;
    const { send, config } = this.props;
    eventStructure.push({
      el: scroll,
      eventList: {
        touchstart: e => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          scrollY = touch.pageY;
        },
        touchmove: e => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          const relY = Math.round((scrollY - touch.pageY) * config.scrollSpeed);
          if (relY !== 0) send(`mw&${relY}`);
          scrollY = touch.pageY;
        },
        touchend: e => {
          e.preventDefault();
        }
      }
    });
  }

  constructClickEvent(btn, direction) {
    MDCRipple.attachTo(btn);
    const { send } = this.props;
    eventStructure.push({
      el: btn,
      eventList: {
        touchstart: e => {
          e.preventDefault();
          send(`mc&${direction}`);
        },
        touchend: e => {
          e.preventDefault();
          send(`me&${direction}`);
        }
      }
    });
  }

  constructMainEvent(btn) {
    MDCRipple.attachTo(btn);
    const point = {};
    let isTap = false;
    const { config, send, allRefs } = this.props;
    const { moveBall, mmbtn, staticBall } = allRefs;

    const mouseMove = (e, isFirst) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const relX = touch.pageX - mmbtn.current.offsetLeft - 25;
      const relY = touch.pageY - mmbtn.current.offsetTop - 25;
      if (isFirst) {
        moveBall.current.style.display = 'block';
        staticBall.current.style.display = 'block';
        staticBall.current.style.marginLeft = relX + 'px';
        staticBall.current.style.marginTop = relY + 'px';
        point.x = relX;
        point.y = relY;
      } else {
        const dx = Math.round((relX - point.x) * config.mouseSpeed);
        const dy = Math.round((relY - point.y) * config.mouseSpeed);
        send(`mm&${dx}&${dy}`);
        point.x = relX;
        point.y = relY;
      }
      moveBall.current.style.marginLeft = relX + 'px';
      moveBall.current.style.marginTop = relY + 'px';
    };

    eventStructure.push({
      el: btn,
      eventList: {
        touchstart: e => {
          e.preventDefault();
          mouseMove(e, true);
          isTap = false;
          setTimeout(() => {
            if (isTap) {
              send('mc&left');
              send('me&left');
            }
          }, 150);
        },
        touchmove: mouseMove,
        touchend: e => {
          e.preventDefault();
          isTap = true;
          send('ms&');
          moveBall.current.style.display = 'none';
          staticBall.current.style.display = 'none';
        }
      }
    });
  }

  render() {
    return null;
  }
}

export default TouchEvent;
