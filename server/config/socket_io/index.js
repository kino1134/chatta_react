import { createClient } from 'redis'
import socketIo from 'socket.io'
import socketRedis from 'socket.io-redis'
import { redis } from '../'

export default () => {
  const io = socketIo()

  // scaling
  const pub = createClient({ host: redis.host, port: redis.port, password: redis.password })
  const sub = createClient({ host: redis.host, port: redis.port, password: redis.password })
  io.adapter(socketRedis({ pubClient: pub, subClient: sub }))

  // TODO: Test Code
  io.on('connection', function (socket) {
    console.log('connected socket')

    socket.on('disconnect', function () {
      console.log('disconnected socket')
    })
  })

  return io
}
