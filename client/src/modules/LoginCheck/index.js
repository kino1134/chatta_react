import React, { Component, Fragment } from 'react'

import { loggedIn } from '../../services/storage'
import api from '../../services/api'

class LoginCheck extends Component {

  constructor (props) {
    super(props)

    this.state = {
      // TODO: グローバルに見えるようにする
      user: null
    }
  }

  componentDidMount () {
    if (this.state.user) {
      return
    }

    api.get('/api/users/me').then(res => {
      if (!res.ok) {
        window.location.href = '/authenticate'
      }
      res.json().then(json =>{
        this.setState({ user: json })
      }).catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
  }


  render () {
    if (!loggedIn()) {
      window.location.href = '/authenticate'
      return null
    }

    if (this.state.user) {
      return (
        <Fragment>{this.props.children}</Fragment>
      )
    } else {
      // TODO: ローディング画面にしたほうがいい？
      return null
    }

  }

}

export default LoginCheck
