import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import './index.auth.css'

import Login from './modules/Login'
import SignUp from './modules/SignUp'
import PasswordInit from './modules/PasswordInit'
import OAuthCallback from './modules/OAuthCallback'

// TODO: 404ページは設けたほうがいい？
ReactDOM.render((
  <BrowserRouter basename="/authenticate">
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/signup" component={ SignUp } />
      <Route exact path="/password-init" component={ PasswordInit } />
      <Route exact path="/oauth/callback/:provider" component={ OAuthCallback } />
      <Route component={ Login } />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
