import React, { Component } from 'react'
import Modal from 'react-modal'
import emojis from '../../data/picker.json'
import twemoji from 'twemoji'

import './index.css'

Modal.setAppElement('#root')
const pickerStyle = {
  content: {
    maxWidth: '100%',
    width: '357px',
    height: '365px',
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
      category: 'Smileys & People',
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

  clickEmoji (e, k) {
    this.props.selectEmoji(k)
    this.props.onRequestClose()
  }

  selectCategory (category) {
    this.setState({ category })
  }

  filterEmoji (k) {
    if (this.state.searchText) {
      return k.name.indexOf(this.state.searchText.toLowerCase()) > -1
    } else if (this.state.category) {
      return k.category === this.state.category
    } else {
      return true
    }
  }

  render () {
    const { position, selectEmoji, ...rest } = this.props
    if (!position) return null

    const style = {...pickerStyle}
    if (position) {
      style.content.bottom = position.bottom
      style.content.right = window.innerWidth < 450 ? 0 : position.right
    }
    const list = emojis.filter(k => this.filterEmoji(k)).map((k) => (
      <a key={k.name} className="emoji-item" title={k.name} onClick={e => this.clickEmoji(e, `:${k.name}:`)}
        onMouseEnter={e => this.hoverEmoji(e, k.name, k.char) }
        onMouseLeave={e => this.blurEmoji(e) }
        dangerouslySetInnerHTML={{ __html: twemoji.parse(k.char) }}>
      </a>
    ))

    return (
      <Modal {...rest} isOpen={!!position} style={style}>
        <div id="emoji-picker" className="panel">
          <p className="panel-heading panel-tabs picker-header">
            <a className={this.state.category === 'Smileys & People' ? 'is-active' : ''}
              title="顔文字と人々" onClick={e => this.selectCategory('Smileys & People') }>
              <i className="far fa-grin picker-category"></i>
            </a>
            <a className={this.state.category === 'Animals & Nature' ? 'is-active' : ''}
              title="動物と自然" onClick={e => this.selectCategory('Animals & Nature') }>
              <i className="fas fa-paw picker-category"></i>
            </a>
            <a className={this.state.category === 'Food & Drink' ? 'is-active' : ''}
              title="食べ物と飲み物" onClick={e => this.selectCategory('Food & Drink') }>
              <i className="fas fa-utensils picker-category"></i>
            </a>
            <a className={this.state.category === 'Travel & Places' ? 'is-active' : ''}
              title="旅行と名所" onClick={e => this.selectCategory('Travel & Places') }>
              <i className="fas fa-car picker-category"></i>
            </a>
            <a className={this.state.category === 'Activities' ? 'is-active' : ''}
              title="運動" onClick={e => this.selectCategory('Activities') }>
              <i className="fas fa-futbol picker-category"></i>
            </a>
            <a className={this.state.category === 'Objects' ? 'is-active' : ''}
              title="オブジェクト" onClick={e => this.selectCategory('Objects') }>
              <i className="far fa-lightbulb picker-category"></i>
            </a>
            <a className={this.state.category === 'Symbols' ? 'is-active' : ''}
              title="シンボル" onClick={e => this.selectCategory('Symbols') }>
              <i className="fas fa-font picker-category"></i>
            </a>
            <a className={this.state.category === 'Flags' ? 'is-active' : ''}
              title="旗" onClick={e => this.selectCategory('Flags') }>
              <i className="far fa-flag picker-category"></i>
            </a>
          </p>
          <div className="panel-block">
            <p className="control has-icons-left">
              <input name="searchText" type="text" className="input" placeholder="検索" autoFocus
                value={this.state.searchText} onChange={this.changeHandler} />
              <span className="icon is-left">
                <i className="fas fa-search"></i>
              </span>
            </p>
          </div>
          <div className="panel-block picker-main">
            {list}
          </div>
          <p className="panel-heading picker-footer">
            <span className="preview-emoji"
              dangerouslySetInnerHTML={{ __html: twemoji.parse(this.state.emoji) }}>
            </span>
            <span className="preview-title">{this.state.title}</span>
          </p>
        </div>
      </Modal>
    )
  }
}

export default EmojiPicker
