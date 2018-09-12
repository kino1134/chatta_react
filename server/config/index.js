import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'development'

// Load .env per NODE_ENV
dotenv.config({ path: '.env.' + env })

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
  env: env,
  api: {
    port: process.env.API_PORT || 3003,
    ip: process.env.API_IP || '0.0.0.0',
    root: process.env.API_ROOT || '/api',
    sessionSecret: process.env.API_SESSION_SECRET || 'keyboard cat',
    corsOrigin: (process.env.API_CORS_ORIGIN || 'http://localhost:3000 http://localhost').split(' ')
  },
  client: {
    uri: process.env.CLIENT_URI || 'http://localhost:3000'
  },
  socket: {
    port: process.env.SOCKET_PORT
  },
  mongo: {
    uri: required('MONGO_URI'),
    user: required('MONGO_USER'),
    password: required('MONGO_PASSWORD'),
    debug: process.env.MONGO_DEBUG || true
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  },
  jwt: {
    secret: required('JWT_SECRET_KEY'),
    expire: required('JWT_EXPIRES_IN')
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy'
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'dummy',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy'
  },
  sendgrid: {
    enabled: process.env.SENDGRID_ENABLED || 'true',
    apiKey: process.env.SENDGRID_API_KEY || 'dummy'
  }
}

module.exports = config
export default module.exports
