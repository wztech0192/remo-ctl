import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';

export default ({ isConnected, disconnect, toggleDrawer }) => (
  <div id="header">
    <Button
      style={{ color: isConnected ? '#009ba0' : 'rgba(0, 0, 0, 0.54)' }}
      onClick={disconnect}
    >
      <HomeIcon />
      &nbsp;
      {isConnected ? 'Connected' : 'Offline'}
    </Button>

    <IconButton style={{ float: 'right' }} size="small" onClick={toggleDrawer}>
      <MenuIcon />
    </IconButton>
  </div>
);
