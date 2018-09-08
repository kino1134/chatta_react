import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import LoginCheck from './modules/LoginCheck'
import Main from './modules/Main'
import reducer from './reducers'

const store = createStore(reducer)

// TODO: 404ページは設けたほうがいい？
ReactDOM.render((
  <BrowserRouter>
    <Provider store={store}>
      <LoginCheck>
        <Switch>
          <Route exact path="/" component={ Main } />
          <Route component={ Main } />
        </Switch>
      </LoginCheck>
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
