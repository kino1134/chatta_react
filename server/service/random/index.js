import crypto from 'crypto'

const idChars = '0123456789' + 'abcdefghijklmnopqrstuvwxyz' + '_'
const passwordChars = idChars + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '-'

const random = (size) => crypto.randomBytes(size)

// 文字種をすべてカバーする最小のマスク値を決定する
const calcParams = (chars) => {
  const length = chars.length
  if (length <= 1) throw new Error('invalid chars')

  let mask = 1
  while (length > mask) mask <<= 1
  return { mask: mask - 1, length: length }
}

const randomString = (size, chars) => {
  if (size <= 0) return ''

  const params = calcParams(chars)

  let id = ''
  random(size).forEach(v => {
    const index = v & params.mask
    // マスクした結果、文字種の長さに収まっていた場合は結果に加える
    if (index < params.length) id += chars[index]
  })

  // 足りない分は再度取得する
  return id + randomString(size - id.length, chars)
}

export const randomId = (size) => randomString(size, idChars)
export const randomPassword = (size) => randomString(size, passwordChars)
