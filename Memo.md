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
* travis正常化(org)

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
* 404の表示
* API処理中の表示処理を共通化, API処理後のメッセージ表示を共通化  
  state部分については、 `recompose` を使って外出しした。  
  また、一部処理についても外出しにし、それを画面のコンポーネントから呼び出すことにした。
* 最新N件取得＆スクロールアップによる追加取得
* manifest.json とはなんなのか？  
  https://qiita.com/niusounds/items/03a0c6b313001f52a188#%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%9E%E3%83%8B%E3%83%95%E3%82%A7%E3%82%B9%E3%83%88
* 未読・既読
* 通知
* 投稿後のメッセージ編集・削除
* ファイル添付
* 絵文字表示 :+1:



## 追加したい機能(Issue使えって話しではあるんだが :sweat_smile: )
* 添付ファイルの保存先をMongo以外にも出来るようにする
* サーバ側テストの充実
* クライアント側テストの作成
* チャンネル機能
* ダイレクトメッセージ
* TODO消す

## 整備したい基盤
* ロギング(各ライブラリの説明を読む感じ、そんなに準備されてないようなので後回しかも)
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

### 各ソースの行数を見る

見直しの参考にする
```bash
find server/ client/src/ -type f -and -not -path *.css | xargs wc -l | less
```

## 各種サービスのセットアップ手順

後でまとめているので、内容はちょっとあやふや

### MogoDB Atlas

1. ユーザを作ってサインアップする
1. 「Cluster」を作成する
   * タイプを「M0」にすれば無料で利用可能
   * 各種パラメータは後で変更可能
1. 「CONNECT」から「IP Whitelist」に「0.0.0.0/0」を追加して全開放する
1. 同時に「Connect Your Application」から接続URLをメモしておく
1. 接続用のMongoDBユーザを作成し、ID・パスワードをメモしておく

### redislabs

1. ユーザを作ってサインアップする
1. Databaseを作成する  
   設定は後から変えられるみたい
1. 「Endpoint」「Redis Password」をメモしておく

### SendGird

1. ユーザを作ってサインアップする
1. 確認メールから「Verify」する
1. 「API Key」を作って内容をメモしておく

### netlify

...いろいろやったのでちょっとまとめられない

1. GitHubユーザでサインアップする
1. 「OAuth application」から「Personal access token」を取得してメモする
1. netlify-cli(beta)をローカルにインストールする
1. 初期設定を色々してデプロイ出来るようにする（なにやったっけ？）

### now

1. GitHubユーザでサインアップする
1. Tokenを作って内容をメモしておく
1. now-cliをローカルにインストールする
1. `now secrets` を叩いて、今までメモしてきた秘密情報を打ち込んでいく
1. `now.json` を作成し、デプロイ条件を記載する
1. あわせて、秘密情報として設定内容を環境変数として読み込む設定を記載する

### Travis CI

1. GitHubとの連携を有効化する  
   2018/9 現在、 `travis-ci.org` から `travis-ci.com` への移行期間になっている。  
   どちらと連携したのか注意しておく。
1. travis gem をインストールする(ここにきてRubyかよ！)
1. `travis encrypt` で nowとnetlifyのアクセストークンを暗号化した文字列を作成する
1. `.travis.yml` を作成し、先ほどの文字列をコピーする
1. デプロイスクリプトを記載して、masterブランチへのマージで自動デプロイが走るようにする
   ※なお、テストは最低一つは書かないとデプロイまでいかない
