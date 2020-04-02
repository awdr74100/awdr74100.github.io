---
title: Webpack 前端打包工具 - 切換 devtool 選項用以生成各式 SourceMap
description:
  [
    相比於 Gulp 需使用套件才能生成 SourceMap，Webpack 只需簡單的開啟 devtool 選項即可生成 SourceMap，且提供了多達 10 種以上的類型供開發者使用，簡直太強大。此篇將介紹如何在 Webpack 開啟 devtool 選項用以生成 SourceMap，並說明在各式 SourceMap 類型下，該如何針對 development (開發環境) 與 production (生產環境) 做最合適的挑選。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-04-02 14:26:09
updated: 2020-04-02 14:26:09
---

## 前言

相比於 Gulp 需使用套件才能生成 SourceMap，Webpack 只需簡單的開啟 devtool 選項即可生成 SourceMap，且提供了多達 10 種以上的類型供開發者使用，簡直太強大。此篇將介紹如何在 Webpack 開啟 devtool 選項用以生成 SourceMap，並說明在各式 SourceMap 類型下，該如何針對 development (開發環境) 與 production (生產環境) 做最合適的挑選。

## 筆記重點

- 相關套件安裝
- 初始環境建構
- sourcemap 類型差異
- sass-loader 開啟 sourcemap 支援
- postcss-loader 開啟 sourcemap 支持

## 相關套件安裝

過程會使用到的套件：

```bash
npm install clean-webpack-plugin html-webpack-plugin webpack webpack-cli webpack-dev-server -D ; npm install axios -P
```

package.json：

```json
{
  "devDependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^4.0.4",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "axios": "^0.19.2"
  }
}
```

在 Webpack 中生成 sourcemap 不需要安裝任何套件，配置即可使用，但為了模擬一般開發情境，請先安裝過程所需套件，避免可能造成的疑惑，同時也請安裝 axios 套件，主要用來模擬 sourcemap 所謂的**打包後代碼**、**轉換後代碼**、**原始源代碼**情境。

## 初始環境建構

初始專案結構

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── js/
│       │
│       └─── all.js       # JavaScript 主檔案
│   │
│   ├─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
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
    <h1 class="text-primary">Primary</h1>
  </body>
</html>
```

至 `./src/js/all.js` 撰寫 axios 使用範例：

```js
import axios from 'axios';

axios.get('https://randomuser.me/api/').then((res) => {
  // get
  const name = res.data.results[0].name.last;
  // console
  console.log(name);
  // output
  document.querySelector('.name').textContent = name;
});
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  devServer: {
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
  ],
};
```

entry 入口處 (`src/main.js`) 引入 JavaScript 檔案：

```js
import './js/all';
```

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
  }
}
```

## sourcemap 類型差異
