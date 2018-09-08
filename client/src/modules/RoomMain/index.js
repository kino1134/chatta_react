import React, { Component } from 'react'
import './index.css'

import RoomHeader from '../RoomHeader'
import RoomPost from '../RoomPost'

class RoomMain extends Component {
  render () {
    return (
      <div id="room-main">
        <RoomHeader />
        <div className="room-wrapper">
          <div className="messages-wrapper">
            <div className="messages">
              (仮)メッセージ
            </div>
            <RoomPost />
            {/*- 右サイドバー */}
          </div>
        </div>
      </div>
    )
  }
}

export default RoomMain
