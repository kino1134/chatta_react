import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import LoginCheck from './modules/LoginCheck'
import App from './modules/App'

ReactDOM.render((
  <BrowserRouter>
    <LoginCheck>
      <Switch>
        <Route exact path="/"component={ App } />
        <Route component={ App } />
      </Switch>
    </LoginCheck>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
