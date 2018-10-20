const crypto = jest.genMockFromModule('crypto')

crypto.randomBytes = (size) =>
  Array(size).fill(size)

export default crypto
