import React, { Component } from 'react'
import './index.css'

import RoomHeader from '../RoomHeader'
import RoomMessageList from '../RoomMessageList'
import RoomPost from '../RoomPost'

class RoomContent extends Component {
  render () {
    const { visibleRoomList, loginUser, updateLoginUser,
      message, setMessage, joinMessage, addMessage, editMessage, removeMessage
    } = this.props

    return (
      <div id="room-main">
        <RoomHeader {...{visibleRoomList}} />
        <div className="room-wrapper">
          <div className="messages-wrapper">
            <RoomMessageList {...{loginUser, updateLoginUser, message,
              setMessage, joinMessage, addMessage, editMessage, removeMessage}} />
            <RoomPost {...{loginUser, updateLoginUser, message}} />
            {/* TODO: 右サイドバー */}
          </div>
        </div>
      </div>
    )
  }
}

export default RoomContent
