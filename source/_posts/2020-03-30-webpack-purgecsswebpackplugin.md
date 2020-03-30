---
title: Webpack 前端打包工具 - 使用 purgecss-webpack-plugin 清除多餘的 CSS
description:
  [
    在上一篇文章中，介紹了如何使用 Webpack 打包客製化的 Bootstrap 樣式，但在這邊還有一個問題，那就是打包出來的 CSS 太肥了，這也是 Bootstrap 為人所詬病的原因，我們根本不需要這麼多的樣式，一半以上的 class 可能都沒有使用到，當時的解決辦法是手動移除預設載入的 component，但我們使用的可是 Webpack 自動化工具阿！，當然也要以自動化方式進行處理。此篇將介紹如何使用 purgecss-webpack-plugin 清除多餘的 CSS 代碼，大幅縮減檔案大小。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Bootstrap, PurgeCSS, CSS, w3HexSchool]
date: 2020-03-30 13:37:33
updated: 2020-03-30 13:37:33
---

## 前言

在上一篇文章中，介紹了如何使用 Webpack 打包客製化的 Bootstrap 樣式，但在這邊還有一個問題，那就是打包出來的 CSS 太肥了，這也是 Bootstrap 為人所詬病的原因，我們根本不需要這麼多的樣式，一半以上的 class 可能都沒有使用到，當時的解決辦法是手動移除預設載入的 component，但我們使用的可是 Webpack 自動化工具阿！，當然也要以自動化方式進行處理。此篇將介紹如何使用 purgecss-webpack-plugin 清除多餘的 CSS 代碼，大幅縮減檔案大小。

## 筆記重點

- purgecss-webpack-plugin 安裝
- purgecss-webpack-plugin 基本使用
- purgecss-webpack-plugin 可傳遞選項
- 補充：@fullhuman/postcss-purgecss 插件
- 補充：PurifyCSS 線上縮減服務

## purgecss-webpack-plugin 安裝

> 套件連結：[purgecss-webpack-plugin](https://purgecss.com/plugins/webpack.html)、[glob](https://www.npmjs.com/package/glob)

purgecss-webpack-plugin：

```bash
$ npm i purgecss-webpack-plugin -D
```

glob：

```bash
$ npm i glob -D
```

require：

```bash
$ npm i ...
```

本篇將延續[上一篇文章](https://awdr74100.github.io/2020-03-28-webpack-includebootstrap/)做說明，請先將專案所需套件進行安裝，為了更為方便操作 purgecss-webpack-plugin，此次也會同時引入 glob 套件，關於 glob 的使用方式，在下面會連同 purgecss-webpack-plugin 做說明。

## purgecss-webpack-plugin 基本使用

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── scss/
│       │
│       └─── helpers
│           │
│           └─── _variables.scss    # 新增並修改 Bootstrap 預設變數
│       │
│       └─── all.scss     # SCSS 主檔案
│   │
│   └─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
└─── .browserslistrc      # Browserslistrc 配置檔案
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 purgecss-webpack-plugin、...
```

新增 `./src/scss/helpers/_variables.scss` 並修改預設變數(懶人覆蓋法)：

<!-- prettier-ignore-start -->
```scss
/* 另存新檔 node_modules/bootstrap/scss/_variables.scss 預設變數並修改 */

// 其他省略 ...
$primary:       #174ea0; // $blue !default;
$success:       #2e662e; // $green !default;
```
<!-- prettier-ignore-end -->

載入 Bootstrap 相關元件與本地變數檔案：

```scss
/* --- Required (使用模塊解析) --- */
@import '~bootstrap/scss/functions';
@import './helpers/variables'; // 使用本地檔案
@import '~bootstrap/scss/mixins';

/* --- Bootstrap 主檔案 (使用模塊解析) --- */
@import '~bootstrap/scss/bootstrap';
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
    <h1 class="text-primary">Hello</h1>
    <h2 class="text-success">World</h2>
  </body>
</html>
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 載入 purgecss-webpack-plugin (第一步)
const PurgecssPlugin = require('purgecss-webpack-plugin');
// 載入 glob (第二步)
const glob = require('glob');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    // 創建實例 (第三步)
    new PurgecssPlugin({
      // 傳入分析內容 (第四步)
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`, {
        nodir: true,
      }),
    }),
  ],
};
```

通常 Webpack 的 Plugin 使用方式都大同小異，purgecss-webpack-plugin 也不例外，比較值得注意的地方在於 `path` 選項，我們可透過這個選項傳入需分析的檔案，事實上，**purgecss-webpack-plugin 是透過分析檔案內容的方式判定那些為有效代碼**，包含動態載入的 class 也難不倒他，這邊比較由疑問的可能是 glob 套件的使用，我們可以先隨意開一個檔案並引入 glob 套件試試看。

```js
const glob = require('glob');

const result = glob.sync(`${path.resolve(__dirname, 'src')}/**/*`, {
  nodir: true,
});

console.log(result);

/* --- 編譯結果 
[
  'C:/Users/blue/Desktop/webpack-demo/src/index.html',
  'C:/Users/blue/Desktop/webpack-demo/src/main.js',
  'C:/Users/blue/Desktop/webpack-demo/src/scss/all.scss',
  'C:/Users/blue/Desktop/webpack-demo/src/scss/helpers/_variables.scss'      
]
--- */
```

從上面結果可以得知，glob 套件主要用來獲取匹配的路徑陣列，如果有使用過 Gulp 的人因該對這種方式很熟悉，Gulp 底層就是使用 glob 套件來獲取匹配路徑。當我們拿到指定分析的匹配路徑時，就可以把這個陣列丟給 purgecss-webpack-plugin 中的可傳遞選項 `path` 來完成分析，這就是上面我們所在做的事情。

entry 入口處 (`src/main.js`) 引入 SCSS 檔案：

```js
import './scss/all.scss';
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

未使用 PuregeCSS：



使用 PurgeCSS：







