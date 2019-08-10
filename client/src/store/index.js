import { combineReducers, createStore, applyMiddleware } from 'redux';
import connReducer from './reducers/connReducer';
import appReducer from './reducers/appReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  conn: connReducer,
  app: appReducer
});

const middleware = applyMiddleware(thunk);

export default createStore(rootReducer, middleware);
