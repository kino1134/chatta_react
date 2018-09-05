import React, { Component } from 'react'

import InputMessage from '../InputMessage'

class TextInput extends Component {

  isError (errors, name) {
    if (!errors) return ''
    return errors.find(e => e.param === name) ? 'is-danger' : ''
  }

  render () {
    const {
      children,
      className,
      name,
      color,
      errors,
      ...rest
    } = this.props

    // 最小限必要なクラス名を追加する
    const classes = [
      'input',
      this.isError(errors, name),
      className
    ].join(' ')

    // 必須アイコンを付与する
    let requireIcon = null
    if (this.props.required) {
      requireIcon = (
        <span className="icon is-right has-text-danger">
          <i className="fas fa-asterisk fa-xs"></i>
        </span>
      )
    }

    return (
      <div className="field">
        <div className={'control' + (this.props.required ?  ' has-icons-right' : '')}>
          <input type="text" name={name} className={classes} {...rest} />
          {requireIcon}
        </div>
        {children}
        <InputMessage name={name} color={color || 'danger'} errors={errors} />
      </div>
    )
  }
}

export default TextInput
