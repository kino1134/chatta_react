import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import LoginCheck from './modules/LoginCheck'
import RoomMain from './modules/RoomMain'
import SettingMain from './modules/SettingMain'
import NotFound from './modules/NotFound'

import reducer from './reducers'

const store = createStore(reducer)

ReactDOM.render((
  <BrowserRouter>
    <Provider store={store}>
      <LoginCheck>
        <Switch>
          <Route exact path="/" component={ RoomMain } />
          <Route path="/settings" component={ SettingMain } />
          <Route component={ NotFound } />
        </Switch>
      </LoginCheck>
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker()
