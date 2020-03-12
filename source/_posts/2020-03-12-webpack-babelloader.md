---
title: Webpack 前端打包工具 - 使用 babel-loader 編譯並轉換 ES6+ 代碼
description:
  [
    Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，以提高兼容性。此篇將介紹如何透過 babel-loader 編譯我們的 ES6+ 代碼，後面也會補充介紹 @babel/runtime 與 @babel/polyfill 組件的使用。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Babel, w3HexSchool]
date: 2020-03-12 21:15:43
updated: 2020-03-12 21:15:43
---

## 前言

Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，以提高兼容性。此篇將介紹如何透過 babel-loader 編譯我們的 ES6+ 代碼，後面也會補充介紹 @babel/runtime 與 @babel/polyfill 組件的使用。

## 筆記重點

- babel-loader 安裝
- babel-loader 基本使用
- babel-loader 可傳遞選項

## babel-loader 安裝

babel-loader 相關套件：

```bash
$ npm install babel-loader @babel/core @babel/preset-env -D
```

Webpack 通過 babel-loader 調用 Babel，直接安裝即可，同時也必須安裝 @babel/core 與 @babel/preset-env，用作 Babel 核心與編譯器。

## babel-loader 基本使用

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── main.js          # entry 入口檔案 (撰寫檔案)
│
└─── index.html           # 引入 bundle.js 測試用檔案
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli、babel-loader @babel/core @babel/preset-env
```

撰寫 JavaScript ES6+ 版本代碼：

```js
const people = {
  name: 'Roya',
  height: 170,
};

for (const [key, value] of Object.entries(people)) {
  console.log(key, value);
}
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      // 配置 babel-loader (第一步)
      {
        test: /\.m?js$/,
        // 排除 node_modules 與 bower_components 底下資料 (第二步)
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            // 配置 Babel 解析器 (第三步)
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

通常在配置 Babel 時，我們都是習慣把 options 的內容撰寫在獨立的 `.babelrc` 檔案內，如果 Babel 的配置較為複雜，相比於撰寫在 `webpack.config.js` 內，使用 `.babelrc` 更能提高其辨識度，在之後的 @babel/runtime 與 @babel/polyfill 章節會再做補充，讓我們先暫時以此方式進行配置。
