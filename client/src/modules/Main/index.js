import React, { Component } from 'react'
import { connect } from 'react-redux'
import './index.css'

import RoomList from '../RoomList'
import RoomMain from '../RoomMain'

class Main extends Component {
  render () {
    const { loginUser } = this.props

    return (
      <div id="main" className="container is-fluid">
        <RoomList {...{loginUser}}  />
        <RoomMain />
      </div>
    )
  }
}

export default connect(
  state => ({ loginUser: state.loginUser })
)(Main)
