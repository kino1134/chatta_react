import React, { Component } from 'react'
import './index.css'

class RoomList extends Component {
  render () {
    return (
      <aside id="room-list" className="menu">
        <header className="login-user">
          {this.props.loginUser.displayName}
        </header>
        <div className="room-list">
          (未完)チャンネルリスト
        </div>
      </aside>
    )
  }
}

export default RoomList
