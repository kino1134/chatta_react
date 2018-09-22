import { SET_MESSAGE, JOIN_MESSAGE, ADD_MESSAGE } from '../actions/message'

export default (state={ list: null, previous: null, position: 0 }, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return { ...state, list: action.payload.list, previous: action.payload.previous }
    case JOIN_MESSAGE:
      return { ...state, list: [...action.payload.list, ...state.list], previous: action.payload.previous }
    case ADD_MESSAGE:
      return { ...state, list: [...state.list, action.payload] }
    default:
      return state
  }
}
