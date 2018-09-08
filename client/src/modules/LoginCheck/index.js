import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { loggedIn } from '../../services/storage'
import * as loginUserActions from '../../actions/loginUser'
import api from '../../services/api'

class LoginCheck extends Component {

  componentDidMount () {
    const { loginUser, setLoginUser } = this.props

    if (loginUser) {
      return
    }

    api.get('/api/users/me').then(res => {
      if (!res.ok) {
        window.location.href = '/authenticate'
      }

      res.json().then(json =>{
        setLoginUser(json)
      }).catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
  }

  render () {
    const { loginUser, children } = this.props

    if (!loggedIn()) {
      window.location.href = '/authenticate'
      return null
    }

    if (loginUser) {
      return (
        <Fragment>{children}</Fragment>
      )
    } else {
      // TODO: ローディング画面にしたほうがいい？
      return null
    }

  }

}

export default connect(
  state => ({ loginUser: state.loginUser }),
  { setLoginUser: loginUserActions.setLoginUser }
)(LoginCheck)
