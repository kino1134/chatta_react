import { check } from 'express-validator/check'

const content = check('content').trim()
  .not().isEmpty().withMessage('必須です。')

export default [ content ]
