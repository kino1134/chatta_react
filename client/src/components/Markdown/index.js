import React, { PureComponent } from 'react'
import markdownIt from 'markdown-it'
import markdownItEmoji from 'markdown-it-emoji'
import twemoji from 'twemoji'
import emojis from '../../data/emoji.json'
import './index.css'

class Markdown extends PureComponent {
  markdown (content) {
    const md = markdownIt({ breaks: true, linkify: true }).use(markdownItEmoji, { defs: emojis })
    md.renderer.rules.text = function (token, idx) {
      return twemoji.parse(token[idx].content, { className: 'emoji-markdown' })
    }
    md.renderer.rules.emoji = function (token, idx) {
      return twemoji.parse(token[idx].content, { className: 'emoji-markdown' })
    }

    return md.render(content)
  }

  render () {
    return (
      <span className={this.props.className}
        dangerouslySetInnerHTML={{ __html: this.markdown(this.props.content) }}>
      </span>
    )
  }
}

export default Markdown
