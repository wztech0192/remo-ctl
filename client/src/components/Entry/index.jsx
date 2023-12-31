import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import logo from 'static/favicon.ico';
import Link from '@material-ui/core/Link';
import { cookies } from 'tools';
import { makeConnection } from 'store/actions/connAction';
import { connect } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EntryMenu from './EntryMenu';
import RemoExe from '../../static/RemoConn.exe'

const mapStateToProps = state => ({
  loading: state.conn.loading,
  isLandscape: state.app.isLandscape
});

const mapDispatchToProps = { makeConnection };

class Entry extends PureComponent {
  state = {
    ip: new URLSearchParams( window.location.search).get("ip") || cookies.get('ip') || '',
    error: null,
    anchorEl: null,
    openMenu: false
  };

  onOpenMenu = e => {
    this.setState({ anchorEl: e.target, openMenu: true });
  };
  onCloseMenu = e => {
    switch (e.target.textContent) {
      case 'Offline Mode':
        this.props.makeConnection('offline');
        break;
      case 'Remote Control':
        if (window.location.protocol === 'https:') {
          this.props.makeConnection('wss://142.11.215.231:1998', true);
        } else {
          this.props.makeConnection('142.11.215.231:1998', true);
        }
        break;
      default:
    }
    this.setState({ anchorEl: null, openMenu: false });
  };

  inputPrompt = e => {
    this.setState({
      ip: e.target.value
    });
  };

  makeConnection = () => {
    const { ip } = this.state;
    if (ip === '') {
      return this.setState({
        error: 'IP cannot be empty. Enter "Offline" to go offline mode'
      });
    }
    cookies.set('ip', ip);
    this.props.makeConnection(ip);
  };

  clearError = () => this.setState({ error: false });

  adornment = {
    endAdornment: (
      <InputAdornment position="end">
        <Tooltip title="More Action" placement="top">
          <IconButton size="small" onClick={this.onOpenMenu}>
            <InputIcon />
          </IconButton>
        </Tooltip>
      </InputAdornment>
    )
  };

  render() {
    const { classes, loading, isLandscape } = this.props;
    return (
      <Fade in={true} mountOnEnter unmountOnExit>
        <div className={classes.container}>
          <Typography
            variant="h3"
            align="center"
            className={classes.header}
            color="primary"
          >
            <span>
              Rem
              <Avatar
                component="span"
                alt="Remo Logo"
                src={logo}
                className={classes.avatar}
              />
            </span>
          </Typography>
          <TextField
            align="center"
            label="Enter You IP Address"
            error={!!this.state.error}
            onFocus={this.clearError}
            helperText={this.state.error}
            className={classes.textField}
            value={this.state.ip}
            onChange={this.inputPrompt}
            fullWidth
            InputProps={this.adornment}
          />
          <EntryMenu
            openMenu={this.state.openMenu}
            anchorEl={this.state.anchorEl}
            onCloseMenu={this.onCloseMenu}
          />

          {!isLandscape && (
            <div className={classes.progressContainer}>
              {loading && (
                <CircularProgress size={80} className={classes.fabProgress} />
              )}
            </div>
          )}

          <Fab
            size="large"
            color="primary"
            variant="extended"
            className={classes.btn}
            onClick={this.makeConnection}
          >
            {loading ? 'Cancel Connection' : 'Connect'}
          </Fab>
          <br />
          <Link href={RemoExe} download className={classes.link}>
            Download Connector
          </Link>
          <Typography
            align="center"
            variant="caption"
            display="block"
            className={classes.footer}
          >
            <i>Copyright &copy; 2019 Wei J. Zheng. All rights reserved.</i>
          </Typography>
        </div>
      </Fade>
    );
  }
}

const styles = () => ({
  container: {
    position: 'relative',
    padding: '5vh 0',
    height: 'calc(100% - 10vh)'
  },
  link: {
    display: 'block',
    textAlign: 'center',
    fontSize: 14
  },
  avatar: {
    display: 'inline-block',
    width: 90,
    height: 90,
    verticalAlign: 'bottom'
  },
  header: {
    fontStyle: 'italic',
    fontWeight: 'bold',

    fontSize: 76
  },
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    margin: 0,
    padding: 0
  },
  btn: {
    width: 250,
    display: 'block',
    margin: '12vh auto auto auto'
  },
  textField: {
    maxWidth: 250,
    display: 'block',
    margin: '8vh auto',
    height: '10vh'
  },
  progressContainer: {
    height: 50
  },
  fabProgress: {
    margin: '0 auto',
    display: 'block'
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Entry));
