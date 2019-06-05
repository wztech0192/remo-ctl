import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import LinkIcon from '@material-ui/icons/Link';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme =>
  console.log(theme) || {
    header: {
      marginTop: 40,
      fontStyle: 'italic',
      fontSize: 60
    },
    btn: {
      width: 150,
      height: 150,
      display: 'block',
      margin: '20vh auto auto auto'
    },
    textField: {
      maxWidth: 250,
      display: 'block',
      margin: '10vh auto'
    },
    fabProgress: {
      position: 'absolute',
      marginLeft: -110,
      marginTop: -45
    }
  };

class Main extends Component {
  state = {
    ip: this.getCookie('ip'),
    error: null
  };

  inputPrompt = e => {
    this.setState({
      ip: e.target.value
    });
  };

  makeConnection = () => {
    const { ip } = this.state;
    if (ip === '') {
      return this.setState({ error: 'Invalid IP Address' });
    }
    document.cookie = 'ip=' + ip + '; path=/';

    this.props.makeConnection(ip);
  };

  getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
  }

  render() {
    const { classes, loading } = this.props;
    return (
      <React.Fragment>
        <Typography variant="h3" align="center" className={classes.header}>
          Remo CRT
        </Typography>
        <TextField
          align="center"
          label="Enter You IP Address"
          error={!!this.state.error}
          onFocus={() => this.setState({ error: false })}
          helperText={this.state.error}
          className={classes.textField}
          value={this.state.ip}
          onChange={this.inputPrompt}
          margin="normal"
          fullWidth
        />
        <Fab
          color="primary"
          size="large"
          className={classes.btn}
          onClick={this.makeConnection}
        >
          <LinkIcon style={{ fontSize: 60 }} />
          {loading && (
            <CircularProgress size={160} className={classes.fabProgress} />
          )}
        </Fab>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Main);
