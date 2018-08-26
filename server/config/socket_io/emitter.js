import emitter from 'socket.io-emitter'
import { redis } from '../'

export default emitter({host: redis.host, port: redis.port})
