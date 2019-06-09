import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default ({ open, handleClose, makeConnection }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle style={{ color: 'rgb(0, 155, 160)' }}>
      Connection Failed!
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Do you want to continue in OFFLINE mode?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          makeConnection('offline');
          handleClose();
        }}
        color="primary"
      >
        Go Offline
      </Button>
      <Button onClick={handleClose} color="primary">
        No
      </Button>
    </DialogActions>
  </Dialog>
);
