import redis from 'redis-mock'

export const createClient = redis.createClient
export default redis
