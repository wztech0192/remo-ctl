import {
  ON_CONNECTION_SUCCESS,
  ON_CONNECTION_STOP,
  ON_CONNECTION_FAIL,
  SET_CONN_PROPERTY,
  SET_OUTPUT
} from 'store/enums';

const defaultState = {
  ws: null,
  offline: false,
  isConnected: false,
  output: ''
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ON_CONNECTION_SUCCESS:
      return {
        ...state,
        ws: action.ws,
        isConnected: true,
        loading: false
      };
    case ON_CONNECTION_FAIL:
    case ON_CONNECTION_STOP:
      return {
        ...state,
        ws: null,
        isConnected: false,
        loading: false,
        offline: false
      };
    case SET_CONN_PROPERTY:
      return {
        ...state,
        [action.key]: action.payload
      };
    case SET_OUTPUT:
      return {
        ...state,
        output: state.output
          ? state.output + '\n' + action.output
          : action.output
      };
    default:
      return state;
  }
};
