import React, { Component } from 'react';
import Entry from 'components/Entry';
import Main from 'components/Main';
import MessageModal from 'components/MessageModal';
import { connect } from 'react-redux';
import { setLandScape } from 'store/actions/appAction';

const mapStateToProps = ({ conn }) => ({
  connected: conn.offline || conn.isConnected
});

const mapDispatchToProps = { setLandScape };

class App extends Component {
  componentDidMount() {
    window.addEventListener('orientationchange', this.props.setLandScape);
  }

  render() {
    const { connected } = this.props;
    return (
      <div className="App">
        {!connected ? <Entry /> : <Main />}
        <MessageModal />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
