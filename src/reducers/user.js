import { USER_DATA_SET, USER_DATA_REMOVE } from 'actions/users';

export default (state = {}, action) => {
  switch (action.type) {
    case USER_DATA_SET:
      return { ...state, ...action.payload };
    case USER_DATA_REMOVE:
      return {};
    default:
      return state;
  }
};
