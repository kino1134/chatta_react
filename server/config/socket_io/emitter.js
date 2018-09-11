import { createClient } from 'redis'
import emitter from 'socket.io-emitter'
import { redis } from '../'

export default emitter(createClient({
  host: redis.host,
  port: redis.port,
  password: redis.password
}))
