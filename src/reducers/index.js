import { combineReducers } from 'redux';
import user from './user';

const todoApp = combineReducers({
  user
});

export default todoApp;
