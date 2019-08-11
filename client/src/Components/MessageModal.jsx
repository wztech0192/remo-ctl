import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeConnection, closeModal } from 'store/actions/connAction';

const mapStateToProps = ({ conn }) => ({
  modalOpen: conn.modalOpen
});

const mapDispatchToProps = {
  makeConnection,
  closeModal
};

export class MessageModal extends PureComponent {
  handleClickOffline = () => {
    this.props.makeConnection('offline');
    this.props.closeModal();
  };

  render() {
    const { modalOpen, closeModal } = this.props;
    return (
      <Dialog open={modalOpen} onClose={closeModal} fullWidth>
        <DialogTitle style={{ color: 'rgb(0, 155, 160)' }}>
          Connection Failed!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to continue in OFFLINE mode?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClickOffline} color="primary">
            Go Offline
          </Button>
          <Button onClick={closeModal} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageModal);
