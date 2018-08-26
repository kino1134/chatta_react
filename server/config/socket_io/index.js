import socketIo from 'socket.io'
import socketRedis from 'socket.io-redis'
import { redis } from '../'

export default () => {
  const io = socketIo()

  // scaling
  io.adapter(socketRedis({
    host: redis.host,
    port: redis.port
  }))

  // TODO: Test Code
  io.on('connection', function (socket) {
    console.log('connected socket')

    socket.on('disconnect', function () {
      console.log('disconnected socket')
    })
  })

  return io
}
