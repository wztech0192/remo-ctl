import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

class CmdInput extends Component {
  state = {
    cmdHead: '',
    cmdBody: ''
  };

  handleChange = name => e => {
    this.setState({ [name]: e.target.value });
  };

  send = () => {
    const { cmdHead, cmdBody } = this.state;
    const val = (cmdHead === '' ? '' : cmdHead + '\n') + cmdBody;
    this.props.send('cmd&' + val);
    this.props.output(val);
    this.setState({ cmdBody: '' });
  };

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <TextField
            placeholder="cmd head:"
            fullWidth
            margin="none"
            onChange={this.handleChange('cmdHead')}
            inputProps={{
              style: {
                fontSize: 11
              }
            }}
            value={this.state.cmdHead}
          />
          <TextField
            margin="none"
            placeholder="cmd body:"
            className="cmd"
            value={this.state.cmdBody}
            inputProps={{
              style: {
                fontSize: 11
              }
            }}
            onChange={this.handleChange('cmdBody')}
            fullWidth
            multiline
            rowsMax={2}
            rows={2}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="outlined"
            style={{ width: '100%', height: '100%' }}
            onClick={this.send}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default CmdInput;
