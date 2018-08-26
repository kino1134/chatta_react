import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import Login from './Login'
import Trial from './Trial'

ReactDOM.render((
  <BrowserRouter basename="/authenticate">
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/trial" component={ Trial } />
      <Route component={ Login } />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
