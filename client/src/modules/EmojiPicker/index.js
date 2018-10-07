import React, { Component } from 'react'
import Modal from 'react-modal'
import emojis from 'markdown-it-emoji/lib/data/full.json'

import './index.css'

Modal.setAppElement('#root')
const pickerStyle = {
  content: {
    width: '357px',
    height: '357px',
    padding: 0,
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
  },
  overlay: {
    backgroundColor: 'transparent'
  }
}

class EmojiPicker extends Component {
  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      searchText: '',
      title: '',
      emoji: '　'
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  hoverEmoji (e, k, v) {
    this.setState({ title: `:${k}:`, emoji: v })
  }

  blurEmoji (e) {
    this.setState({ title: '', emoji: '　' })
  }

  render () {
    const { position, selectEmoji, ...rest } = this.props
    if (!position) return null

    const style = {...pickerStyle}
    if (position) {
      style.content.bottom = position.bottom
      style.content.right = position.right
    }
    const list = Object.keys(emojis).filter(k => k.indexOf(this.state.searchText.toLowerCase()) > -1).map((k) => (
      <a key={k} className="emoji" title={k} onClick={e => selectEmoji(`:${k}:`)}
        onMouseEnter={e => this.hoverEmoji(e, k, emojis[k]) }
        onMouseLeave={e => this.blurEmoji(e) }>
        {emojis[k]}
      </a>
    ))

    return (
      <Modal {...rest} isOpen={!!position} style={style}>
        <div id="emoji-picker" className="panel">
          <p className="panel-heading">ヘッダ</p>
          <div className="panel-block">
            <p className="control has-icons-left">
              <input name="searchText" type="text" className="input" placeholder="検索" onChange={this.changeHandler} />
              <span className="icon is-left">
                <i className="fas fa-search"></i>
              </span>
            </p>
          </div>
          <div className="panel-block picker-main">
            {list}
          </div>
          <p className="panel-heading picker-footer">
            <span className="preview-emoji">{this.state.emoji}</span>
            <span className="preview-title">{this.state.title}</span>
          </p>
        </div>
      </Modal>
    )
  }
}

export default EmojiPicker
