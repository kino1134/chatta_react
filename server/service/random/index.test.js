import * as random from '.'

jest.mock('crypto')

describe('random', () => {
  it('get Id', () => {
    expect(random.randomId(8)).toBe('88888888')
  })

  it('get Password', () => {
    expect(random.randomPassword(37)).toBe('A'.repeat(37))
  })
})
