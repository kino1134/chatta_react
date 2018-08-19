## やったこと
* バックエンドAPIサーバの環境整備
* サンプルAPIの追加

## やりたいこと
* Expressのエラーハンドラ追加
  * http://expressjs.com/ja/guide/error-handling.html
* APIからSocketサーバに対してのイベント発行
  * https://github.com/socketio/socket.io-emitter
  * https://socket.io/docs/rooms-and-namespaces/#Sending-messages-from-the-outside-world
* ソーシャルログインの追加(Google, Github)  
  SPAの場合、すべてブラウザ側の実装でトークンを取得するはずなので、Implicit Flowになる。  
  http://openid-foundation-japan.github.io/openid-connect-core-1_0.ja.html#ImplicitFlowAuth
* 認証/認可フィルターの追加
* パスワードユーザの登録APIの追加
* 動作確認用HTMLの追加（あとで消すけど）
* ロギング(各ライブラリの説明を読む感じ、そんなに準備されてないようなので後回しかも)
* クライアント(React)の追加
  まずは、create-react-appから始める  
  https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#integrating-with-an-api-backend  
  ※全体的にとても勉強になる内容だと感じたので、随時反映していきたい

## 作業履歴

### 参考にしたボイラープレート
* https://github.com/diegohaz/rest
* https://github.com/babel/example-node-server
* https://github.com/vmasto/express-babel

### Node.js のバージョン
eslintの要件が厳しくて、少し古いバージョンでは動かなかったので最新LTSを導入
```
brew install yarn
brew install nodebrew
nodebrew install-binary v8.11.4
nodebrew use v8.11.4
```

### ESLintの初期設定
```
$ yarn run eslint --init

yarn run v1.9.4
$ ./node_modules/.bin/eslint --init
? How would you like to configure ESLint? Use a popular style guide
? Which style guide do you want to follow? Standard (https://github.com/standard/standard)
? What format do you want your config file to be in? JavaScript
```
