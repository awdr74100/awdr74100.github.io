---
title: Gulp 前端自動化 - 基於 Gulp 4 的學習總結
description:
  [
    此篇將紀錄從接觸 Gulp 開始到後來能夠獨立開發專案所需 Gulp 環境的學習總結。途中也會把之前所遇到的坑做一個解決辦法補充，比如透過 Babel 編譯後，require 語法無法在 Borwser 運行等問題，以及使用 gulp-rename 套件後，該如何連同 HTML 相關的引用路徑做一個響應變動等等，最後也會提供我最為常用的 Gulp 開發環境，供有興趣的開發者快速導入現有專案。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, w3HexSchool, 學習總結]
date: 2020-02-10 23:30:55
---

## 前言

此篇將紀錄從接觸 Gulp 開始到後來能夠獨立開發專案所需 Gulp 環境的學習總結。途中也會把之前所遇到的坑做一個解決辦法補充，比如透過 Babel 編譯後，require 語法無法在 Borwser 運行等問題，以及使用 gulp-rename 套件後，該如何連同 HTML 相關的引用路徑做一個響應變動等等，最後也會提供我最為常用的 Gulp 開發環境，供有興趣的開發者快速導入現有專案。

## 筆記重點

- 本系列文章
- 踩坑 - require 語法無法在 Browser 運行
- 踩坑 - HTML 引用路徑該如何做響應變動
- 總結 - Gulp 常用開發環境

## 本系列文章

- [Gulp 前端自動化 - 環境安裝與執行](https://awdr74100.github.io/2019-12-24-gulp-install/)
- [Gulp 前端自動化 - 編譯 Sass/SCSS](https://awdr74100.github.io/2019-12-31-gulp-gulpsass/)
- [Gulp 前端自動化 - 編譯 Pug](https://awdr74100.github.io/2020-01-02-gulp-gulppug/)
- [Gulp 前端自動化 - 使用 Babel 編譯 ES6](https://awdr74100.github.io/2020-01-08-gulp-gulpbabel/)
- [Gulp 前端自動化 - PostCSS 與 Autoprefixer](https://awdr74100.github.io/2020-01-12-gulp-gulppostcss/)
- [Gulp 前端自動化 - 生成 SourceMap 映射文件](https://awdr74100.github.io/2020-01-13-gulp-gulpsourcemaps/)
- [Gulp 前端自動化 - Browsersync 瀏覽器同步測試工具](https://awdr74100.github.io/2020-01-14-gulp-browsersync/)
- [Gulp 前端自動化 - 自動清除檔案與資料夾](https://awdr74100.github.io/2020-01-15-gulp-del/)
- [Gulp 前端自動化 - 壓縮 HTML、CSS、JavaScript 代碼](https://awdr74100.github.io/2020-01-17-gulp-gulphtmlmin-gulpcleancss-gulpuglify/)
- [Gulp 前端自動化 - 壓縮並優化圖片](https://awdr74100.github.io/2020-01-20-gulp-gulpimagemin/)
- [Gulp 前端自動化 - Minimist 命令行參數解析工具](https://awdr74100.github.io/2020-01-21-gulp-minimist/)
- [Gulp 前端自動化 - 替換 Stream 中的檔案名稱](https://awdr74100.github.io/2020-01-22-gulp-gulprename/)
- [Gulp 前端自動化 - 導入 Bootstrap 客製並編譯它](https://awdr74100.github.io/2020-01-24-gulp-includebootstrap/)
- [Gulp 前端自動化 - CommonJS 模組化設計](https://awdr74100.github.io/2020-01-26-gulp-modular/)
- [Gulp 前端自動化 - 升級至 Gulp 4 完整說明](https://awdr74100.github.io/2020-01-28-gulp-upgradegulp/)
- [Gulp 前端自動化 - 使用 ES6 Module 撰寫 Gulpfile](https://awdr74100.github.io/2020-02-03-gulp-gulpfilebabel/)

## 踩坑 - require 語法無法在 Browser 運行

在之前的 [使用 Babel 編譯 ES6](https://awdr74100.github.io/2020-01-08-gulp-gulpbabel/) 文章中，有提到關於 @babel/runtime 與 @babel/polyfill 的使用方式，滿足 Babel 預設只能處理 Syntax 等問題，但此時也就衍發了另一個問題，那就是編譯後檔案中的 require 語法是無法在 Browser 運行的，require 語法屬於 Node.js 的模組化語法，瀏覽器不兼容此語法，當初卡了這個問題好久，最後找到了 Webpack-stream 這一個套件，透過打包的方式解決此問題，讓我們直接來使用它吧！

初始專案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - js
|       | - all.js     # JavaScript 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-babel
```

> 套件連結：[gulp-babel](https://www.npmjs.com/package/gulp-babel)、[@babel/runtime](https://www.npmjs.com/package/@babel/runtime)、[@babel/plugin-transform-runtime](https://www.npmjs.com/package/@babel/plugin-transform-runtime)

安裝 Babel：

```bash
$ npm install gulp-babel @babel/core @babel/preset-env
```

安裝 Plugins：

```bash
$ npm @babel/runtime @babel/plugin-transform-runtime
```

撰寫 ES6+ 版本代碼：

```js
const arr = [1, 2, 3, 4, 5];

const result = arr.filter((item) => item > 3);

console.log(result);
```

載入並使用 gulp-babel：

```js
const gulp = require('gulp');
const babel = require('gulp-babel');

const babelTask = () =>
  gulp
    .src('./source/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('public/js'));

exports.default = babelTask;
```

新增並配置 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

執行指定任務：

```bash
$ gulp
```

編譯結果：

```js
'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs3/helpers/interopRequireDefault');

var _filter = _interopRequireDefault(require('@babel/runtime-corejs3/core-js-stable/instance/filter'));

var arr = [1, 2, 3, 4, 5];
var result = (0, _filter['default'])(arr).call(arr, function(item) {
  return item > 3;
});
console.log(result);
```

瀏覽器運行結果(報錯)：

<code style="color:#e74b4b">Uncaught ReferenceError: require is not defined</code>

很明顯的 require 語法是無法在瀏覽器上運行的，通常都得透過類似 Webpack 的打包工具，將代碼轉換為適合瀏覽器的可用格式才能成功運行，事實上，Webpack-stream 就是 Webpack 用來與 Gulp 搭配的打包工具，透過 Webpack 的配置方式即可完成操作，讓我們先從安裝開始。

> 套件連結：[webpack-stream](https://www.npmjs.com/package/webpack-stream)、[babel-loader]

```bash
$ npm i webpack-stream babel-loader
```

Webpack 本身是 Webpack-stream 相依套件，我們只需下載 Webpack-stream 即可，另外也必須下載 babel-loader 作為編譯的預處理器。

載入並使用 webpack-stream：

```js
const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

const babelTask = () =>
  gulp
    .src('./source/js/*.js')
    .pipe(
      webpack({
        mode: 'production',
        output: {
          filename: 'all.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest('public/js'));

exports.default = babelTask;
```

執行指定任務：

```bash
$ gulp
```

瀏覽器運行結果(成功)：

`[ 4, 5 ]`

相信熟悉 Webpack 的人對於上面配置應該再清楚不過了，事實上，Webpack-stream 就是用來導入 Webpack 的 Gulp 工具，當 Webpack 所在的 Stream 處理完成時，即進入下一個 pipi 節點，由於 babel-loader 的使用，我們也不需要使用 gulp-babel 了，Webpack 與 Gulp 的結合就是採用此方法來完成，有興趣的可以在進行研究，之後也會推出一系列的 Webpack 文章，敬請期待。
