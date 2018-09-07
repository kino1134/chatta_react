import io from 'socket.io-client'

import config from '../constants'

const socket = io.connect(config.socket.uri, {
  autoConnect: false
})

export default socket
