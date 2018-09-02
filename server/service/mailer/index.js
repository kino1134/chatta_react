import mailer from '@sendgrid/mail'

export default ({ to, subject, text, html }) => {
  mailer.setApiKey(process.env.SENDGRID_API_KEY)

  const from = 'test@example.com'
  const message = {
    from, to, subject
  }
  if (text) message.text = text
  if (html) message.html = html

  mailer.send(message)
}
