import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class MessageModal extends Component {
  render() {
    const { open, handleClose } = this.props;

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ color: '#3f51b5' }}>Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Connection Failed! Please try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default MessageModal;
