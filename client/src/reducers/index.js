import {combineReducers } from 'redux'

import loginUser from './loginUser'
import roomList from './roomList'

export default combineReducers({
  loginUser,
  roomList
})
