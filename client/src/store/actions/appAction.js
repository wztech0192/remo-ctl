import { ON_TOGGLE, SET_APP_PROPERTY } from 'store/enums';

export const setLandScape = () => dispatch =>
  dispatch({
    type: SET_APP_PROPERTY,
    key: 'isLandscape',
    payload: window.orientation === 90
  });

export const toggle = key => dispatch => () =>
  dispatch({ type: ON_TOGGLE, key });

export const toggleFullScreen = () => dispatch =>
  dispatch({ type: ON_TOGGLE, key: 'isFullScreen' });

export const toggleModal = () => dispatch =>
  dispatch({ type: ON_TOGGLE, key: 'modalOpen' });

export const toggleDrawer = () => dispatch =>
  dispatch({ type: ON_TOGGLE, key: 'drawerOpen' });

export const toggleGame = game => (dispatch, getState) => {
  if (getState().app.game !== game) {
    dispatch({ type: SET_APP_PROPERTY, key: 'game', payload: game });
  }
};
