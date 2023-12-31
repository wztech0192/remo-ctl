import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Textfield from '@material-ui/core/TextField';

export default class extends Component {
  state = {
    titleError: false,
    cmdError: false,
    title: '',
    cmd: '',
    btn: null
  };

  componentWillReceiveProps(newProps) {
    if (newProps.btn) {
      this.setState({
        title: newProps.btn.title,
        cmd: newProps.btn.cmd,
        btn: newProps.btn
      });
    }
  }

  onInputChange = name => e => {
    this.setState({ [name]: e.target.value });
  };
  validInput = () => {
    const { title, cmd } = this.state;
    if (!title) {
      this.setState({ titleError: true });
      return;
    }
    if (!cmd) {
      this.setState({ cmdError: true });
      return;
    }

    this.props.handleCustChange(title, cmd);
  };

  render() {
    const { open, handleClose } = this.props;
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle style={{ color: 'rgb(0, 155, 160)' }}>
          {this.state.btn && this.state.btn.Icon} Customize Action
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="caption">
              Customizing cmd actions e.g.
              <br />
              "start url" =&gt; website
              <br />
              "shutdown /s" =&gt; shutdown pc
            </Typography>
          </DialogContentText>

          <Textfield
            value={this.state.title}
            onChange={this.onInputChange('title')}
            margin="normal"
            fullWidth
            onFocus={() => {
              this.setState({ titleError: false });
            }}
            error={this.state.titleError}
            helperText={this.state.titleError ? 'Title cannot be empty' : ''}
            label="Action Title"
          />
          <div />
          <Textfield
            value={this.state.cmd}
            fullWidth
            multiline
            margin="normal"
            label="CMD Action"
            onChange={this.onInputChange('cmd')}
            onFocus={() => {
              this.setState({ cmdError: false });
            }}
            error={this.state.cmdError}
            helperText={
              this.state.cmdError ? 'cmd cannot be empty, use n/a instead' : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.validInput} color="primary">
            Save
          </Button>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
