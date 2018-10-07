import React, { Component, Fragment } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')
const customStyles = {
  content: {
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: '8px 0',
  },
  overlay: {
    backgroundColor: 'transparent'
  }
}

class RoomMessageMenu extends Component {
  showMyMessageMenu (message) {
    if (!message) return null
    if (this.props.loginUser.userId !== message.user.userId) return null

    return (
      <Fragment>
        <li><hr/></li>
        <li><a onClick={e => this.props.onSelectEditMessage(e) }>
          <i className="fas fa-edit" style={{marginRight: '5px'}}></i>メッセージの編集
        </a></li>
        <li><a onClick={e => this.props.onSelectDeleteMessage(e) } className="has-text-danger">
          <i className="fas fa-trash-alt" style={{marginRight: '5px'}}></i>削除
        </a></li>
      </Fragment>
    )
  }

  render () {
    customStyles.content.top = this.props.position.top
    customStyles.content.left = this.props.position.left

    return (
      <Modal contentLabel="メッセージメニュー" style={customStyles} isOpen={!!this.props.selectMessage}
        onRequestClose={e => this.props.onCancelSelectMessage(e) }>
        <div className="menu" role="menu">
          <ul className="menu-list">
            <li><a>(仮)メッセージメニュー</a></li>
            {this.showMyMessageMenu(this.props.selectMessage)}
          </ul>
        </div>
      </Modal>
    )
  }
}

export default RoomMessageMenu
