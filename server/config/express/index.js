import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'

import helmet from 'helmet'
// import forceSSL from 'express-force-ssl'
// import cors from 'cors'
// import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { env, api, redis } from '../'
import { errorHandler } from '../../service/response'

export default (root, routes) => {
  const app = express()

  if (env === 'production') {
    // SSL化は前にいる人(LBとか)がやってくれるんじゃないかなぁ
    // app.set('forceSSLOptions', {
    //   enable301Redirects: false,
    //   trustXFPHeader: true
    // })
    // app.use(forceSSL)
  }

  if (env === 'production' || env === 'development') {
    app.use(helmet())
    // CORS、圧縮は必要性が感じられるまでコメントアウト
    // app.use(cors())
    // app.use(compression())
    app.use(morgan('dev'))
  }

  // ソーシャルログイン時、stateチェックを行うために使用
  const RedisStore = connectRedis(session)
  const store = new RedisStore({
    host: redis.host,
    port: redis.port
  })
  app.use(session({
    secret: api.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store }))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(root, routes)
  app.use(errorHandler)

  return app
}
