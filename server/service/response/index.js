import mongoose from 'mongoose'

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
  res.status(404).end()
  return null
}

// エラー処理は暫定
export const error = (res, next) => (err) => {
  if (err instanceof mongoose.Error.CastError) {
    console.log(err.message)
    res.json({ message: err.message }).status(400).end()
  } else {
    next()
  }
}

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
