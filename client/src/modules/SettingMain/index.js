import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import './index.css'

import * as loginUserActions from '../../actions/loginUser'

import SettingHeader from '../SettingHeader'
import SettingProfile from '../SettingProfile'
import SettingPassword from '../SettingPassword'

class SettingMain extends Component {
  render () {
    const { loginUser, updateLoginUser } = this.props

    return (
      <div id="setting-main" className="container is-fluid">
        <SettingHeader {...{loginUser}} />
        <div className="setting-content">
          <Switch>
            <Route path="/settings/profile" render={()=><SettingProfile {...{loginUser, updateLoginUser}} />} />
            <Route path="/settings/password" render={()=><SettingPassword {...{loginUser}} />} />
            <Route render={()=><div>ページが存在しません</div>} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ loginUser: state.loginUser }),
  { updateLoginUser: loginUserActions.updateLoginUser }
)(SettingMain)
