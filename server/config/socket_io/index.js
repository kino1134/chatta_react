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

  return io
}
