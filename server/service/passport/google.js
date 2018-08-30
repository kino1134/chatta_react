import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import config from '../../config'

const googleConfig = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.client.uri + config.api.root + '/auth/google',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}
const googleLogin = (accessToken, refreshToken, profile, done) => {
  // TODO: Create User
  console.log(profile)
  return done(null, profile)
}
passport.use(new GoogleStrategy(googleConfig, googleLogin))
export const google = (opts) => {
  const option = {
    session: false,
    scope: ['openid', 'email', 'profile']
  }
  return passport.authenticate('google', Object.assign(option, opts))
}
