import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toggle } from 'store/actions/appAction';
import Grid from '@material-ui/core/Grid';
import LeftArrow from '@material-ui/icons/ArrowLeft';
import RightArrow from '@material-ui/icons/ArrowRight';
import Header from 'components/Header';
import ActionGroup from 'components/ActionGroup';
import GameCanvas from 'components/GameCanvas';
import Output from 'components/Output';
import Controller from 'components/Controller';
import CmdInput from 'components/CmdInput';
import Grow from '@material-ui/core/Grow';

const mapStateToProps = ({ app }) => ({
  isLandscape: app.isLandscape,
  showLeft: app.showLeft,
  showRight: app.showRight,
  isFullScreen: app.isFullScreen,
  game: app.game
});
const mapDispatchToProps = { toggle };

export class Main extends PureComponent {
  landscapeHide = type => {
    if (this.props.isLandscape && !this.props.isFullScreen) {
      return (
        <Grid
          item
          onClick={this.props.toggle('show' + type)}
          style={{
            boxShadow: 'inset 0 0 20px 0px lightgray',
            margin: '0 10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ['margin' + type]: -20
          }}
        >
          {type === 'Left' ? (
            <>
              &nbsp;
              {this.props.showLeft ? (
                <LeftArrow color="primary" />
              ) : (
                <RightArrow color="primary" />
              )}
            </>
          ) : (
            <>
              {this.props.showRight ? (
                <RightArrow color="primary" />
              ) : (
                <LeftArrow color="primary" />
              )}
              &nbsp;
            </>
          )}
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { isLandscape, showLeft, showRight, isFullScreen, game } = this.props;
    return (
      <Grow in={true} mountOnEnter unmountOnExit>
        <Grid
          container
          direction={isLandscape ? 'row' : 'column'}
          alignItems="stretch"
          spacing={0}
          style={{ height: '100%' }}
        >
          {this.landscapeHide('Left')}
          {(!isLandscape || showLeft) && (
            <Grid item xs={isLandscape}>
              <Header />
              <ActionGroup />
              {game ? (
                <GameCanvas />
              ) : (
                !isFullScreen && (
                  <>
                    <Output />
                    <CmdInput />
                  </>
                )
              )}
            </Grid>
          )}
          {(!isLandscape || showRight) && (
            <Grid item xs>
              <Controller />
            </Grid>
          )}
          {this.landscapeHide('Right')}
        </Grid>
      </Grow>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
