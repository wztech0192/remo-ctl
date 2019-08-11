import React, { PureComponent } from 'react';
import VisibileIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import WebIcon from '@material-ui/icons/Web';
import TwoIcon from '@material-ui/icons/LooksTwo';
import ThreeIcon from '@material-ui/icons/Looks3';
import OneIcon from '@material-ui/icons/LooksOne';
import EditActionModal from './EditActionModal';
import ActionButtons from './ActionButtons';
import ActionItems from './ActionItems';
import Drawer from '@material-ui/core/Drawer';
import { connect } from 'react-redux';
import { output, send } from 'store/actions/connAction';
import {
  toggleGame,
  toggleDrawer,
  toggleFullScreen
} from 'store/actions/appAction';
import { cookies } from 'tools';

const mapStateToProps = ({ app }) => ({
  game: app.game,
  drawerOpen: app.drawerOpen
});

const mapDispatchToProps = {
  output,
  send,
  toggleGame,
  toggleDrawer,
  toggleFullScreen
};

let selectedBtn = {};

class ActionGroupIndex extends PureComponent {
  getCustFunc = ({ cmd }) => {
    if (cmd !== 'n/a') {
      this.props.output(`***${cmd}***`);
      this.props.send('cmd', [cmd]);
    } else {
      this.props.output('***No Preset Command***');
    }
  };

  getCustCmd = (name, defaultCMD) => {
    let cmd = cookies.get(name);
    return cmd ? cmd : defaultCMD ? defaultCMD : 'n/a';
  };

  getCustTitle = (name, defaultTitle) => {
    let title = cookies.get(name);
    return title ? title : defaultTitle;
  };

  toggleFuncBtnActive = btn => {
    this.setState(state => ({
      funcBtn: state.funcBtn.map(val => {
        if (val === btn) {
          return {
            ...val,
            isActive: !btn.isActive
          };
        }
        return val;
      })
    }));
  };

  state = {
    funcBtn: [
      {
        title: 'Toggle Console Window',
        func: btn => {
          this.toggleFuncBtnActive(btn);
          if (!btn.isActive) {
            this.props.output('***Display Console Window***');
          } else {
            this.props.output('***Hide Console Window***');
          }
          this.props.send('cmd', ['TOGGLE']);
        },

        Icon: <VisibileIcon />,
        isActive: true
      },
      {
        title: 'Lock/Unlock',
        func: btn => {
          this.toggleFuncBtnActive(btn);
          if (!btn.isActive) {
            this.props.output('***Lock Target Mouse***');
          } else {
            this.props.output('***Unlock Target Mouse***');
          }
          this.props.send('cmd', ['LOCK']);
        },
        Icon: <LockIcon />,
        isActive: false
      },
      {
        title: 'Fullscreen Controller',
        func: btn => {
          this.toggleFuncBtnActive(btn);
          if (!btn.isActive) {
            this.props.output('***Active Fullscreen***');
          } else {
            this.props.output('***Disable Fullscreen***');
          }
          this.props.toggleFullScreen();
        },
        Icon: <FullscreenIcon />,
        isActive: false
      }
    ],
    custBtn: [
      {
        key: 'cus0',
        title: this.getCustTitle('cus0', 'Use Browser'),
        cmd: this.getCustCmd('cus0f', 'start www.google.com'),
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
    ],

    openEditModal: false
  };

  openEditModal = btn => () => {
    if (btn) selectedBtn = btn;
    this.setState({ openEditModal: true });
  };

  closeEditModal = () => {
    selectedBtn = null;
    this.setState({ openEditModal: false });
  };

  handleCustChange = (title, cmd) => {
    cookies.set(selectedBtn.key, title);
    cookies.set(selectedBtn.key + 'f', cmd);
    this.setState(state => ({
      openEditModal: false,
      custBtn: state.custBtn.map(btn => {
        if (btn === selectedBtn) {
          return {
            ...btn,
            title,
            cmd
          };
        }
        return btn;
      })
    }));
  };

  handleReleaseTarget = () => {
    this.props.send('cmd', ['EXIT']);
  };

  render() {
    return (
      <div>
        <ActionButtons
          funcBtn={this.state.funcBtn}
          custBtn={this.state.custBtn}
        />
        <Drawer
          open={this.props.drawerOpen}
          onClose={this.props.toggleDrawer}
          anchor="bottom"
        >
          <ActionItems
            funcBtn={this.state.funcBtn}
            custBtn={this.state.custBtn}
            openEditModal={this.openEditModal}
            handleReleaseTarget={this.handleReleaseTarget}
            game={this.props.game}
            toggleGame={this.props.toggleGame}
          />
        </Drawer>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionGroupIndex);
