import React, { PureComponent } from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  output: state.conn.output,
  isLandscape: state.app.isLandscape
});

class Output extends PureComponent {
  componentDidUpdate() {
    var output_field = document.querySelector('#output textarea');
    if (output_field) output_field.scrollTop = output_field.scrollHeight + 100;
  }

  render() {
    return (
      <div id="output">
        <TextField
          variant="outlined"
          label="Output"
          fullWidth
          multiline
          value={this.props.output}
          margin="normal"
          rows={this.props.isLandscape ? 12 : 3}
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

export default connect(mapStateToProps)(Output);
