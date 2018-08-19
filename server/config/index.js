import dotenv from 'dotenv'

// Load .env
const result = dotenv.config()
if (result.error) {
  throw result.error
}

// 環境変数の読み込み（必須チェック付き）
const required = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

const config = {
  env: process.env.NODE_ENV || 'development',
  api: {
    port: process.env.API_PORT || 3003,
    ip: process.env.API_IP || '0.0.0.0',
    root: process.env.API_ROOT || '/api'
  },
  socket: {
    port: process.env.SOCKET_PORT || 3033
  },
  mongo: {
    uri: required('MONGO_URI'),
    user: required('MONGO_USER'),
    password: required('MONGO_PASSWORD'),
    debug: process.env.MONGO_DEBUG || true
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
}

module.exports = config
export default module.exports
