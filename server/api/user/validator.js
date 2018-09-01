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

export default [ userId, displayName, email ]
