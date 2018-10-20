import { check } from 'express-validator/check'

const content = check('content').trim()
  .not().isEmpty().withMessage('必須です。')

const last = check('last').trim()
  .optional().isMongoId().withMessage('形式が正しくありません')

const id = check('id').trim()
  .isMongoId().withMessage('形式が正しくありません')

const file = check('attachFile').custom((_, { req }) => {
  return req.file
}).withMessage('ファイルが添付されていません')

export const getValidator = [ last ]
export const updateValidator = [ id, content ]
export const idValidator = [ id ]
export const uploadValidator = [ content, file ]
export default [ content ]
