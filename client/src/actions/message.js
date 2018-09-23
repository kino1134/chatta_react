export const SET_MESSAGE = 'chatta_react/set_message'
export const JOIN_MESSAGE = 'chatta_react/join_message'
export const ADD_MESSAGE = 'chatta_react/add_message'
export const EDIT_MESSAGE = 'chatta_react/edit_message'
export const REMOVE_MESSAGE = 'chatta_react/remove_message'

export const setMessage = (data) => ({ type: SET_MESSAGE, payload: data })
export const joinMessage = (data) => ({ type: JOIN_MESSAGE, payload: data })
export const addMessage = (data) => ({ type: ADD_MESSAGE, payload: data })
export const editMessage = (data) => ({ type: EDIT_MESSAGE, payload: data })
export const removeMessage = (data) => ({ type: REMOVE_MESSAGE, payload: data })
