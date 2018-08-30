import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import config from '../../config'

const githubConfig = {
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.client.uri + config.api.root + '/auth/github',
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
  const option = {
    session: false
  }
  return passport.authenticate('github', Object.assign(option, opts))
}
