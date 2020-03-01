import mongoose from 'mongoose'

export default {
  routeNotFound: (req, res, next) => {
    res.status(404).json({ message: 'URLが間違っています' })
  },
  error: (env) =>
    (err, req, res, next) => {
      logerror(err, env)

      const message = env === 'development' ? err.stack : err.message

      let code = 500
      // パラメータをMongoDBのObjectIdに変換できなかった
      if (err instanceof mongoose.Error.CastError) {
        code = 400
      }

      res.status(code).json({ type: err.name, message: message })
    }
}

const logerror = (err, env) => {
  if (env !== 'test') console.error(err.stack || err.toString())
}
