import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import './index.css'

import * as roomListActions from '../../actions/roomList'
import * as loginUserActions from '../../actions/loginUser'
import * as messageActions from '../../actions/message'

import RoomList from '../RoomList'
import RoomContent from '../RoomContent'

class RoomMain extends Component {
  render () {
    const { loginUser, roomList, visibleRoomList, updateLoginUser,
      message, setMessage, joinMessage, addMessage, editMessage, removeMessage
    } = this.props

    // ルームリストを表示したとき、透明なオーバレイを挟んで他項目をいじれないようにする
    let overlay = null
    if (roomList.show) {
      overlay = (
        <div onClick={(e) => visibleRoomList(false)}
          style={{position: 'fixed', top:0,left:0,right:0,bottom:0}}>
        </div>
      )
    }

    return (
      <div id="main" className="container is-fluid">
        <Helmet title="chatta" />
        <RoomList {...{loginUser, roomList}}  />
        <RoomContent {...{loginUser, visibleRoomList, updateLoginUser,
          message, setMessage, joinMessage, addMessage, editMessage, removeMessage
        }} />
        {overlay}
      </div>
    )
  }
}

export default connect(
  state => ({
    loginUser: state.loginUser,
    roomList: state.roomList,
    message: state.message
  }),
  {
    visibleRoomList: roomListActions.visibleRoomList,
    updateLoginUser: loginUserActions.updateLoginUser,
    setMessage: messageActions.setMessage,
    joinMessage: messageActions.joinMessage,
    addMessage: messageActions.addMessage,
    editMessage: messageActions.editMessage,
    removeMessage: messageActions.removeMessage
  }
)(RoomMain)
