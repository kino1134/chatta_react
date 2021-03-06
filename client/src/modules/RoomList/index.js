import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import './index.css'

import { clearAccessToken } from '../../services/storage'

Modal.setAppElement('#root')
const customStyles = {
  content: {
    top: '30px',
    left: '20px',
    right: 'auto',
    bottom: 'auto',
    paddingLeft: 0,
    paddingRight: 0
  },
  overlay: {
    backgroundColor: 'transparent'
  }
}

class RoomList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isMenuOpen: false
    }
  }

  showMenu (e) {
    this.setState({ isMenuOpen: true })
  }

  hideMenu (e) {
    this.setState({ isMenuOpen: false })
  }

  logOut (e) {
    clearAccessToken()
    window.location.href = '/authenticate'
  }

  render () {
    return (
      <aside id="room-list" className={'menu' + (this.props.roomList.show ? ' show' : '')}>
        <header className="login-user">
          <button className="button menu-button" onClick={(e) => this.showMenu(e)}>
            <span className="login-user-name">{this.props.loginUser.displayName}</span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
          <Modal contentLabel="ユーザメニュー" style={customStyles} isOpen={this.state.isMenuOpen}
            onRequestClose={(e) => this.hideMenu(e)} shouldReturnFocusAfterClose={false}>
            <div className="menu" role="menu">
              <ul className="menu-list">
                <li><Link to="/settings/profile">
                  <i className="fas fa-user" style={{marginRight: '5px'}}></i>プロフィールの変更
                </Link></li>
                <li><a onClick={(e) => this.logOut(e)}>
                  <i className="fas fa-sign-out-alt" style={{marginRight: '5px'}}></i>ログアウト
                </a></li>
              </ul>
            </div>
          </Modal>
        </header>
        <div className="room-list">
          (未完)チャンネルリスト
        </div>
      </aside>
    )
  }
}

export default RoomList
