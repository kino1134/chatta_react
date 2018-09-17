import React, { Component } from 'react'
import './index.css'

import RoomHeader from '../RoomHeader'
import RoomMessageList from '../RoomMessageList'
import RoomPost from '../RoomPost'

class RoomContent extends Component {
  render () {
    const { visibleRoomList, loginUser } = this.props

    return (
      <div id="room-main">
        <RoomHeader {...{visibleRoomList}} />
        <div className="room-wrapper">
          <div className="messages-wrapper">
            <RoomMessageList />
            <RoomPost {...{loginUser}} />
            {/* TODO: 右サイドバー */}
          </div>
        </div>
      </div>
    )
  }
}

export default RoomContent
