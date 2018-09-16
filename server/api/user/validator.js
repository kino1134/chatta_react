import validator from 'validator'
import { check } from 'express-validator/check'

const userId = check('userId').trim()
  .not().isEmpty().withMessage('必須です。')
  .matches(/^[0-9A-Z_]+$/i).withMessage('使用できない文字が含まれています。')
  .isLength({ max: 8 }).withMessage('8文字以下で入力してください。')

const displayName = check('displayName').trim()
  .not().isEmpty().withMessage('必須です。')

const email = check('email').trim()
  .not().isEmpty().withMessage('必須です。')
  .custom((value) => value ? validator.isEmail(value) : true).withMessage('形式が間違っています。')

const photo = check('photo').trim()
  .isURL({ protocols: ['http', 'https'], require_protocol: true, allow_underscores: true }).withMessage('URL形式で入力してください')
export const updatePasswordValidator = [
  check('current').trim()
    .not().isEmpty().withMessage('必須です'),
  check('newer').trim()
    // https://qiita.com/mpyw/items/886218e7b418dfed254b
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/).withMessage('条件を満たしていません'),
  check('confirm').trim()
    .custom((value, { req }) => value === req.body.newer).withMessage('パスワードが一致していません')
]

export const initPasswordValidator = [
  check('email').trim().not().isEmpty().withMessage('必須です。'),
  check('userId').trim().not().isEmpty().withMessage('必須です。')
]

export const updateProfileValidator = [
  displayName, email, userId, photo
]

export default [ userId, displayName, email ]
