import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../../model/User'

const strategyConfig = {
  usernameField: 'userId',
  session: false
}
const passwordLogin = (userId, password, done) => {
  User.findOne({ userId }).then(user => {
    if (!user) return done(null, false)
    user.authenticate(password)
      .then(user => done(null, user))
      .catch(err => done(err, null))
  }).catch(err => done(err, null))
}
passport.use(new LocalStrategy(strategyConfig, passwordLogin))
export const password = (opts) => (req, res, next) => {
  const option = { session: false }
  return passport.authenticate('local', Object.assign(option, opts), (err, user, info) => {
    if (err) {
      return res.status(401).json(err)
    }
    if (!user) {
      return res.status(401).json({ message: 'ログインに失敗しました。' })
    }
    req.login(user, { session: false }, err => {
      if (err) res.status(401).json(err)
      next()
    })
  })(req, res, next)
}
