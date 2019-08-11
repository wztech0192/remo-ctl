import {
  ON_CONNECTION_SUCCESS,
  ON_CONNECTION_STOP,
  SET_CONN_PROPERTY,
  SET_OUTPUT
} from 'store/enums';
import { gameConnector } from 'tools';

let wsQueue = [];
export const makeConnection = ip => (dispatch, getState) => {
  if (getState().conn.loading) {
    wsQueue[wsQueue.length - 1].cancel = true;
    dispatch({ type: ON_CONNECTION_STOP, noModal: true });
    return;
  }

  if (ip.toLowerCase() === 'offline') {
    return dispatch({ type: SET_CONN_PROPERTY, key: 'offline', payload: true });
  }

  dispatch({ type: SET_CONN_PROPERTY, key: 'loading', payload: true });
  let ws = new WebSocket(ip.includes('wss://') ? ip : 'ws://' + ip);
  wsQueue.push(ws);
  ws.onopen = e => {
    dispatch({ type: ON_CONNECTION_SUCCESS, ws });
  }; //on open event

  ws.onclose = e => {
    wsQueue.pop();
    if (!ws.cancel) {
      dispatch({ type: ON_CONNECTION_STOP });
    }
    ws = null;
  }; //on close event

  ws.onerror = e => {};

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
};

export const output = msg => dispatch =>
  dispatch({ type: SET_OUTPUT, output: msg });

export const disconnect = () => (dispatch, getState) => {
  const ws = getState().conn.ws;
  if (ws) {
    ws.close();
  } else {
    dispatch({ type: ON_CONNECTION_STOP });
  }
};

export const send = (type, actions) => (dispatch, getState) => {
  const { conn, app } = getState();
  if (app.game) {
    gameConnector.dispatch(type, actions);
  } else if (conn.ws !== null) {
    conn.ws.send(type + '&' + actions.join('&')); //send method
  }
};

export const closeModal = () => dispatch =>
  dispatch({
    type: SET_CONN_PROPERTY,
    key: 'modalOpen',
    payload: false
  });
