import {
  ON_CONNECTION_SUCCESS,
  ON_CONNECTION_FAIL,
  ON_CONNECTION_STOP,
  SET_CONN_PROPERTY,
  SET_OUTPUT
} from 'store/enums';
import { gameConnector } from 'tools';

export const makeConnection = ip => (dispatch, getState) => {
  if (getState().conn.loading) return null;
  if (ip.toLowerCase() === 'offline') {
    return dispatch({ type: SET_CONN_PROPERTY, key: 'offline', payload: true });
  }
  dispatch({ type: SET_CONN_PROPERTY, key: 'loading', payload: true });
  let ws = null;
  if (ip.includes('wss://')) {
    ws = new WebSocket(ip);
  } else {
    ws = new WebSocket('ws://' + ip);
  }
  ws.onopen = e => {
    dispatch({ type: ON_CONNECTION_SUCCESS, ws });
  }; //on open event

  ws.onclose = e => {
    /*  console.log('close');
    console.log(e);*/
    dispatch({ type: ON_CONNECTION_STOP });
  }; //on close event

  ws.onmessage = msg => {
    if (msg.data !== undefined && msg.data !== '') {
      var data = msg.data.split('&');
      switch (data[0]) {
        case 'status':
          dispatch({
            type: SET_CONN_PROPERTY,
            key: 'isConnected',
            payload: data[1] === ''
          });
          break;
        default:
          if (data[1]) {
            dispatch({
              type: SET_CONN_PROPERTY,
              key: 'output',
              payload: data[1]
            });
          }
      }
    }
  };
  ws.onerror = e => {
    dispatch({ type: ON_CONNECTION_FAIL });
  }; //on error event
};

export const output = msg => dispatch =>
  dispatch({ type: SET_OUTPUT, output: msg });

export const disconnect = () => dispatch =>
  dispatch({ type: ON_CONNECTION_STOP });

export const send = (type, actions) => (dispatch, getState) => {
  const { conn, app } = getState();
  if (app.game) {
    gameConnector.dispatch(type, actions);
  } else if (conn.ws !== null) {
    conn.ws.send(type + '&' + actions.join('&')); //send method
  }
};
