import io from 'socket.io-client'

const socket = io.connect('http://localhost:3033', {
  autoConnect: false
})

export default socket
