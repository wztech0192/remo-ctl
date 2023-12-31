import React, { PureComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/lab/Slider';
import { cookies, config } from 'tools';

class ConfigSlider extends PureComponent {
  state = {
    mouseSpeed: config.mouseSpeed,
    scrollSpeed: config.scrollSpeed,
    motionSpeed: config.motionSpeed
  };

  adjustConfig = name => (e, value) => {
    config[name] = value;
    cookies.set(name, value);
    this.setState({ [name]: value });
  };

  render() {
    return (
      <List>
        <ListItem>
          <ListItemText secondary="Touch Sense" />
          <Slider
            value={this.state.mouseSpeed}
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
