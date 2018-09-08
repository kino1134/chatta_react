import React, { Component } from 'react'
import './index.css'

import RoomHeader from '../RoomHeader'
import RoomMessageList from '../RoomMessageList'
import RoomPost from '../RoomPost'

class RoomMain extends Component {
  render () {
    return (
      <div id="room-main">
        <RoomHeader />
        <div className="room-wrapper">
          <div className="messages-wrapper">
            <RoomMessageList />
            <RoomPost />
            {/*- 右サイドバー */}
          </div>
        </div>
      </div>
    )
  }
}

export default RoomMain
