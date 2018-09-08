import React, { Component } from 'react'
import './index.css'

class RoomHeader extends Component {
  render () {
    return (
      <header id="room-header">
        <a className="room-burger">
          <i className="fa fa-bars fa-lg"></i>
        </a>
        <div className="room-info">
         (仮)ヘッダ
        </div>
        <div className="spacer"></div>
        <div className="room-action">
          (仮)アクション
        </div>
      </header>
    )
  }
}

export default RoomHeader
