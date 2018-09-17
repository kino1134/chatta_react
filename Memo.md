## やったこと（サーバ側）
* バックエンドAPIサーバの環境整備
* サンプルAPIの追加
* ExpressのミドルウェアにRest API用のカスタムエラーハンドラを追加
  * http://expressjs.com/ja/guide/error-handling.html
  * https://github.com/pillarjs/finalhandler
* ソーシャルログインの追加(Google, GitHub)  
  Implicit Flow だとリプレイ攻撃しやすくなるらしいので、普通にサーバも使って認証する  
  https://qiita.com/uryyyyyyy/items/56f9a80a829161ae1f8e  
  https://auth0.com/blog/jp-reactjs-authentication-tutorial
* 認証/認可フィルターの追加
* APIからSocketサーバに対してのイベント発行
  * https://github.com/socketio/socket.io-emitter
  * https://socket.io/docs/rooms-and-namespaces/#Sending-messages-from-the-outside-world
* サーバとクライアントの起動同期  
  https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/#concurrently
* ローカルパスワードによるログイン
* パスワードユーザの登録APIの追加
* 初期パスワード通知
* 各種サービスにデプロイする  
  Netlify、now、MongoDB Atlas、Redislabs、SendGridを使ってみた

## やったこと（クライアント側）
* クライアント(React)の環境整備  
  まずは、create-react-appから始める  
  https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#integrating-with-an-api-backend  
  ※全体的にとても勉強になる内容だと感じたので、随時反映していきたい
* react-app-rewired 投入  
  ログイン前とログイン後でエントリポイントを分けてみたかった
* node-sass 投入
* Bulma 投入
* React-Router 投入  
  https://qiita.com/park-jh/items/b4c7b16ea9eb0cf44942
* クライアント側の認証フィルタ  
  ソーシャルログインをするのでそのままは使えないと思うけど  
  https://reacttraining.com/react-router/web/example/auth-workflow  
  https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
* Redux or MobX 投入  
  結局Reduxを入れた。ただ、まだログインユーザの情報を管理しているだけ。
  https://qiita.com/mpyw/items/a816c6380219b1d5a3bf
* ログアウト
* 「〇〇さんが入力しています」通知
* パスワード変更画面
* パスワードリセット
* ユーザプロフィール編集
* 画面ごとのタイトル変更
* ローディング表示をちゃんとする


## 追加したい機能(Issue使えって話しではあるんだが :sweat_smile: )
* travis正常化
* 404の表示
* API処理中の表示処理を共通化
* 最新N件取得＆スクロールアップによる追加取得
* 未読・既読
* チャンネル機能
* ダイレクトメッセージ
* TODO消す
* ファイル添付
* 投稿後のメッセージ編集
* 通知
* 絵文字表示 :+1:

## 整備したい基盤
* ロギング(各ライブラリの説明を読む感じ、そんなに準備されてないようなので後回しかも)
* manifest.json とはなんなのか？

* https://ramdajs.com/docs/

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

### nginx
Homebrew で入れた時の設定ファイル `/usr/local/etc/nginx/nginx.conf`

複数エントリポイントがある時でも、そんなに複雑な設定をしなくていいみたい
https://qiita.com/oshiro/items/39aaed7cc2e33ce25eeb
