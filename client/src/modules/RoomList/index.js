import React, { Component } from 'react'
import Modal from 'react-modal'
import './index.css'

Modal.setAppElement('#root')
const customStyles = {
  content: {
    top: '30px',
    left: '20px',
    right: 'auto',
    bottom: 'auto'
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
          <Modal contentLabel="ユーザメニュー" style={customStyles}
            isOpen={this.state.isMenuOpen} onRequestClose={(e) => this.hideMenu(e)} shouldReturnFocusAfterClose={false}>
            (仮)ユーザメニュー
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
