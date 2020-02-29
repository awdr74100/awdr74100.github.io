---
title: Webpack 前端打包工具 - 使用 mini-css-extract-plugin 把 CSS 抽離出來
description:
  [
    此篇為接續上一篇再說明如何將 CSS 給單獨抽離的介紹文章。上一次我們利用了 style-loader 將 css-loader 處理過後的 CSS 注入到 HTML 內，將以 style 標籤的形式存在，但這有違一般開發的處理流程，建議還是將 CSS 檔案給獨立出來，既方便修改，也不會造成效能上的疑慮。這一次我們改用 mini-css-extract-plugin 將 CSS 給單獨抽離出來，並說明途中可能會踩到的坑以及該如何解決等辦法。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-03-02 15:15:50
updated: 2020-03-02 15:15:50
---

## 前言

此篇為接續上一篇再說明如何將 CSS 給單獨抽離的介紹文章。上一次我們利用了 style-loader 將 css-loader 處理過後的 CSS 注入到 HTML 內，將以 style 標籤的形式存在，但這有違一般開發的處理流程，建議還是將 CSS 檔案給獨立出來，既方便修改，也不會造成效能上的疑慮。這一次我們改用 mini-css-extract-plugin 將 CSS 給單獨抽離出來，並說明途中可能會踩到的坑以及該如何解決等辦法。

## 筆記重點

- mini-css-extract-plugin 安裝
- mini-css-extract-plugin 基本使用
- mini-css-extract-plugin 可傳遞選項
- 補充：更改 CSS 檔案生成路徑
- 補充：publicPath 修改目標公共路徑

## mini-css-extract-plugin 安裝

> 套件連結：[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

```bash
$ npm install mini-css-extract-plugin -D
```

這邊要注意的是 mini-css-extract-plugin 是屬於 Webpack 的 Plugin，主要為 style-loader 的另一種類型套件，你可以不用下載 style-loader，但主要編譯還是得依靠 css-loader，也就是說 mini-css-extract-plugin 與 css-loader 都必須進行安裝。

## mini-css-extract-plugin 基本使用

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
| - package.json        # 已安裝 webpack、webpack-cli、css-loader、mini-css-extract-plugin
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
// 載入 mini-css-extract-plugin (第一步)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // 新增 loader (第三步)
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // 創建實例 (第二步)
  plugins: [new MiniCssExtractPlugin()],
};
```

配置 Plugin 相對於配置 loader 簡單不少，只需要新增 `plugins` 屬性，並以陣列項目的方式新增對應的 plugin 實例對象即可，如上範例。

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

至 `./index.html` 引入打包而成的 `bundle.js` 與 `main.css` 檔案：

```html
<!-- 其他省略 -->
<head>
  <!-- 引入打包生成的 CSS -->
  <link rel="stylesheet" href="dist/main.css" />
</head>
<body>
  <h1 class="text-primary">Hello World</h1>
  <!-- 引入打包生成的 JavaScript -->
  <script src="dist/main.js"></script>
</body>
```

查看結果：

![mini-css-extract-plugin 結果](https://i.imgur.com/Xhtm59r.png)

是不是一切都正常多了？相比於使用 style-loader 將 CSS 注入到 HTML，我更喜歡使用 mini-css-extract-plugin 將 CSS 給獨立抽取出來，我相信這應該也是大多人開發的習慣，這邊還有一點要注意，CSS 檔案目前是生成在與 bundle.js 同一個階層目錄，我自己是習慣將 CSS 放置在自己的資料夾，這點在後面會在說明。

## mini-css-extract-plugin 可傳遞選項

<div class="note danger">關於 publicPath 更為詳細的說明，可參考下面的補充說明</div>

可參考 [mini-css-extract-plugin Options](https://github.com/webpack-contrib/mini-css-extract-plugin#options) 可傳遞參數列表，以下為常用的參數配置：

- publicPath：`String` | `Function`
  指定目標文件的公共路徑，默認為 `webpackOptions.output`

範例：

```js
module.exports = {
  // 其他省略
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../', // 指定公共路徑
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```


## 補充：更改 CSS 檔案生成路徑

