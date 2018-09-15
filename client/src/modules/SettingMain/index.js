import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import './index.css'

import SettingHeader from '../SettingHeader'
import SettingProfile from '../SettingProfile'
import SettingPassword from '../SettingPassword'

class SettingMain extends Component {
  // TODO: 404の考慮
  render () {
    const { loginUser } = this.props

    return (
      <div id="setting-main" className="container is-fluid">
        <SettingHeader {...{loginUser}} />
        <div className="setting-content">
          <Switch>
            <Route path="/settings/profile" component={ SettingProfile } />
            <Route path="/settings/password" render={()=><SettingPassword {...{loginUser}} />} />
            <Route component={ SettingProfile } />
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ loginUser: state.loginUser })
)(SettingMain)
