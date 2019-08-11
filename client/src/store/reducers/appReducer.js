import { ON_TOGGLE, SET_APP_PROPERTY } from 'store/enums';

const defaultState = {
  drawerOpen: false,
  game: null,
  showLeft: true,
  showRight: true,
  isLandscape: window.orientation === 90,
  isFullScreen: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ON_TOGGLE:
      return {
        ...state,
        [action.key]: !state[action.key]
      };
    case SET_APP_PROPERTY:
      return {
        ...state,
        [action.key]: action.payload
      };
    default:
      return state;
  }
};
