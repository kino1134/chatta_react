import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import LoginCheck from './modules/LoginCheck'
import Main from './modules/Main'
import App from './modules/App'
import reducer from './reducers'

const store = createStore(reducer)

ReactDOM.render((
  <BrowserRouter>
    <Provider store={store}>
      <LoginCheck>
        <Switch>
          <Route exact path="/"component={ Main } />
          <Route component={ App } />
        </Switch>
      </LoginCheck>
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
