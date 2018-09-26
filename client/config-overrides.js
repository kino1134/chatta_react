// Override react-script webpack conifg to @1.1.4

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const paths = require('react-scripts/config/paths')

const authIndexJs = 'index.auth.js'
const authIndexHtml = 'authenticate/index.html'

const setEntry = function (config, env) {
  const defaultEntry = config.entry.slice(0)
  const authEntry = config.entry.slice(0)

  const srcIndex = authEntry.findIndex(e => e === paths.appIndexJs)
  authEntry[srcIndex] = path.join(paths.appSrc, authIndexJs)

  // IE11でreact-routerが動かなかったので、polyfillを入れてみる
  // TODO: これだけで20KBくらいあったので、ホントは抜くか厳選したい
  config.entry = {
    main: ['babel-polyfill', ...defaultEntry],
    auth: ['babel-polyfill', ...authEntry]
  }
}

const setOutputFileName = function (config, env) {
  if (env === 'development') {
    const temp = config.output.filename
    config.output.filename = temp.replace('/bundle.js', '/[name].js')
  }
}

const getDefaultHtmlPlugin = function (config, env) {
  const index = config.plugins.findIndex(e => e instanceof HtmlWebpackPlugin)
  return [config.plugins[index], index]
}

const setDefaultHtmlPluginChunks = function (config, env) {
  const [htmlPlugin] = getDefaultHtmlPlugin(config, env)
  htmlPlugin.options.chunks = ['common', 'main']
}

const addAuthHtmlPlugin = function (config, env) {
  const [defaultHtmlPlugin, pluginIndex] = getDefaultHtmlPlugin(config, env)

  const authHtmlPlugin = new HtmlWebpackPlugin(Object.assign({}, defaultHtmlPlugin.options, {
    template: path.join(paths.appPublic, authIndexHtml),
    filename: authIndexHtml,
    chunks: ['common', 'auth']
  }))

  config.plugins.splice(pluginIndex + 1, 0, authHtmlPlugin)
}

const setCommonsChunkPlugin = function (config, env) {
  const filename = env === 'production' ? '[name].[hash:8].js' : '[name].js'
  config.plugins.unshift(new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    filename: path.join('static/js', filename)
  }))
}

const getSWPrecacheWebpackPlugin = function (config, env) {
  const index = config.plugins.findIndex(e => e instanceof SWPrecacheWebpackPlugin)
  return [config.plugins[index], index]
}

const clearNavigateFallback = function (config, env) {
  if (env !== 'production') {
    return
  }

  const [plugin] = getSWPrecacheWebpackPlugin(config, env)
  plugin.options.navigateFallback = ''
  plugin.options.navigateFallbackWhitelist = []
}

const setFallback = function (config) {
  config.historyApiFallback = {
    rewrites: [
      { from: /authenticate\/./, to: '/authenticate' },
      { from: /./, to: '/' }
    ]
  }
}

module.exports = {
  webpack: function (config, env) {
    // エントリポイントをメインと認証に分割する
    setEntry(config, env)

    // エントリポイント毎にファイル名を変更する
    setOutputFileName(config, env)

    // メインHTMLに読み込むエントリポイントを指定する
    setDefaultHtmlPluginChunks(config, env)

    // 認証HTMLの設定を追加する
    addAuthHtmlPlugin(config, env)

    // ファイルサイズ抑制のため、共通部分は別ファイルに分割する
    setCommonsChunkPlugin(config, env)

    // Serivce WorkerのFallback機能を無効化する
    clearNavigateFallback(config, env)

    return config
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      // 認証側エントリポイントのフォールバック設定を追加する
      setFallback(config)

      return config
    }
  }
}
