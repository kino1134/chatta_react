import { check } from 'express-validator/check'

const content = check('content').trim()
  .not().isEmpty().withMessage('必須です。')

const last = check('last').trim()
  .optional().isMongoId().withMessage('形式が正しくありません')

const id = check('id').trim()
  .isMongoId().withMessage('形式が正しくありません')

export const getValidator = [ last ]
export const updateValidator = [ id, content ]
export const idValidator = [ id ]
export default [ content ]
