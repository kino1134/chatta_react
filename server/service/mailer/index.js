import mailer from '@sendgrid/mail'
import ejs from 'ejs'
import path from 'path'
import fs from 'fs'

import { sendgrid } from '../../config'

export default {
  send ({ to, subject, text, html }) {
    if (sendgrid.enabled === 'false') {
      console.log(text)
      console.log(html)
      return true
    }

    mailer.setApiKey(sendgrid.apiKey)

    const from = 'test@example.com'
    const message = {
      from, to, subject: (subject || '') + ' - chatta'
    }
    if (text) message.text = text
    if (html) message.html = html

    mailer.send(message)
  },

  render (fileName, data) {
    const filePath = path.join(process.cwd(), 'server/views', fileName)
    return ejs.compile(fs.readFileSync(filePath, 'utf-8'))(data)
  }
}
