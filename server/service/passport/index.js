import passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth'
import config from '../../config'

// Login by Google
const googleConfig = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  // TODO: ちゃんとしたAPIにする
  callbackURL: config.api.uri + config.api.root + '/hellos/callback',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}
const googleLogin = (accessToken, refreshToken, profile, done) => {
  // TODO: Create User & Create Token
  console.log(profile)
  return done(null, profile)
}
passport.use(new OAuth2Strategy(googleConfig, googleLogin))
export const google = (opts) => {
  return passport.authenticate('google', Object.assign({session: false}, opts))
}
