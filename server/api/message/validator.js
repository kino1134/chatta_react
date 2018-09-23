import { check } from 'express-validator/check'

const content = check('content').trim()
  .not().isEmpty().withMessage('必須です。')

const id = check('last').trim()
  .optional().isMongoId().withMessage('形式が正しくありません')

const editId = check('id').trim()
  .isMongoId().withMessage('形式が正しくありません')

export const getValidator = [ id ]
export const updateValidator = [ editId, content ]
export const destroyValidator = [ editId ]
export default [ content ]
