import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/lab/Slider';

class ConfigSlider extends Component {
  state = {
    mouseSpeed: this.props.config.mouseSpeed,
    scrollSpeed: this.props.config.scrollSpeed,
    motionSpeed: this.props.config.motionSpeed
  };

  adjustConfig = name => (e, value) => {
    this.props.adjustConfig(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const { classes } = this.props;
    return (
      <List>
        <ListItem>
          <ListItemText secondary="Touch Sense" />
          <Slider
            value={this.state.mouseSpeed}
            className={classes.slider}
            onChange={this.adjustConfig('mouseSpeed')}
            min={1}
            max={40}
            step={1}
          />
        </ListItem>
        <ListItem>
          <ListItemText secondary="Motion Sense" />
          <Slider
            value={this.state.motionSpeed}
            className={classes.slider}
            onChange={this.adjustConfig('motionSpeed')}
            min={1}
            max={40}
            step={1}
          />
        </ListItem>
        <ListItem>
          <ListItemText secondary="Scroll Sense" />
          <Slider
            value={this.state.scrollSpeed}
            className={classes.slider}
            onChange={this.adjustConfig('scrollSpeed')}
            min={1}
            max={40}
            step={1}
          />
        </ListItem>
      </List>
    );
  }
}

export default ConfigSlider;
