import express from 'express'
// import session from 'express-session'
// import connectRedis from 'connect-redis'

import helmet from 'helmet'
import cors from 'cors'
// import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import handler from './handler'
import { env, api } from '../'

export default (root, routes) => {
  const app = express()

  if (env === 'production' || env === 'development') {
    app.use(helmet())
    app.use(cors({ origin: api.corsOrigin }))
    // 圧縮は必要性が感じられるまでコメントアウト
    // app.use(compression())
    app.use(morgan('dev'))
  }

  // TODO: Cookieのドメインが違う場合にチェックが通らなくなるので、一旦使わない
  // ソーシャルログイン時、stateチェックを行うために使用
  // const RedisStore = connectRedis(session)
  // const store = new RedisStore({
  //   host: redis.host,
  //   port: redis.port,
  //   pass: redis.password
  // })
  // app.use(session({
  //   secret: api.sessionSecret,
  //   resave: false,
  //   saveUninitialized: false,
  //   store }))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(root, routes)
  app.use(handler.routeNotFound)
  app.use(handler.error(env))

  return app
}
