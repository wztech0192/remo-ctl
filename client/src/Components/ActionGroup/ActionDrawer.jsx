import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GameIcon from '@material-ui/icons/VideogameAsset';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import ConfigSlider from './ConfigSlider';
import FuncIcon from '@material-ui/icons/Widgets';
import CustIcon from '@material-ui/icons/Apps';

const styles = theme => ({
  slider: {},
  releaseTarget: {
    float: 'right'
  },
  container: {
    maxHeight: '80vh',
    overflowX: 'hidden'
  },
  selected: {
    '& div': {
      color: theme.palette.primary.main
    }
  }
});

class ActionDrawer extends Component {
  state = {
    openFuncList: false,
    openCustList: false
  };

  handleCollapse = type => e => {
    this.setState(state => ({ [type]: !state[type] }));
  };

  render() {
    const {
      funcBtn,
      custBtn,
      toggleDrawer,
      drawerOpen,
      classes,
      openEditModal,
      send,
      toggleGame,
      gameMode
    } = this.props;
    return (
      <Drawer open={drawerOpen} onClose={toggleDrawer} anchor="bottom">
        <div className={classes.container}>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                toggleGame(false);
              }}
              className={!gameMode ? classes.selected : ''}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              className={gameMode ? classes.selected : ''}
              onClick={() => {
                toggleGame(true);
              }}
            >
              <ListItemIcon>
                <GameIcon />
              </ListItemIcon>
              <ListItemText primary="Game Page" />
            </ListItem>
          </List>

          <Divider />
          <ListItem button onClick={this.handleCollapse('openFuncList')}>
            <ListItemIcon>
              <FuncIcon />
            </ListItemIcon>
            <ListItemText primary="Functional Actions" />
            {this.state.openFuncList ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.openFuncList} timeout="auto" unmountOnExit>
            <List>
              {funcBtn.map(btn => (
                <ListItem
                  className={btn.isActive ? classes.selected : ''}
                  key={btn.title}
                  button
                  onClick={() => btn.func(btn)}
                >
                  <ListItemIcon>{btn.Icon}</ListItemIcon>
                  <ListItemText primary={btn.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <ListItem button onClick={this.handleCollapse('openCustList')}>
            <ListItemIcon>
              <CustIcon />
            </ListItemIcon>
            <ListItemText primary="Customize Actions" />
            {this.state.openCustList ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.openCustList} timeout="auto" unmountOnExit>
            <List>
              {custBtn.map(btn => (
                <ListItem key={btn.title} button onClick={() => btn.func(btn)}>
                  <ListItemIcon>{btn.Icon}</ListItemIcon>
                  <ListItemText primary={btn.title} />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={() => openEditModal(btn)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Collapse>
          <ConfigSlider {...this.props} />
          <Divider />

          <Button
            color="secondary"
            onClick={() => {
              send('cmd', ['EXIT']);
            }}
            fullWidth
            className={classes.releaseTarget}
          >
            Release Target
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(ActionDrawer);
