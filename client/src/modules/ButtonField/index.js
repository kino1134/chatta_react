import React, { Component } from 'react'

class ButtonField extends Component {
  render () {
    const { align, className, loading, children, ...rest } = this.props

    let position = ''
    if (align === 'center') {
      position = 'has-text-centered'
    } else if (align === 'justify') {
      position = 'has-text-justified'
    } else if (align === 'left') {
      position = 'has-test-left'
    } else if (align === 'right') {
      position = 'has-text-right'
    }

    return (
      <div className="field">
        <div className={`control ${position}`}>
          <button disabled={loading} className={`button ${className} ${loading ? 'is-loading' : ''}`} {...rest}>
            {children}
          </button>
        </div>
      </div>
    )
  }
}

export default ButtonField
