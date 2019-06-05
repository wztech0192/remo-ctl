import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

export default ({ unconnect }) => (
  <div id="header">
    <Button style={{ color: 'green', paddingTop: 2 }}>Connected</Button>

    <IconButton style={{ float: 'right' }} size="small">
      <MenuIcon />
    </IconButton>
  </div>
);
