import mongoose from 'mongoose'
import { validationResult } from 'express-validator/check'
import { env } from '../../config'

export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity)
  }
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).json({ message: '対象が見つかりませんでした' }).end()
  return null
}

export const validate = (checkList, message) => {
  const handler = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ message, errors: errors.array() }).end()
    } else {
      next()
    }
  }

  checkList = checkList || []
  return [...checkList, handler]
}

export const errorHandler = (err, req, res, next) => {
  logerror(err)

  const message = env === 'development' ? err.stack : err.message

  let code = 500
  if (err instanceof mongoose.Error.CastError) {
    code = 400
  }

  res.status(code).json({ type: err.name, message: message })
}

const logerror = (err) => {
  if (env !== 'test') console.error(err.stack || err.toString())
}

// export const authorOrAdmin = (res, user, userField) => (entity) => {
//   if (entity) {
//     const isAdmin = user.role === 'admin'
//     const isAuthor = entity[userField] && entity[userField].equals(user.id)
//     if (isAdmin || isAuthor) {
//       return entity
//     }
//     res.status(401).end()
//   }
//   return null
// }
