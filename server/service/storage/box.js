import BoxSdk from 'box-node-sdk'

const getClient = () => {
  const sdk = new BoxSdk({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET,
    appAuth: {
      keyID: process.env.BOX_KEY_ID,
      privateKey: process.env.BOX_PRIVATE_KEY.replace(/\\n/g, '\n'),
      passphrase: process.env.BOX_PASSPHRASE
    }
  })
  return sdk.getAppAuthClient('enterprise', process.env.BOX_ENTERPRISE_ID)
}

export const example = () => {
  return getClient().folders.get('0')
}
