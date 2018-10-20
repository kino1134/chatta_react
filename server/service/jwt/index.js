import jwt from 'jsonwebtoken'
import config from '../../config'

export const signSync = (payload, opts) => {
  const option = {
    expiresIn: config.jwt.expire
  }

  return jwt.sign(payload, config.jwt.secret, Object.assign(option, opts))
}

export const sign = (payload, opts) =>
  new Promise(resolve => resolve(signSync(payload, opts)))

export const verify = (token) =>
  new Promise(resolve => resolve(jwt.verify(token, config.jwt.secret)))
