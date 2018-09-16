import React, { Component } from 'react'

import InputMessage from '../InputMessage'

class TextInput extends Component {

  isError (errors, name) {
    if (!errors) return ''
    return errors.find(e => e.param === name) ? 'is-danger' : ''
  }

  render () {
    const {
      type,
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


    // ラベルを付与する
    let label = null
    if (this.props.label) {
      label = (
        <label className="label">{this.props.label}</label>
      )
    }

    // 必須アイコンを付与する
    let requireIcon = null
    if (this.props.required) {
      requireIcon = (
        <span className="icon is-right has-text-danger">
          <i className="fas fa-asterisk fa-xs"></i>
        </span>
      )
    }

    let icon = null
    if (this.props.icon) {
      icon = (
        <span className="icon is-left">
          <i className={this.props.icon}></i>
        </span>
      )
    }

    return (
      <div className="field">
        {label}
        <div className={'control' + (this.props.required ?  ' has-icons-right' : '') + (icon ? ' has-icons-left' : '')}>
          <input type={type||'text'} name={name} className={classes} {...rest} />
          {icon}
          {requireIcon}
        </div>
        {children}
        <InputMessage name={name} color={color || 'danger'} errors={errors} />
      </div>
    )
  }
}

export default TextInput
