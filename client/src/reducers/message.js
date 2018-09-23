import { SET_MESSAGE, JOIN_MESSAGE, ADD_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from '../actions/message'

export default (state={ list: null, previous: null }, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return { ...state, list: action.payload.list, previous: action.payload.previous }
    case JOIN_MESSAGE:
      return { ...state, list: [...action.payload.list, ...state.list], previous: action.payload.previous }
    case ADD_MESSAGE:
      return { ...state, list: [...state.list, action.payload] }
    case EDIT_MESSAGE: {
      const index = state.list.findIndex(m => m.id === action.payload.id)
      if (index < 0) {
        return state
      } else {
        return { ...state, list: [...state.list.slice(0, index), action.payload, ...state.list.slice(index + 1)] }
      }
    }
    case REMOVE_MESSAGE: {
      const index = state.list.findIndex(m => m.id === action.payload.id)
      if (index < 0) {
        return state
      } else {
        return { ...state, list: [...state.list.slice(0, index), ...state.list.slice(index + 1)] }
      }
    }
    default:
      return state
  }
}
