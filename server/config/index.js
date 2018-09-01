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
    uri: process.env.API_URI || 'http://localhost:3003',
    sessionSecret: process.env.API_SESSION_SECRET || 'keyboard cat'
  },
  client: {
    uri: process.env.CLIENT_URI || 'http://localhost:3000',
    auth: process.env.CLIENT_AUTH || '/authenticate'
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
  },
  jwt: {
    secret: required('JWT_SECRET_KEY'),
    expire: required('JWT_EXPIRES_IN')
  },
  google: {
    clientId: required('GOOGLE_CLIENT_ID'),
    clientSecret: required('GOOGLE_CLIENT_SECRET')
  },
  github: {
    clientId: required('GITHUB_CLIENT_ID'),
    clientSecret: required('GITHUB_CLIENT_SECRET')
  }
}

module.exports = config
export default module.exports
