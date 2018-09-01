import { check } from 'express-validator/check'

const userId = check('userId')
  .not().isEmpty().withMessage('必須です。')

const password = check('password')
  .not().isEmpty().withMessage('必須です。')

export default [ userId, password ]
