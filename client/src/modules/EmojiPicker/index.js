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

    this.state = {
      title: '',
      emoji: '　'
    }
  }

  hoverEmoji (e, k, v) {
    this.setState({ title: `:${k}:`, emoji: v })
  }

  blurEmoji (e) {
    this.setState({ title: '', emoji: '　' })
  }

  render () {
    const { position, selectEmoji, ...rest } = this.props
    const style = {...pickerStyle}
    if (position) {
      style.content.bottom = position[0]
      style.content.right = position[1]
    }
    const list = Object.keys(emojis).map((k) => (
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
