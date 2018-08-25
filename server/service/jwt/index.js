import jwt from 'jsonwebtoken'
import config from '../../config'

export const signSync = (payload, opts) => {
  const option = {
    expiresIn: config.jwt.expire
  }

  return jwt.sign(payload, config.jwt.secret, Object.assign(option, opts))
}

export const sign = (payload, opts) => {
  return new Promise(resolve => resolve(signSync(payload, opts)))
}
