import crypto from 'crypto'

const idChars = '0123456789' + 'abcdefghijklmnopqrstuvwxyz' + '_'
const passwordChars = idChars + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '-'

const random = (size) => crypto.randomBytes(size)

// 文字種の数、マスク値を決定する
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

  let ret = ''
  random(size).forEach(v => {
    // ランダム値をマスクして、文字種を取得するインデックスに変換する
    const index = v & params.mask
    // インデックスが文字種の長さに収まっていた場合は結果に加える
    if (index < params.length) ret += chars[index]
  })

  // 足りない分は再度取得する
  return ret + randomString(size - ret.length, chars)
}

export const randomId = (size) => randomString(size, idChars)
export const randomPassword = (size) => randomString(size, passwordChars)
