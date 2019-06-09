import React, { Component } from 'react';
import VisibileIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import WebIcon from '@material-ui/icons/Web';
import TwoIcon from '@material-ui/icons/LooksTwo';
import ThreeIcon from '@material-ui/icons/Looks3';
import OneIcon from '@material-ui/icons/LooksOne';
import EditActionModal from './EditActionModal';
import ActionButtons from './ActionButtons';
import ActionDrawer from './ActionDrawer';

let selectedBtn = {};

class ActionGroupIndex extends Component {
  getCustFunc = ({ cmd }) => {
    if (cmd !== 'n/a') {
      this.props.output(`***${cmd}***`);
      this.props.send('cmd&' + cmd);
    } else {
      this.props.output('***No Preset Command***');
    }
  };

  getCustCmd = (name, defaultCMD) => {
    let cmd = this.props.cookies.get(name);
    return cmd ? cmd : defaultCMD ? defaultCMD : 'n/a';
  };

  getCustTitle = (name, defaultTitle) => {
    let title = this.props.cookies.get(name);
    return title ? title : defaultTitle;
  };

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
      func: btn => {
        if (btn.isActive) {
          this.props.output('***Active Fullscreen***');
        } else {
          this.props.output('***Disable Fullscreen***');
        }
        btn.isActive = !btn.isActive;
        this.props.toggleFullScreen();
      },
      Icon: <FullscreenIcon />,
      isActive: false
    }
  ];

  custBtn = [
    {
      key: 'cus0',
      title: this.getCustTitle('cus0', 'Use Browser'),
      cmd: this.getCustCmd('cb0f', 'start www.google.com'),
      func: this.getCustFunc,
      Icon: <WebIcon />
    },
    {
      key: 'cus1',
      title: this.getCustTitle('cus1', 'Customize 1'),
      cmd: this.getCustCmd('cus1f'),
      func: this.getCustFunc,
      Icon: <OneIcon />
    },
    {
      key: 'cus2',
      title: this.getCustTitle('cus2', 'Customize 2'),
      cmd: this.getCustCmd('cus2f'),
      func: this.getCustFunc,
      Icon: <TwoIcon />
    },
    {
      key: 'cus3',
      title: this.getCustTitle('cus3', 'Customize 3'),
      cmd: this.getCustCmd('cus3f'),
      func: this.getCustFunc,
      Icon: <ThreeIcon />
    }
  ];

  state = {
    openEditModal: false
  };

  openEditModal = btn => {
    if (btn) selectedBtn = btn;
    this.setState({ openEditModal: true });
  };

  closeEditModal = () => {
    this.setState({ openEditModal: false });
  };

  handleCustChange = (title, cmd) => {
    selectedBtn.title = title;
    selectedBtn.cmd = cmd;
    this.props.cookies.set(selectedBtn.key, title);
    this.props.cookies.set(selectedBtn.key + 'f', cmd);
    this.setState({ openEditModal: false });
  };

  render() {
    return (
      <div>
        <ActionButtons funcBtn={this.funcBtn} custBtn={this.custBtn} />
        <ActionDrawer
          funcBtn={this.funcBtn}
          custBtn={this.custBtn}
          openEditModal={this.openEditModal}
          {...this.props}
        />

        <EditActionModal
          open={this.state.openEditModal}
          handleCustChange={this.handleCustChange}
          handleClose={this.closeEditModal}
          btn={selectedBtn}
        />
      </div>
    );
  }
}

export default ActionGroupIndex;
