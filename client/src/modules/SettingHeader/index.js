import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import './index.css'

const profile = '/settings/profile'
const password = '/settings/password'

class SettingHeader extends Component {

  isActive (path) {
    return this.props.location.pathname === path ? 'is-active': ''
  }

  render () {
    return (
      <div id="setting-header">
        <div className="tabs">
          <ul>
            <li className={this.isActive(profile)}><Link to={profile}>
              <span className="icon"><i className="fas fa-user"></i></span>
              <span>プロフィール</span>
            </Link></li>
            {this.props.loginUser.password &&
              <li className={this.isActive(password)}><Link to={password}>
                <span className="icon"><i className="fas fa-key"></i></span>
                <span>パスワード</span>
              </Link></li>}
          </ul>
        </div>
        <Link to="/" className="back"><i className="fas fa-times fa-lg"></i></Link>
      </div>
    )
  }
}

export default withRouter(SettingHeader)
