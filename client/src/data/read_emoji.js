/*
 * コンソールから直接叩いて、JSONファイルを生成する
*/
const fs = require('fs')
const path = require('path')
const request = require('request')

// 文字コードから絵文字を生成する
function toEmoji (unified) {
  return String.fromCodePoint(...unified.split('-').map(s => parseInt(s, 16)))
}

const url = 'https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json'
request.get(url, function (error, response, body) {
  // twemojiで提供しているものに絞る。また、肌色は使わない
  const json = JSON.parse(body)
    .filter(data => data.has_img_twitter)
    .filter(data => data.category !== 'Skin Tones')

  // markdown-it-emoji向けのJSONファイルを生成
  const emoji = {}
  json.forEach(data => {
    data.short_names.forEach(n => emoji[n] = toEmoji(data.unified))
  })
  fs.writeFileSync(path.join(__dirname, './emoji.json'), JSON.stringify(emoji), 'utf8')

  // Picker向けのJSONファイルを生成
  json.sort((a, b) => {
    const c = a.category.localeCompare(b.category)
    return c !== 0 ? c : a.sort_order - b.sort_order
  })
  const picker = json.map(data => {
    return {
      char: toEmoji(data.unified),
      name: data.short_name,
      names: data.short_names,
      category: data.category,
      sort_order: data.sort_order
    }
  })
  fs.writeFileSync(path.join(__dirname, './picker.json'), JSON.stringify(picker), 'utf8')
})
