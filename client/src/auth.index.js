import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Authenticate from './Authenticate'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<Authenticate />, document.getElementById('root'))
registerServiceWorker()
