import React, { Component } from 'react'
import { connect } from 'react-redux'
import './index.css'

import * as roomListActions from '../../actions/roomList'

import RoomList from '../RoomList'
import RoomMain from '../RoomMain'

class Main extends Component {
  render () {
    const { loginUser, roomList, visibleRoomList } = this.props

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
        <RoomList {...{loginUser, roomList}}  />
        <RoomMain {...{loginUser, visibleRoomList}} />
        {overlay}
      </div>
    )
  }
}

export default connect(
  state => ({
    loginUser: state.loginUser,
    roomList: state.roomList
  }),
  { visibleRoomList: roomListActions.visibleRoomList }
)(Main)
