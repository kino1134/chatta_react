import bcrypt from 'bcrypt'
import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'
import { randomId, randomPassword } from '../service/random'
import mailer from '../service/mailer'
import { env } from '../config'

const roles = ['user', 'admin']

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    index: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    index: true,
    trim: true
  },
  providerId: {
    type: String,
    index: true
  },
  password: {
    type: String,
    minlength: 8
  },
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  photo: {
    type: String,
    trim: true
  },
  readMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
})

// 保存前にパスワードを暗号化
userSchema.pre('save', function (next) {
  if (!this.password) return next()
  if (!this.isModified('password')) return next()

  const rounds = env === 'test' ? 1 : 9
  bcrypt.hash(this.password, rounds).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  // 表示に使う属性を返す
  view (full) {
    let view = {}
    let fields = ['userId', 'displayName', 'photo']

    if (full) {
      fields = [...fields, 'email', 'createdAt', 'readMessage']
    }

    fields.forEach((field) => { view[field] = this[field] })
    view.password = !!this.password

    return view
  },

  // パスワードによる認証を行う
  authenticate (password) {
    if (!this.password) return Promise.resolve(false)
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
  }
}

userSchema.statics = {
  // 役割表
  roles,

  // ソーシャルログインした時のユーザ情報取得・作成
  createFromService ({ provider, id, emails, displayName, photos }) {
    return this.findOne({ providerId: provider + '_' + id }).then(user => {
      if (user) {
        // 一度ログインした後、元サービスでの変更は反映しない
        return user
      } else {
        const createUserId = () => {
          const userId = randomId(8)
          // IDが重複した場合、再度採番する
          return this.count({ userId }).then(cnt => {
            return cnt === 0 ? userId : createUserId()
          })
        }

        return createUserId().then(userId => {
          const email = emails[0].value
          const photo = photos[0].value
          return this.create({ providerId: provider + '_' + id, userId, email, displayName, photo })
        })
      }
    })
  },

  // パスワードログインした時のユーザ情報取得・作成
  createFromLocal ({ userId, email, displayName }) {
    if (!userId) {
      userId = email.replace(/^(.+)@.+$/, '$1')
    }

    const password = randomPassword(16)
    const hash = crypto.createHash('md5').update(email).digest('hex')
    const photo = `https://gravatar.com/avatar/${hash}?d=identicon`
    return this.create({ userId, email, password, displayName, photo })
      .then(user => {
        mailer.send({
          to: user.email,
          subject: 'サインアップ完了',
          html: mailer.render('signUp.ejs', { user, password })
        })
        return user
      })
  }
}

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
