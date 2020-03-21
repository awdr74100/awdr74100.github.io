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

此時打包生成 `dist` 資料夾結構應如下：

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

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  <link href="static/css/main.f25bdf99993c55b0e375.css" rel="stylesheet"></head>
  <body>
    <h1 class="text-primary">Hello World</h1>
  <script type="text/javascript" src="static/js/main.f25bdf99993c55b0e375.js"></script></body>
</html>
```
<!-- prettier-ignore-end -->


