---
title: Webpack 前端打包工具 - 客製化 Bootstrap 樣式並進行編譯
description:
  [
    Bootstrap 目前已經算是前端必備的技能了，相信大部分人在使用時都是以 CDN 的方式進行載入，但這樣子的作法等同於將整個官方預編譯好的 Bootstrap 進行載入，當我們需要客製化 Bootstrap 樣式時，必定得採取其他方法。此篇將介紹如何使用 npm 方式載入 Bootstrap，並透過 sass-loader 編譯屬於我們自己的客製化樣式。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Bootstrap, CSS]
date: 2020-03-28 14:03:36
updated: 2020-03-29 18:15:56
---

## 前言

Bootstrap 目前已經算是前端必備的技能了，相信大部分人在使用時都是以 CDN 的方式進行載入，但這樣子的作法等同於將整個官方預編譯好的 Bootstrap 進行載入，當我們需要客製化 Bootstrap 樣式時，必定得採取其他方法。此篇將介紹如何使用 npm 方式載入 Bootstrap，並透過 sass-loader 編譯屬於我們自己的客製化樣式。

## 筆記重點

- 相關套件安裝
- 客製並編譯 Bootstrap 預設變數
- 客製並編譯 Bootstrap 載入元件
- 載入 jQuery 與 Popper.js 相依套件

## 相關套件安裝

> 套件連結：[bootstrap](https://translate.google.com.tw/?hl=zh-TW)

主要的套件：

```bash
npm install bootstrap -P
```

過程會使用到的套件：

```bash
npm install autoprefixer css-loader html-webpack-plugin mini-css-extract-plugin node-sass postcss-loader sass-loader -D
```

package.json：

```json
{
  "dependencies": {
    "bootstrap": "^4.4.1"
  },
  "devDependencies": {
    "autoprefixer": "^9.7.5",
    "css-loader": "^3.4.2",
    "html-webpack-plugin": "^4.0.3",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.13.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^8.0.2",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  }
}
```

Bootstrap 4 主要由 SCSS 建構而成，當你使用 npm 方式進行安裝時，在下載下來的 package 內即包含未編譯的 SCSS 原始檔案，我們可以針對這一個原始檔案進行客製化並編譯它，在這邊使用 sass-loader 套件進行編譯，由於 Bootstrap 官方的預編譯版本有使用到 autoprefixer 插件以便自動在構建時向某些 CSS 屬性增加前輟詞，我們在處理編譯後檔案時，也必須參照此作法，所以同時安裝了 postcss-loader 與 autoprefixer 套件。

## 客製並編譯 Bootstrap 預設變數

<div class="note warning">此次範例會搭配 sass-loader、postcss-loader、css-loader、mini-css-extract-plugin、html-webpack-plugin 一起使用，相關文章連結：<a href="https://github.com/webpack-contrib/sass-loader" target="_blank">sass-loader</a>、<a href="https://github.com/postcss/postcss-loader" target="_blank">postcss-loader</a>、<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a>、<a href="https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/" target="_blank">mini-css-extract-plugin</a>、<a href="https://awdr74100.github.io/2020-03-23-webpack-htmlwebpackplugin/" target="_blank">html-webpack-plugin</a></div>

初始專案結構：

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── scss/
│       │
│       └─── helpers
│           │
│           └─── _variables.scss    # 新增並修改 Bootstrap 預設變數
│       │
│       └─── all.scss     # SCSS 主檔案
│   │
│   ├─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

<div class="note warning">推薦使用懶人覆蓋法，將 ./node_modules/bootstrap/scss/_variables.scss 另存新檔至本地端</div>

新增 `./src/scss/helpers/_variables.scss` 並修改預設變數(須查詢預設變數名稱)：

```scss
/* 查詢 node_modules/bootstrap/scss/_variables.scss 預設變數並新增到本地檔案 */

$primary: #174ea0; // 隨意修改變數
$success: #2e662e;
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

根據官方文檔說明，Bootstrap 4 中的每個 SCSS 變數都包含 `!default` 標誌，允許您在自己的 SCSS 中覆蓋變數的預設值，而無需修改 Bootstrap 的原始碼。唯一要注意的是**新變數必須在導入 Bootstrap 的 SCSS 主文件之前**，否則無法成功，如下範例：

路徑：`./src/scss/all.scss`

```scss
/* --- Required (使用模塊解析) --- */
@import '~bootstrap/scss/functions';
@import './helpers/variables'; // 使用本地檔案
@import '~bootstrap/scss/mixins';

/* --- Bootstrap 主檔案 (使用模塊解析) --- */
@import '~bootstrap/scss/bootstrap';
```

在 Gulp 的環境中，我們會使用 `includePaths` 選項傳遞需遍歷的路徑，好讓解析引擎讀取正確的內容，在 sass-loader 中，也可以傳遞 `includePaths` 選項，畢竟解析引擎都是使用 Node-Sass，但在這邊我們不使用這個方法，直接以 sass-loader 中的 `~` 符號告知此不是相對路徑內容，而是指向 `resolve.modules` 路徑的模組，以下為 `resolve.modules` 的預設配置：

```js
module.exports = {
  resolve: {
    modules: ['node_modules'],
  },
};
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
  ],
};
```

配置檔的部分不太需要注意到什麼事情，如果你想要使用 `includePaths` 的方式載入 Bootstrap，可增加 `sassOptions` 選項進而配置當前解析器的可傳遞選項。

建立 `.browserslistrc` 並輸入官方編譯版本：

```json
>= 1%
last 1 major version
not dead
Chrome >= 45
Firefox >= 38
Edge >= 12
Explorer >= 10
iOS >= 9
Safari >= 9
Android >= 4.4
Opera >= 30
```

依造官方 [Browsers and devices](https://getbootstrap.com/docs/4.4/getting-started/browsers-devices/) 文檔說明，使用 Autoprefixer 可搭配 [Browserslist](https://github.com/browserslist/browserslist) 進行 CSS Prefix 支援裝置設定，上面為官方預編譯各裝置支援版本。

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

執行 `npm run build` 查看結果：

![sass-loader 編譯 bootstap 結果](https://i.imgur.com/pRjaVan.png)

從上面結果可以得知，Bootstrap 已成功被我們編譯，且預設樣式也被客製化了，簡單來講，我們可以針對從 package 拉出來的 `_variables.scss` 檔案進行客製化，過程如同使用 sass-loader 一般，只需要注意路徑是否正確載入即可。

## 客製並編譯 Bootstrap 載入元件

Bootstrap 最為人詬病的問題大概就是 package 實在是太大了，雖然可透過壓縮方式進行縮小化，但與 [Pure.css](https://purecss.io/) 等同類型框架相比還是太大了，內含的許多元件在實際開發時，幾乎都用不太到，造成空間的浪費；我們可以嘗試客製 Bootstrap 載入元件，以減少 package 的大小，讓我們先從 Bootstrap 架構開始說明：

Bootstrap 組成架構：

```scss
// 路徑：node_modules/bootstrap/scss/bootstrap.scss

@import 'functions';
@import 'variables';
@import 'mixins';
@import 'root';
@import 'reboot';
@import 'type';
@import 'images';
@import 'code';
@import 'grid';
@import 'tables';
@import 'forms';
@import 'buttons';
@import 'transitions';
// 以下省略 ...
```

Bootstrap 是一個標準的 OOCSS 範例，也因為使用此設計準則，我們可以很輕鬆的移除沒有使用到的元件。請先將 Bootstrap 主檔案內容複製到 `./src/scss/all.scss` 內，接著註釋掉不需使用的元件，如下範例：

```scss
// 路徑：./src/scss/all.scss

// Required
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';

// 自訂需載入的元件
@import '~bootstrap/scss/forms';
@import '~bootstrap/scss/buttons';
// @import "transitions";
// @import "dropdown";
@import '~bootstrap/scss/button-group';
// ... 以下省略
```

`webpack.config.js` 檔案內容如同前面範例，這邊要注意的是，`function`、`variables`、`mixins` 是必要載入的檔案，所有元件都須依賴這三個檔案。

執行指定任務

```bash
npm run build
```

最後觀察編譯後 CSS 檔案，你會發現檔案縮小了很多，這就是客製化 Bootstrap 載入元件的方法，在每次開發後可自行載入須使用的元件，有利於減少 CSS 檔案大小。

## 載入 jQuery 與 Popper.js 相依模組

在前面安裝 Bootstrap 時，可能會跳出依賴模組未安裝的問題，如下所示：

![bootstrap 依賴模組未安裝](https://i.imgur.com/gAUTawv.png)

Bootstrap 的某些元件如 navbar、alert 需要依賴 jQuery 與 Popper.js 來動作，相信各位對這兩個模組不陌生，以往我們都是採用 CDN 方式引入，這邊我們改採用 npm 方式載入，這邊要注意的是，我們只需要下載 jQuery 即可，Popper.js 已經封裝在 `bootstrap.bundle.js` 內，直接做載入就能使用。

> 套件連結：[jquery](https://www.npmjs.com/package/jquery)

```bash
npm install jquery -P
```

entry 入口處 (`src/main.js`) 引入 Bootstrap 所需模組：

```js
import 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
```

請注意以上寫法，如同前面所說，當相對路徑不存在檔案時，Webpack 會自動幫我們解析 `resolve.modules` 指向的路徑是否有此模組，由於我們未配置 `resolve.modules` 選項，所以預設配置為指向 node_modules 資料夾內。

這邊還有一個重點是關於 Bootstrap 路徑的問題，你可能會想，我是否可以使用以下寫法呢？

```js
import 'jquery';
import 'bootstrap';
```

答案是不可以的，因為 Bootstrap 預設載入路徑為 `bootstrap/dist/js/bootstrap.js`，此檔案並沒有包含 Popper.js，我們必須手動指向以封裝的檔案，也就是 `bootstrap.bundle.js`，且這邊所指的載入，就只是單純的載入 `bootstrap.js` 與 `Popper.js`，關於樣式表的部分，還是得手動添加。

至 `./src/index.html` 新增 Bootstrap 元件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </body>
</html>
```

執行 `npm rnu build` 並查看結果：

![webpack 打包 jquery 與 popper.js 成功](https://i.imgur.com/rkI1RWD.png)

我們可隨意新增需 JavaScript 運行的 Bootstrap 元件至 HTML 上，以便測試是否有成功動作。
