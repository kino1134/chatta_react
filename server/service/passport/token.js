import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from '../../config'
import User from '../../model/User'

// Authenticate by Token
const jwtConfig = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ])
}
const jwtAuth = ({ id }, done) => {
  return User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
}
passport.use(new JwtStrategy(jwtConfig, jwtAuth))
export const token = ({ required = true, roles = User.roles } = {}) => {
  return (req, res, next) => {
    const auth = passport.authenticate('jwt', { session: false }, (err, user, info) => {
      // ユーザ情報の取得に失敗、または権限がなかった場合
      if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
        res.status(401).json({ message: '認証できませんでした。' })
        return null
      }

      // passportのログイン処理を呼び出す
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          res.status(401).json({ message: 'エラーが発生しました。' })
          return null
        }
        next()
      })
    })

    return auth(req, res, next)
  }
}
