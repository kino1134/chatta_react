import React, { Component } from 'react'
import './index.css'

class RoomLoading extends Component {
  render () {
    return (
      <div id="room-loading" className="container has-text-centered">
        <span className="loader-text">しばらくお待ち下さい..</span>
        <div className="loader"></div>
      </div>
    )
  }
}

export default RoomLoading
