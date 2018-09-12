import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import User from '../../model/User'
import config from '../../config'

const googleConfig = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.client.uri + '/authenticate/oauth/callback/google',
  state: true,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}
const googleLogin = (accessToken, refreshToken, profile, done) => {
  return User.createFromService(profile)
    .then(user => done(null, user))
    .catch(err => done(err, null))
}
passport.use(new GoogleStrategy(googleConfig, googleLogin))
export const google = (opts) => {
  const option = {
    session: false,
    scope: ['openid', 'email', 'profile']
  }
  return passport.authenticate('google', Object.assign(option, opts))
}
