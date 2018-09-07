import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import Login from './modules/Login'
import SignUp from './modules/SignUp'
import OAuthCallback from './modules/OAuthCallback'
import Trial from './modules/Trial'

ReactDOM.render((
  <BrowserRouter basename="/authenticate">
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/signup" component={ SignUp } />
      <Route exact path="/oauth/callback/:provider" component={ OAuthCallback } />
      <Route exact path="/trial" component={ Trial } />
      <Route component={ Login } />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
