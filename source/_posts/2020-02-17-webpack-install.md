---
title: Webpack 前端打包工具 - 環境安裝與執行
description:
  [
    Webpack 可說是近年來最為熱門的技術，以往在編寫 ES6、Sass/SCSS、Pug、Vue、React 等預處理器或需編譯內容時，通常都得透過自動化工具，如 Gulp、Grunt 等任務流程執行工具進行編譯處理，到了現在，Webpack 已逐漸取代這些工具，Webpack 本身提供許多強大的功能，包含現正熱門的 SPA (單頁式應用) 透過配置 loader 方式也能輕鬆應付。本篇將從 Webpack 運行原理開始做介紹，接著說明如何安裝 Webpack，最後透過打包方式產出我們的第一個 bundle.js 檔案。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-17 17:29:46
updated: 2020-02-17 17:29:46
---

## 前言

Webpack 可說是近年來最為熱門的技術，以往在編寫 ES6、Sass/SCSS、Pug、Vue、React 等預處理器或需編譯內容時，通常都得透過自動化工具，如 Gulp、Grunt 等任務流程執行工具進行編譯處理，到了現在，Webpack 已逐漸取代這些工具，Webpack 本身提供許多強大的功能，包含現正熱門的 SPA (單頁式應用) 透過配置 loader 方式也能輕鬆應付。本篇將從 Webpack 運行原理開始做介紹，接著說明如何安裝 Webpack，最後透過打包方式產出我們的第一個 bundle.js 檔案。

## 筆記重點

- Webpack 簡介
- Webpack 安裝
- Webpack 基本配置

## Webpack 簡介

![Webpack 介紹](https://img.magiclen.org/albums/webpack/shot-01.png)

Webpack 本身是一個開源的 JavaScript 模組打包工具，提供了前端缺乏的模組化開發方式，將各種靜態資源視為模組，當執行相關命令進行編譯時，將依 `webpack.config.js` 配置檔案執行優化並將其 entry 檔案打包成單個 JavaScript 檔案。

你可能會好奇，Webpack 所針對的模組不是指 JavaScript 模組嗎？那他要如何像 Gulp 一樣處理 `.scss`、`.pug` 之類的檔案呢？這時就得提到 Webpack Loader 這一個東西，它可將 JavaScript 以外的檔案透過解析，將其轉換為 JavaScript 模組，非常的特別，這點在後面都會有提到，簡單來講，Webpack 可幫我們完成以下事情：

- 整合 CommonJS & AMD & ES6 Modulrs 模組規範
- 編譯 Sass/SCSS、Pug、CoffeeScript 等預處理器
- 轉換 TypeScript、ECMAScript 6 相關代碼
- 解析模組間的相互依賴，進行打包處理
- other...

Webpack 最大的特色就在於模組打包，上圖所呈現的就是打包的進行方式，且能解決模組間的相互依賴問題，這也是一般人常說 Webpack 比 Gulp 更為適合開發 SPA (單頁式應用) 的關鍵，由於 Webpack 是以模組為基石，我們可以更為自由的操作整體結構，非常的強大，讓我們先從安裝開始說起。

## Webpack 安裝

<div class="note warning">本篇教學都是採用 Webpack 4 版本，與 v3 版本有些許不同，請稍加注意</div>

Webpack 依賴 Node.js 環境，需先進行安裝。在這邊使用 nvm 進行安裝：

```bash
$ nvm install 12.14.1
```

當然你也可以使用 [官方安裝檔](https://nodejs.org/en/) 安裝 Node.js，接著使用以下指令查看是否正確安裝：

```bash
$ node -v
```

![node 是否正確安裝](https://i.imgur.com/ysAfrID.png)

讓我們先建立一個專案資料夾並切換：

```bash
$ mkdir webpack-demo
$ cd webpack-demo
```

初始化專案並生成 `package.json` 檔案：

```bash
$ npm init -y
```

安裝 webpack 所需相關套件：

```bash
$ npm install webpack webpack-cli -D
```

這邊要注意的是 Webpack 4 把以往都綁在 Webpack 內的 Webpack-CLI 挪出來另外安裝，所以除了安裝 Webpack 外還要記得安裝 Webpack-CLI。且由於 Webpack 不像是 Gulp 需要指定編譯內容，所以我們可將 Webpack 安裝在區域環境，並透過 npm script 執行即可，官方也推薦此做法。

## Webpack 基本配置

初始專案結構：

```plain
webpack-demo/
|
| - node_modules/
|
| - src/
|   | - main.js         # entry 入口檔案
|
| - webpack.config.js   # webpack 配置檔案
| - package-lock.json
| - package.json        # 已安裝 webpack、webpack-cli
```

請依造上面專案結構所示，新增 `src/main.js` 與 `webpack.config.js` 檔案。

配置 `webpack.config.js` 檔案：

```js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
```

讓我們來了解一下 Webpack 配置檔在寫什麼東西：

- **entry**
  - 用來設定 entry 檔案的進入點，也就是 JavaScript 模組檔案的入口處
- **output**
  - **path**：設定打包後的 JavaScript 檔案放置路徑，通常都會搭配 path 模組以形成絕對路徑
    - `__dirname`：c:\Users\blue\Desktop\webpack-demo
    - `path.resolve(...)`：c:\Users\blue\Desktop\webpack-demo\dist
  - **filename**：打包後的 JavaScript 檔案名稱，你也可以這樣寫 `js/bundle.js`

鍵入測試用 JavaScript 代碼：

```js
// src/main.js

console.log('Hello World');
```

新增編譯 Webpack 指令：

```js
// package.json

{
  "scripts": {
    "start":"webpack --mode development"
  },
}
```

執行編譯指令：

```bash
$ npm run start
```
