import { SET_LGOIN_USER, UPDATE_LOGIN_USER } from '../actions/loginUser'

export default (state=null, action) => {
  switch (action.type) {
    case SET_LGOIN_USER:
      return action.payload
    case UPDATE_LOGIN_USER:
      return {...state, ...action.payload}
    default:
      return state
  }
}
