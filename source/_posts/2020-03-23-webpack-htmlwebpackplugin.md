---
title: Webpack 前端打包工具 - 使用 html-webpack-plugin 生成 HTML 文件
description:
  [
    在之前介紹 Webpack 的各種 loader 時，最後都得手動生成 HTML 文件並引入相關的靜態檔案，這樣不是很矛盾嗎？Webpack 可是自動化工具阿！怎會有這麼個缺陷？不用擔心，那是因為我們還沒使用 html-webpack-plugin 這一個插件，html-webpack-plugin 可以幫助我們指定任意的 HTML 模板，並透過傳遞選項方式，生成對應的 HTML 文件，同時也會將 entry 內的所有靜態文件做引入動作，解決手動引入的困擾。此篇將介紹如何透過 html-webpack-plugin 生成自動引入靜態檔案的 HTML 文件。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-03-23 12:20:45
updated: 2020-03-24 02:10:10
---

## 前言

在之前介紹 Webpack 的各種 loader 時，最後都得手動生成 HTML 文件並引入相關的靜態檔案，這樣不是很矛盾嗎？Webpack 可是自動化工具阿！怎會有這麼個缺陷？不用擔心，那是因為我們還沒使用 html-webpack-plugin 這一個插件，html-webpack-plugin 可以幫助我們指定任意的 HTML 模板，並透過傳遞選項方式，生成對應的 HTML 文件，同時也會將 entry 內的所有靜態文件做引入動作，解決手動引入的困擾。此篇將介紹如何透過 html-webpack-plugin 生成自動引入靜態檔案的 HTML 文件。

## 筆記重點

- html-webpack-plugin 安裝
- html-webpack-plugin 基本使用
- html-webpack-plugin 可傳遞選項
- 補充：使用自帶的 lodash.template 進行撰寫
- 補充：依照 chunk 載入不同檔案

## html-webpack-plugin 安裝

> 套件連結：[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

html-webpack-plugin：

```bash
$ npm install html-webpack-plugin -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```

為了模擬一般開發常見的環境，請同時安裝 css-loader 與 mini-css-extract-plugin 用以處理 CSS 檔案，最後我們會透過 html-webpack-plugin 將這些靜態檔案做自動引入的動作，同時生成以 `templete` 可傳遞選項指定模板的 HTML 文件。

## html-webpack-plugin 基本使用

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── css/
│       │
│       └─── all.css      # CSS 主檔案
│   │
│   └─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli、css-loader、mini-css-extract-plugin、html-webpack-plugin
```

撰寫 CSS 範例：

```css
.text-primary {
  color: #2525b1;
}
```

至 `./src/index.html` 撰寫 HTML 模板範例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1 class="text-primary">Hello World</h1>
  </body>
</html>
```

你可以依照習慣隨意編寫你的 HTML 檔案，且不需要做任何的引入動作，這點在後面會說明，讓我們繼續看下去。

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 載入 html-webpack-plugin (第一步)
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash].css',
    }),
    // 創建實例 (第二步)
    new HtmlWebpackPlugin({
      // 配置 HTML 模板路徑與生成名稱 (第三步)
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
```

我們可以刻意的將打包後的靜態檔案指定放置在不同的資料夾下，同時也須配置 html-webpack-plugin 的 `templete` 與 `filename` 選項，`templete` 選項可將我們 `src/index.html` 檔案作為模板文件，簡單來講就是自動引入靜態檔案的目標文件，而 `filename` 選項則是用來配置目標文件生成時的名稱。

entry 入口處 (`src/main.js`) 引入 CSS 檔案：

```js
import './css/all.css'; // 使用 ESM 方式引入
```

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "build": "webpack --mode development"
  }
}
```

執行編譯指令：

```bash
$ npm run build
```

此時打包生成的 `dist` 資料夾結構應如下：

```plain
webpack-demo/
│
└─── dist/
│   │
│   └─── static/
│       │
│       └─── css
│           │
│           └─── main.f25bdf99993c55b0e375.css
│       │
│       └─── js
│           │
│           └─── main.f25bdf99993c55b0e375.js
│   │
│   └─── index.html
```

查看 `./dist/index.html` 檔案結果：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link href="static/css/main.f25bdf99993c55b0e375.css" rel="stylesheet" />
  </head>

  <body>
    <h1 class="text-primary">Hello World</h1>
    <script type="text/javascript" src="static/js/main.f25bdf99993c55b0e375.js"></script>
  </body>
</html>
```

有沒有覺得很神奇？打包後的 `dist/index.html` 居然自動幫我們引入了所有的靜態檔案，包含 CSS、JavaScript 等等，增加任何位數的 hash 值也都沒問題，html-webpack-plugin 能夠自動去幫我們做辨識，解決手動引入的困擾。

你可能在思考 html-webpack-plugin 的功能就只有這些嗎？當然不只！還有包含類似 ejs 模板語言的編寫方式以及依照 chunk 載入不同檔案等等，這些都將在下面進行補充，一般人最常使用的功能大概就是自動引入靜態資源功能了，其實這個方法是依靠 `inject` 可傳遞選項來完成的，如下所示：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: true, // 預設為 true
    }),
  ],
};
```

## html-webpack-plugin 可傳遞選項

可參考 [html-webpack-plugin Options](https://github.com/jantimon/html-webpack-plugin#options) 可傳遞參數列表，以下為常用的參數配置：

- meta：`Object`
  以 `name`:`content` 方式插入 `meta` 標籤，默認為 `{}`

- favicon：`String`
  添加 favicon 圖示至 HTML，默認為 `""`

範例：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
      favicon: './src/img/favicon.ico',
    }),
  ],
};
```

## 補充：使用自帶的 lodash.template 進行撰寫

在前面有提到 html-webpack-plugin 可使用類似 ejs 模板語言進行撰寫，html-webpack-plugin 官方後台是使用 `lodash.template` 模板語言，你可以把它想像成類似 ejs 的模板語言，但不包含 `include` 等方法。下面為 express 搭配 ejs 模板語言範例：

```js
app.get('/', (req, res) => {
  res.render('index', { title: '這是首頁', content: '這是內容', vip: false });
});
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= title %></title>
  </head>
  <body>
    <p><%= content %></p>
    <% if (vip) { %>
    <p>你是 VIP 用戶</p>
    <% } else { %>
    <p>你不是 VIP 用戶</p>
    <% } %>
  </body>
</html>
```

從上面範例可以看出，ejs 主要可透過相關語法動態載入內容，語法如下：

- `<%= value %>`：將值輸出到模板中 (轉譯成字串)
- `<%- value %>`：將值輸出到模板中 (轉譯成完整片段)
- `<% if () { %>`...`<% } %>`：JavaScript 表達式
- [其他](https://ejs.co/)...

而 html-webpack-plugin 本身就以搭載 lodash.template 作為模板引擎，撰寫方式與 ejs 大致上相同，差別在於讀取其值語法不同而已，讓我們先從傳遞封裝屬性的物件開始說起。

配置 `webpack.config.js` 檔案：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: '這是標題',
      content: '這是內容',
      link: 'https://awdr74100.github.io/',
      product: ['鉛筆', '原子筆', '橡皮擦'],
    }),
  ],
};
```

至 `./src/index.html` 動態載入 ejs 傳遞內容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <h1 class="text-primary">Hello World</h1>
    <p><%= htmlWebpackPlugin.options.content %></p>
    <a href="<%= htmlWebpackPlugin.options.link %>">主頁連結</a>
    <ul>
      <% htmlWebpackPlugin.options.product.forEach(item => { %>
      <li><%= item %></li>
      <% }) %>
    </ul>
  </body>
</html>
```

執行 `npm run build` 指令，並查看編譯結果：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>這是標題</title>
    <link href="static/css/main.css" rel="stylesheet" />
  </head>

  <body>
    <h1 class="text-primary">Hello World</h1>
    <p>這是內容</p>
    <a href="https://awdr74100.github.io/">主頁連結</a>
    <ul>
      <li>鉛筆</li>
      <li>原子筆</li>
      <li>橡皮擦</li>
    </ul>
    <script src="static/js/main.js"></script>
  </body>
</html>
```

事實上，寫在 `HtmlWebpackPlugin({})` 內的任何屬性，包含 `filename`、`templete` 等等，都可以使用以下語法讀取其值：

```js
htmlWebpackPlugin.options.鍵;
```

如果你很熟悉 ejs 模板語言，那你對於上面的寫法一定不陌生，唯一要注意的是，html-webpack-plugin 內建的 lodash.template 只支援部分的 ejs 功能，像是 `include()` 等方法使用即會報錯，因為並不支援。

## 補充：依照 chunk 載入不同檔案

html-webpack-plugin 還有一個很棒的功能在於依照 chunk 載入不同檔案，每一個 html-webpack-plugin 實例都代表了一個 HTML 檔案，我們可針對各自的 HTML 檔案依造 chunk 載入不同的 entry 內容，讓我們從新增 HTML 與入口檔案開始說起，如下所示：

```diff
 webpack-demo/
 │
 └─── src/
 │   │
 │   └─── index.html       # HTML 主檔案
+│   └─── contact.html     # HTML 主檔案
 │   └─── main.js          # entry 入口檔案(main)
+│   └─── contact.js       # entry 入口檔案(contact)
```

配置 `webpack.config.js` 檔案：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js',
    contact: './src/contact.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/contact.html',
      filename: 'contact.html',
      chunks: ['contact'],
    }),
  ],
};
```

執行 `npm run build` 指令，並查看編譯結果：

- index.html 編譯結果：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>聯絡</title>
    <link href="static/css/main.f60a0479443f89e1d582.css" rel="stylesheet" />
  </head>

  <body>
    <script src="static/js/main.f60a0479443f89e1d582.js"></script>
  </body>
</html>
```

- contact.html 編譯結果：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>首頁</title>
  </head>

  <body>
    <script src="static/js/contact.f60a0479443f89e1d582.js"></script>
  </body>
</html>
```

在 `HtmlWebpackPlugin` 實例中配置 `chunk` 選項，即可針對不同的 entry 檔案做響應載入，如果單個 HTML 檔案需要載入不同的 entry 檔案，直接在陣列中增加即可：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main', 'contact'],
    }),
  ],
};
```

編譯結果：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>聯絡</title>
    <link href="static/css/main.f60a0479443f89e1d582.css" rel="stylesheet" />
  </head>

  <body>
    <script src="static/js/main.f60a0479443f89e1d582.js"></script>
    <script src="static/js/contact.f60a0479443f89e1d582.js"></script>
  </body>
</html>
```
