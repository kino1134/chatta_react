import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { Strategy as GitHubStrategy } from 'passport-github'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from '../../config'

// Login by Google
const googleConfig = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.api.uri + config.api.root + '/auth/google',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}
const googleLogin = (accessToken, refreshToken, profile, done) => {
  // TODO: Create User
  console.log(profile)
  return done(null, profile)
}
passport.use(new GoogleStrategy(googleConfig, googleLogin))
export const google = (opts) => {
  const config = {
    session: false,
    scope: ['openid', 'email', 'profile']
  }
  return passport.authenticate('google', Object.assign(config, opts))
}

// Login by Github
const githubConfig = {
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.api.uri + config.api.root + '/auth/github',
  scope: ['read:user', 'user:email']
}
const githubLogin = (accessToken, refreshToken, profile, done) => {
  // TODO: Create User
  console.log(accessToken)
  console.log(profile)
  return done(null, profile)
}
passport.use(new GitHubStrategy(githubConfig, githubLogin))
export const github = (opts) => {
  const config = {
    session: false
  }
  return passport.authenticate('github', Object.assign(config, opts))
}

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
