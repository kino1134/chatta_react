export const openPopup = (url) => {
  const width = 500
  const height = 600
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2

  const popup = window.open(url, 'oauth_login',
    `width=${width},height=${height},left=${left},top=${top}`)

  return popup
}

export const listenPopup = async (popup, resolve, reject) => {
  if (!resolve) {
    // はじめにPromiseでくるむ
    return new Promise((resolve, reject) => {
      listenPopup(popup, resolve, reject)
    })
  } else {
    // 認証情報の取得
    // same origin policyの回避のため、エラーは握りつぶす
    let token
    try {
      const form = popup.document.forms.auth
      token = form.token.value
    } catch (err) {}

    if (token) {
      // 取得できた場合
      popup.close()
      resolve({ token })
    } else if (popup.closed) {
      // 取得前にポップアップを閉じてしまった場合
      reject({ errors: "Authenticated was cancelled." })
    } else {
      // それ以外の場合は待つ
      setTimeout(() => {
        listenPopup(popup, resolve, reject)
      }, 0)
    }
  }
}
