import { VISIBLE_ROOM_LIST } from '../actions/roomList'

export default (state={ show: false }, action) => {
  switch (action.type) {
    case VISIBLE_ROOM_LIST:
      return { ...state, show: action.payload }
    default:
      return state
  }
}
