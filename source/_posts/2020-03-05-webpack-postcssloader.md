---
title: Webpack 前端打包工具 - 使用 postcss-loader 自動為 CSS 增加 Prefix
description:
  [
    PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，在某些情境也有可能為前處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS Prefix、CSS Conpress 等等。此篇將介紹如何使用 postcss-loader 擴展我們的 CSS 語言特性，主要會以 Autoprefixer 這個 PostCSS Plugin 做示範，自動為編譯完成的 CSS 增加 Prefix，免除手動添加的麻煩。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, PostCSS, SCSS]
date: 2020-03-05 20:09:44
updated: 2020-03-05 20:09:44
---

## 前言

PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，在某些情境也有可能為前處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS Prefix、CSS Conpress 等等。此篇將介紹如何使用 postcss-loader 擴展我們的 CSS 語言特性，主要會以 Autoprefixer 這個 PostCSS Plugin 做示範，自動為編譯完成的 CSS 增加 Prefix，免除手動添加的麻煩。

## 筆記重點

- postcss-loader 安裝
- postcss-loader 基本使用
- postcss-loader 可傳遞選項
- 補充：Autoprefixer 與 Browserslist

## postcss-loader 安裝

> 套件連結：[postcss-loader](https://github.com/postcss/postcss-loader)、[autoprefixer](https://github.com/postcss/autoprefixer)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

postcss-loader 與 autoprefixer：

```bash
$ npm install postcss-loader autoprefixer -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```

Webpack 通過 postcss-loader 來調用 PostCSS，直接安裝即可，以及下面將會以 autoprefixer 結合 PostCSS 作範例，同樣也必須安裝，最後包含基本的 css-loader 以及 mini-css-extract-plugin 也給它安裝下去就對了。

## postcss-loader 基本使用

<div class="note warning">此次範例會搭配 css-loader 與 mini-css-extract-plugin 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a>、<a href="https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/" target="_blank">mini-css-extract-plugin</a></div>

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
| - index.html          # 引入 bundle.js 與 main.css 測試用檔案
| - webpack.config.js   # Webpack 配置檔案
| - package-lock.json
| - package.json        # 已安裝 webpack、webpack-cli、css-loader、mini-css-extract-plugin、postcss-loader、autoprefixer
```

撰寫 CSS 範例：

```css
.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.bg-filter {
  filter: blur(5px);
}
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
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
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 把 postcss-loader 放在 css-loader 前面 (第一步)
          {
            loader: 'postcss-loader',
            options: {
              // 傳遞 plugins 選項並載入 autoprefixer 做使用 (第二步)
              plugins: [require('autoprefixer')],
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

事實上，對於 PostCSS 的 options 配置來說，通常都是撰寫在獨立的 `postcss.config.js` 檔案內，不僅可以增加辨識度，還可以避免檔案結構混亂等問題，這點在下面會再補充，讓我們繼續完成它。

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

以下為經過 autoprefixer 處理後的 `dist/main.css` 檔案內容：

<!-- prettier-ignore-start -->
```css
.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.bg-filter {
  -webkit-filter: blur(5px);
          filter: blur(5px);
}
```
<!-- prettier-ignore-end -->

你會發現 autoprefixer 替我們增加了相關的 CSS Prefix，但僅限於目前支援度較低的語法，比如說 `filter` 語法，這個問題可以透過配置 `.browserslistrc` 來解決，下面會再補充說明，到了這邊。有沒有覺得 PostCSS 很神奇？我認為 PostCSS 更像是一個平台，利用豐富的插件進行前或後處理，有沒有發現我說的是前或後處理？事實上，某些 PostCSS 插件是以預處理的方式進行，比如說：[postcss-each](https://www.npmjs.com/package/postcss-each)，所以我們並不能直接把 PostCSS 定義為後處理器，得看使用的性質而定。

## postcss-loader 可傳遞選項

可參考 [postcss-loader Options](https://github.com/postcss/postcss-loader#options) 可傳遞參數列表，以下為常用的參數配置：

- plugins：`Array` | `Function`
  需要使用的插件，默認為 `none`

範例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')({ cascade: false })],
            },
          },
        ],
      },
    ],
  },
};
```

## 補充：Autoprefixer 與 Browserslist

Browserslist 是一款用於不同前端工具之間共享目標瀏覽器和 Node.js 版本的工具，在之前如果要配置 Babel、ESLint、Autoprefixer 等相關工具，需要再各自的配置文件依序設定，造成許多的麻煩，Browserslist 就是為了解決這一個麻煩而建構，只需配置 `.browserslistrc` 文件，上面所提到的工具即可共享專案配置，這次我們就來介紹如何使用 Browserslist 配置 Autoprefixer 吧！

Browserslist 為 Autoprefixer 的相依套件，可自行檢查是否已完成安裝，如需下載，可使用以下指令：

```bash
$ npm install browserslist
```

Browserslist 可以在 `package.json` 中設定，也可以用單獨檔案 `.browserslistrc` 設定。

> 參考 [Full List](https://github.com/browserslist/browserslist#full-list) 進行配置：

使用 `package.json` 配置:

```json
{
  "browserslist": ["last 2 version", "> 1%", "IE 10"]
}
```

使用 `.browserslistrc` 單獨檔案配置：

```json
last 2 version
> 1%
IE 10
```

再次執行 `npm rum build` 指令進行編譯，此時 `dist/main.css` 結果如下：

<!-- prettier-ignore-start -->
```css
.d-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.justify-content-center {
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
}

.bg-filter {
  -webkit-filter: blur(5px);
          filter: blur(5px);
}
```
<!-- prettier-ignore-end -->

觀察編譯後檔案可以發現 Autoprefixer 針對了我們的 `.browserslistrc` 配置進行編譯，大功告成！
