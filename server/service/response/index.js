import { validationResult } from 'express-validator/check'

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
