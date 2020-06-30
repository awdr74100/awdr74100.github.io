---
title: Webpack 前端打包工具 - 使用 webpack-merge 區分 dev 與 prod 環境
description:
  [
    之前在介紹如何正確挑選當前環境的 SourceMap 類型時，有提到如何以三元運算的方式達到自動切換的效果，通常在實際開發中，我們會有多個需判斷當前環境用以切換配置的需求，如果此時還是一樣使用三元運算方式做切換，可能會造成結構混亂導致不易閱讀的問題。此篇將介紹如何使用 webpack-merge 合併各自環境的 Webpack 配置檔，達到在不造成結構混亂的前提下區分 dev 與 prod 環境。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-04-09 10:41:50
updated: 2020-04-09 21:22:16
---

## 前言

之前在介紹如何正確挑選當前環境的 SourceMap 類型時，有提到如何以三元運算的方式達到自動切換的效果，通常在實際開發中，我們會有多個需判斷當前環境用以切換配置的需求，如果此時還是一樣使用三元運算方式做切換，可能會造成結構混亂導致不易閱讀的問題。此篇將介紹如何使用 webpack-merge 合併各自環境的 Webpack 配置檔，達到在不造成結構混亂的前提下區分 dev 與 prod 環境。

## 筆記重點

- webpack-merge 安裝
- webpack-merge 基本使用
- webpack-merge 可傳遞選像
- 補充：cross-env 跨平台設置環境變數

## webpack-merge 安裝

> 套件連結：[webpack-merge](https://github.com/survivejs/webpack-merge)

主要的套件：

```bash
npm install webpack-merge -D
```

過程會使用到的套件：

```bash
npm install css-loader mini-css-extract-plugin style-loader webpack webpack-cli -D
```

package.json：

```json
{
  "devDependencies": {
    "css-loader": "^3.5.1",
    "mini-css-extract-plugin": "^0.9.0",
    "style-loader": "^1.1.3",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  }
}
```

在這邊我們示範在不使用三元運算的情況下，切換 style-loader 與 mini-css-extract-plugin 作用於不同環境，請先將所需套件進行安裝。

## webpack-merge 基本使用

初始專案結構：

```plain
webpack-demo/
│
├─── build/
│   │
│   ├─── webpack.base.conf.js     # Webpack 共用配置檔 (等待合併)
│   ├─── webpack.dev.conf.js      # 開發環境配置檔
│   └─── webpack.prod.conf.js     # 生產環境配置檔
│
├─── node_modules/
├─── src/
│   │
│   └─── css/
│       │
│       └─── all.css      # CSS 主檔案
│   │
│   └─── main.js          # entry 入口檔案
│
├─── package-lock.json
└─── package.json
```

配置 `build/webpack.base.conf.js` 檔案：

```js
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, '../'), // 編譯時的根目錄 (相對路徑尋找文件用)
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
  },
  // other common config
};
```

以往我們都是將配置全部寫在單獨的檔案內，現在我們可以將不管是 development 還是 production 環境都會用到且不需要切換的配置拆分到 `webpack.base.conf.js` 檔案內，等等會說明如何透過 webpack-merge 合併這一支檔案，這邊要注意檔案路徑是否正確，為了方便，我們配置了 `context` 並指向上一層目錄也就是專案根目錄，預設為 `process.cwd()`。

配置 `build/webpack.dev.conf.js` 檔案：

```js
// 載入 webpack-merge (第一步)
const merge = require('webpack-merge');
// 載入需合併的配置檔 (第二步)
const baseWebpackConfig = require('./webpack.base.conf');

// 配置檔合併 (第三步)
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  // other development config
});
```

在 development 的環境下，我們使用 style-loader 用做樣式表的處理，並且透過 webpack-merge 合併檔案，你會發現 webpack-merge 使用方式蠻簡單的，只需要以 `merge(等待合併檔案,{})` 語法做撰寫即可，最後記得一樣透過 `module.exports` 導出模塊，我們到最後會指定這一個檔案進行編譯。

配置 `webpack.prod.conf.js` 檔案：

```js
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[hash].js', // 覆蓋 baseWebpackConfig 設定
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
  ],
  // other production config
});
```

在 production 的環境下，我們使用 mini-css-extract-plugin 用做樣式表的處理，這邊補充一點，`webpack.base.conf.js` 檔案的所有屬性都是可以被覆蓋的，也就是說，導出的檔案可新增任何被合併檔案的屬性，達到覆蓋的作用，比如上面範例的 `output.filename` 屬性。

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "build": "webpack --config ./build/webpack.prod.conf.js",
    "dev": "webpack --config ./build/webpack.dev.conf.js"
  }
}
```

以往我們在新增編譯指令時，都不會使用到 `--config` 這個命令，因為預設讀取 Webpack 配置檔的路徑就是專案根目錄且名稱必須為 `webpack.config.js`，這也是為什麼我們不需要配置的原因，但在這邊由於路徑與名稱的都不同，我們必須告知 Webpack 去哪裡找我們的配置文件，以確保成功編譯，上面我們分別新增了 dev 與 prod 的配置檔路徑，如果都沒問題，就可以直接編譯並查看結果囉。

編譯結果：

development 環境：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── js/
│       │
│       └─── main.js
```

production 環境：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── css/
│       │
│       ├─── main.b16f5df8f355e075f0a9.css
│       └─── main.b16f5df8f355e075f0a9.css.map
│   │
│   └─── js/
│       │
│       ├─── main.b16f5df8f355e075f0a9.js
│       └─── main.b16f5df8f355e075f0a9.js.map
```

## 補充：cross-env 跨平台設置環境變數

這邊補充一下關於環境變數的陷阱，在 Webpack 4 中，當我們設置了 `mode` 選項後，會自動使用 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 新增一個名為 `process.env.NODE_ENV` 的全域變數：

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('<當前環境>'),
    }),
  ],
};
```

此時我們可在 entry 內的環境讀取這個變數：

```js
// > $ webpack --mode development

console.log(process.env); // {}
console.log(process.env.NODE_ENV); // development
```

請注意，DefinePlugin 只不過是幫我們在 entry 環境新增一個全域變數，並不是環境變數，如果你印出 `process.env` 的內容是找不到這個變數的。

這邊還有一個最大的雷點，那就是在 Webpack 配置檔是讀取不到這一個全域變數的，如同前面所說，DefinePlugin 只是在 "entry" 內新增這個全域變數，Webpack 配置檔自然是無法讀取到他的，如下所示：

```js
// webpack.config.js

console.log(process.env.NODE_ENV); // undefined
```

針對以上問題，Linux 環境的開發者可直接在 CLI 指令時注入 `NODE_ENV` 這一個環境變數，如下所示：

```json
{
  "scripts": {
    "build": "NODE_ENV=development webpack"
  }
}
```

有沒有注意到我說的是 Linux 的開發者？如果你的系統是 Windows，使用以上方法是行不通的，Windows 不支持 NODE_ENV=development 這樣的設置方式，你可能看過有人使用以下作法：

```bash
set NODE_ENV=development
```

以上方法確實可以成功，但一遇到跨系統問題，還是會導致錯誤，這邊我推薦使用 [cross-env](https://www.npmjs.com/package/cross-env) 套件來完成，以下為範例：

```bash
npm install cross-env -D
```

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=development webpack"
  }
}
```

只需要在 `NODE_ENV` 前加入 `cross-env` 命令即可，是不是很簡單？此時 Webpack 配置檔就讀取的到環境變數囉：

```js
// webpack.config.js

console.log(process.env.NODE_ENV); // development
```
