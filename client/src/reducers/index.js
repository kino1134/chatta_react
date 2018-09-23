import {combineReducers } from 'redux'

import loginUser from './loginUser'
import message from './message'
import roomList from './roomList'

export default combineReducers({
  loginUser,
  roomList,
  message
})
