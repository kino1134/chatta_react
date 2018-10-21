import socketIo from 'socket.io'
import socketRedis from 'socket.io-redis'
import { redis } from '../'

export default (createClient) => {
  const io = socketIo()

  // 裏にRedisを設けて、APIからのemit、およびスケーリングを行う
  const pub = createClient({ host: redis.host, port: redis.port, password: redis.password })
  const sub = createClient({ host: redis.host, port: redis.port, password: redis.password })
  io.adapter(socketRedis({ pubClient: pub, subClient: sub }))

  io.on('connection', function (socket) {
    // 各ユーザの入力状況を共有する
    socket.on('typing', function (displayName) {
      socket.broadcast.emit('typing', { displayName })
    })
    socket.on('stop_typing', function (displayName) {
      socket.broadcast.emit('stop_typing', { displayName })
    })

    socket.on('disconnect', function () {
      // console.log('disconnected socket')
    })
  })

  return io
}
