import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

export default class extends Component {
  componentDidUpdate() {
    var output_field = document.querySelector('#output textarea');
    if (output_field) output_field.scrollTop = output_field.scrollHeight + 100;
  }

  shouldComponentUpdate(prevProps) {
    if (prevProps.output === this.props.output) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div id="output">
        <TextField
          variant="outlined"
          label="Output"
          fullWidth
          multiline
          rowsMax={4}
          rows={4}
          value={this.props.output}
          margin="normal"
          InputProps={{
            readOnly: true,
            style: {
              fontSize: 12
            }
          }}
        />
      </div>
    );
  }
}
