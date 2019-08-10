import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import { disconnect } from 'store/actions/connAction';
import { toggleDrawer } from 'store/actions/appAction';

const mapStateToProps = state => ({
  isConnected: state.conn.isConnected
});

const mapDispatchToProps = {
  disconnect,
  toggleDrawer
};

export class Header extends PureComponent {
  render() {
    const { isConnected, disconnect, toggleDrawer } = this.props;
    return (
      <div id="header">
        <Button
          style={{ color: isConnected ? '#009ba0' : 'rgba(0, 0, 0, 0.54)' }}
          onClick={disconnect}
        >
          <HomeIcon />
          &nbsp;
          {isConnected ? 'Connected' : 'Offline'}
        </Button>

        <IconButton
          style={{ float: 'right' }}
          size="small"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
