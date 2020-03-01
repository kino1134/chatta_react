import sg from '@sendgrid/mail'
import nock from 'nock'
import mailer from '.'

import { sendgrid } from '../../config'

let send
beforeEach(() => {
  nock('https://api.sendgrid.com')
    .filteringRequestBody(() => '*')
    .post('/v3/mail/send', '*')
    .reply(202)
  send = jest.spyOn(sg, 'send')
})

describe('render', () => {
  it('singUp', () => {
    const data = {
      user: {displayName: 'なまえ', userId: 1234},
      password: 'Password1'
    }
    expect(mailer.render('signUp.ejs', data)).toMatchSnapshot()
  })

  it('passwordInit', () => {
    const data = {
      user: {displayName: 'なまえ', userId: 1234},
      password: 'newPassword'
    }
    expect(mailer.render('passwordInit.ejs', data)).toMatchSnapshot()
  })
})

describe('send', () => {
  const data = {
    to: 'to@example.co.jp',
    subject: 'title',
    text: 'テキスト',
    html: '<p>paragraph</p>'
  }

  it('check bodyLog', async () => {
    const log = jest.spyOn(console, 'log')
    await mailer.send(data)
    expect(log).toBeCalledWith(data.text)
    expect(log).toBeCalledWith(data.html)
  })

  it('check content', async () => {
    sendgrid.enabled = true
    const res = await mailer.send(data)
    expect(res[0].statusCode).toBe(202)
    expect(send).toBeCalledWith(expect.objectContaining({
      to: data.to,
      text: data.text,
      html: data.html,
      subject: data.subject + ' - chatta'
    }))
  })
})
