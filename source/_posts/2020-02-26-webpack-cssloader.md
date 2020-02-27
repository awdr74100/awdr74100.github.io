---
title: Webpack 前端打包工具 - 使用 css-loader 與 style-loader 處理樣式表
description:
  [
    上次在介紹 Webpack 時有稍微提到 Loader 究竟是做什麼用，簡單來講，Webpack 本身只能處理 JavaScript 模組，如果要處理其他類型的文件，就需要使用相關的 Loader 進行轉換。Loader 可以理解為模組和資源的轉換器，它本身是一個 function，接受源文件作為參數傳遞，最後返回轉換後的結果。這次讓我們從最基本的打包 CSS 開始講解，利用 css-loader 抽取源文件相關的 CSS 檔進行轉換，並利用 css-loader 的好搭檔 style-loader 將轉換後的 CSS 附加到 style 標籤已進行存取。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-26 19:17:58
updated: 2020-02-26 19:17:58
---

## 前言

上次在介紹 Webpack 時有稍微提到 Loader 究竟是做什麼用，簡單來講，Webpack 本身只能處理 JavaScript 模組，如果要處理其他類型的文件，就需要使用相關的 Loader 進行轉換。Loader 可以理解為模組和資源的轉換器，它本身是一個 function，接受源文件作為參數傳遞，最後返回轉換後的結果。這次讓我們從最基本的打包 CSS 開始講解，利用 css-loader 抽取源文件相關的 CSS 檔進行轉換，並利用 css-loader 的好搭檔 style-loader 將轉換後的 CSS 附加到 style 標籤已進行存取。

## 筆記重點

- css-loader 與 style-loader 安裝
- css-loader 與 style-loader 基本使用

## css-loader 與 style-loader 安裝

> 套件連結：[css-loader](https://github.com/webpack-contrib/css-loader)、[style-loader](https://github.com/webpack-contrib/style-loader)

css-loader：

```bash
$ npm install css-loader -D
```

style-loader：

```bash
$ npm install style-loader -D
```

這邊要注意的是 css-loader 只是單純將 entry 內相關的 CSS 檔案做轉換，最後必須透過 style-loader 將 CSS 注入到 HTML 的 `<style>` 標籤上，已進行存取，也就代表使用 style-loader 會以 HTML 標籤的形式完成存取，並不是以單獨的 CSS 檔案做引用完成存取，這邊要特別注意，之後也會介紹如何將 CSS 檔案抽取成獨立的檔案，讓我們先安裝這兩個 loader。

## css-loader 與 style-loader 基本使用

初始專案結構：

```plain
webpack-demo/
|
| - node_modules/
|
| - src/
|   | - css/
|       | - all.css     # CSS 主檔案
|
|   | - main.js         # entry 入口檔案
|
| - index.html          # 引入 bundle.js 測試用檔案
| - webpack.config.js   # Webpack 配置檔案
| - package-lock.json
| - package.json        # 已安裝 webpack、webpack-cli、css-loader、style-loader
```

撰寫 CSS 範例：

```css
.text-primary {
  color: rgb(37, 37, 177);
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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

上一次我們介紹了 Webpack 中 entry 與 output 該如何配置，這一次我們藉由配置 module 選項來新增相關的 loader，關於細部的討論，都會在下面做補充，讓我們先來完成此次的目的。也就是完成打包 CSS 檔案。

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

至 `./index.html` 引入打包而成的 `bundle.js` 檔案：

```html
<!-- 其他省略 -->
<body>
  <h1 class="text-primary">Hello World</h1>
  <script src="dist/bundle.js"></script>
</body>
```

查看結果：
