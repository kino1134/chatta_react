import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from '../../config'

// Authenticate by Token
const jwtConfig = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ])
}
const jwtAuth = (payload, done) => {
  // TODO: Find User
  console.log(payload)
  return done(null, payload)
}
passport.use(new JwtStrategy(jwtConfig, jwtAuth))
export const token = (opts) => {
  const config = {
    session: false
  }
  return passport.authenticate('jwt', Object.assign(config, opts))
}
