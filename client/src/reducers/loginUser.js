import { SET_LGOIN_USER } from '../actions/loginUser'

export default (state=null, action) => {
  switch (action.type) {
    case SET_LGOIN_USER:
      return { ...state, user: action.payload }
    default:
      return state
  }
}
