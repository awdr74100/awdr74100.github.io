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

<div class="note warning">此次範例會搭配 css-loader 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a></div>

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
    filename: 'bundle.js',
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

是不是一切都正常多了？相比於使用 style-loader 將 CSS 注入到 HTML，我更喜歡使用 mini-css-extract-plugin 將 CSS 給獨立抽取出來，我相信這應該也是大多人開發的習慣，這邊還有一點要注意，CSS 檔案目前是生成在與 bundle.js 同一個階層目錄，我自己是習慣將 CSS 放置在各自的資料夾，這點在後面會在補充說明。

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

以往我們在開發網頁時，習慣將各個語言放置在屬於自己資料夾，方便辨識之外，也有避免檔案過大等問題，但在初期配置 Webpack 時，你會發現 output 的檔案全部都生成在 `dist` 目錄階層下，相比於 Gulp ，簡單修改 `gulp.dest()` 即可更改放置目錄，Webpack 配置方式差不多，但可能有些小陷阱需要特別注意，先讓我們來看之前曾提過的 `bundle.js` 生成路徑修改範例：

```js
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 把它想像成 gulp.dest(...)
    filename: 'js/bundle.js',
  },
};
```

從上面範例可以看出，只需要修改 output 內的 `filename` 選項，即可將生成路徑做對應的修改，此時打包後的 `dist` 資料夾結構如下：

```plain
webpack-demo/
|
| - dist/
|   | - js/
|       | - bundle.js     # 打包生成的 JavaScrit 檔案
```

這邊千萬要注意，**修改路徑並不是修改 output 內的 path 選項**，這會導致所有的 loader 或 plugin 都得做相對應的修改，變得非常的麻煩！讓我們來看 mini-css-extract-plugin 該如何與上面範例一樣修改檔案生成路徑：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
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
      // 把它想像成 gulp.dest(...)
      filename: 'css/[name].[hash:3].css',
    }),
  ],
};
```

在每一個 plugin 中，都可以傳遞一個物件，而這一個物件可以配置 `filename`、`chunkFilename` 等屬性，配置原理如同 output 內的 `filename` 選項，同時也可以使用 output.filename 的模板字串，詳情可參考 [這裡](https://webpack.js.org/configuration/output/#template-strings)，此時打包後的 `dist` 資料夾結構如下：

```plain
webpack-demo/
|
| - dist/
|   | - js/
|       | - bundle.js     # 打包生成的 JavaScrit 檔案
|
|   | - css/
|       | - main.???.css  # 打包生成的 CSS 檔案
```

事實上，大部分的 loader 或 plugin 都可以藉由修改 `filename` 更改打包後的生成路徑，唯一要注意的是，像 CSS 這種檔案，你可能會使用 `background-image: url("../..")` 來顯示圖片，這時候問題就來了，`filename` 的生成路徑並不會響應樣式表內的相對路徑，打包出來的結果也就變成找不到圖片，這時候就得依靠 publicPath 可傳遞選項修改公共路徑，修正打包後的相對路徑，這樣說起來可能有點複雜，讓我們繼續看下去。

## 補充：publicPath 修改目標公共路徑