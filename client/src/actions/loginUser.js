export const SET_LGOIN_USER = 'chatta_react/set_login_user'
export const UPDATE_LOGIN_USER = 'chatta_react/update_login_user'

export const setLoginUser = (user) => ({ type: SET_LGOIN_USER, payload: user })
export const updateLoginUser = (user) => ({ type: UPDATE_LOGIN_USER, payload: user })
