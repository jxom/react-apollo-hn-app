export const USER_DATA_SET = 'USER_DATA_SET';
export const setUserData = data => ({ type: USER_DATA_SET, payload: data });

export const USER_DATA_REMOVE = 'USER_DATA_REMOVE';
export const removeUserData = () => ({ type: USER_DATA_REMOVE });
