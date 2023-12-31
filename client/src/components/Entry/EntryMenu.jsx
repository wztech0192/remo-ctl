import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import OfflineIcon from '@material-ui/icons/WifiOff';
import RemoteIcon from '@material-ui/icons/NaturePeople';
import GuideIcon from '@material-ui/icons/Help';

export default ({ anchorEl, openMenu, onCloseMenu }) => (
  <Menu
    anchorEl={anchorEl}
    open={openMenu}
    onClose={onCloseMenu}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
  >
    <MenuItem onClick={onCloseMenu}>
      <ListItemIcon>
        <OfflineIcon />
      </ListItemIcon>
      <Typography variant="inherit">Offline Mode</Typography>
    </MenuItem>
    <MenuItem onClick={onCloseMenu}>
      <ListItemIcon>
        <RemoteIcon />
      </ListItemIcon>
      <Typography variant="inherit">Remote Control</Typography>
    </MenuItem>
    <Divider />
    <MenuItem
      onClick={onCloseMenu}
      component="a"
      href="https://github.com/weijie0192/remo-ctl/blob/master/README.md"
      target="_blank"
    >
      <ListItemIcon>
        <GuideIcon />
      </ListItemIcon>
      <Typography variant="inherit">User Guide</Typography>
    </MenuItem>
  </Menu>
);
