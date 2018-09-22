export const SET_MESSAGE = 'chatta_react/set_message'
export const JOIN_MESSAGE = 'chatta_react/join_message'
export const ADD_MESSAGE = 'chatta_react/add_message'

export const setMessage = (data) => ({ type: SET_MESSAGE, payload: data })
export const joinMessage = (data) => ({ type: JOIN_MESSAGE, payload: data })
export const addMessage = (data) => ({ type: ADD_MESSAGE, payload: data })
