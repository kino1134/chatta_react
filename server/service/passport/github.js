import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import User from '../../model/User'
import config from '../../config'

const githubConfig = {
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.client.uri + '/authenticate/oauth/callback/github',
  // state: true,
  scope: ['read:user', 'user:email']
}
const githubLogin = (accessToken, refreshToken, profile, done) => {
  return User.createFromService(profile)
    .then(user => done(null, user))
    .catch(err => done(err, null))
}
passport.use(new GitHubStrategy(githubConfig, githubLogin))
export const github = (opts) => {
  const option = {
    session: false
  }
  return passport.authenticate('github', Object.assign(option, opts))
}
