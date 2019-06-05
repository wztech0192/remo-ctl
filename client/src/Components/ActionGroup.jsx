import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import VisibileIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import Tooltip from '@material-ui/core/Tooltip';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import WebIcon from '@material-ui/icons/Web';
import TwoIcon from '@material-ui/icons/LooksTwo';
import ThreeIcon from '@material-ui/icons/Looks3';
import OneIcon from '@material-ui/icons/LooksOne';

class ActionGroup extends Component {
  funcBtn = [
    {
      title: 'Toggle Console Window',
      func: btn => {
        if (btn.isActive) {
          this.props.output('***Display Console Window***');
        } else {
          this.props.output('***Hide Console Window***');
        }
        btn.isActive = !btn.isActive;
        this.props.send('cmd&TOGGLE');
      },
      Icon: <VisibileIcon />,
      isActive: true
    },
    {
      title: 'Lock/Unlock',
      func: btn => {
        if (btn.isActive) {
          this.props.output('***Lock Target Mouse***');
        } else {
          this.props.output('***Unlock Target Mouse***');
        }
        btn.isActive = !btn.isActive;
        this.props.send('cmd&LOCK');
      },
      Icon: <LockIcon />,
      isActive: false
    },
    {
      title: 'Fullscreen Controller',
      func: null,
      Icon: <FullscreenIcon />,
      isActive: false
    }
  ];

  custBtn = [
    {
      title: 'Use Browser',
      func: null,
      Icon: <WebIcon />
    },
    {
      title: 'Customize 1',
      func: null,
      Icon: <OneIcon />
    },
    {
      title: 'Customize 2',
      func: null,
      Icon: <TwoIcon />
    },
    {
      title: 'Customize 3',
      func: null,
      Icon: <ThreeIcon />
    }
  ];

  render() {
    return (
      <div>
        {this.funcBtn.map(btn => (
          <Tooltip
            key={btn.title}
            disableFocusListener
            disableTouchListener
            title={btn.title}
            placement="top"
            onClick={() => btn.func(btn)}
            color={btn.isActive ? 'primary' : 'default'}
          >
            <IconButton>{btn.Icon}</IconButton>
          </Tooltip>
        ))}

        <div style={{ float: 'right' }}>
          {this.custBtn.map(btn => (
            <Tooltip
              key={btn.title}
              disableFocusListener
              disableTouchListener
              title={btn.title}
            >
              <IconButton>{btn.Icon}</IconButton>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }
}

export default ActionGroup;
