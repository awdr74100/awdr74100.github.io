---
title: Gulp 前端自動化 - 使用 ES6 Module 撰寫 Gulpfile
description:
  [
    隨著 JavaScript 版本的推進，ES6 版本已逐漸大眾化，在各種開發環境下，ES6 相關語法都能夠更有效率的幫助你完成目的，唯一的問題是，在 Node 環境中，ES6 的大部分特性都以支援，唯獨模組化機制尚未完整支援，都還是得依靠 Babel 等相關編譯器將代碼編譯成 ES5 代碼以解決兼容性問題。此篇將使用 import/export 等 ES6 module 語法撰寫我們的 Gulpfile，並透過 Babel 編譯以保證任務成功運行。,
  ]
categories: [Gulp]
tags: [Gup 4, Node.js]
date: 2020-02-03 18:57:47
updated: 2020-02-04 18:26:55
---

## 前言

隨著 JavaScript 版本的推進，ES6 版本已逐漸大眾化，在各種開發環境下，ES6 相關語法都能夠更有效率的幫助你完成目的，唯一的問題是，在 Node 環境中，ES6 的大部分特性都以支援，唯獨模組化機制尚未完整支援，都還是得依靠 Babel 等相關編譯器將代碼編譯成 ES5 代碼以解決兼容性問題。此篇將使用 import/export 等 ES6 module 語法撰寫我們的 Gulpfile，並透過 Babel 編譯以保證任務成功運行。

## 筆記重點

- Babel 相關套件安裝
- CommonJS 改成 ES6 Module 寫法

## Babel 相關套件安裝

> 套件連結：[@babel/core](https://www.npmjs.com/package/@babel/core)、[@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)、[@babel/register](https://www.npmjs.com/package/@babel/register)

```bash
$ npm install @babel/core @babel/preset-env @babel/register
```

Babel 的核心套件就不多加以介紹，這邊比較值得注意的是 @babel/register 套件，它可以幫助我們改寫 require 命令，為它加上一個 hook，此後，每當使用 require 加載檔案時，就會先用 Babel 進行編譯。

## CommonJS 改成 ES6 Module 寫法

<div class="note warning">此次範例會結合 gulp-sass 套件一起使用，相關文章連結：<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/" target="_blank">gulp-sass</a></div>

初始專案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - scss/
|       | - all.scss   # SCSS 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-sass、@babel/core...
```

CommonJS 模組規範寫法：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');

const compileSass = () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
};

exports.sass = compileSass;
```

上面為 Gulp 4 推薦的寫法，由於 Node 預設就以支援 CommonJS 模組規範，直接執行 gulp sass 即可運行任務，讓我們來改用 ES6 Module 寫法吧！

<div class="note danger">使用 Babel 預編譯 Gulp 文件時，需將名稱從 gulpfile.js 改為 gulpfile.babel.js，否則無法偵測到文件需使用 Babel</div>

將 `gulpfile.js` 改為 `gulpfile.babel.js`：

```bash
$ mv gulpfile.js gulpfile.babel.js
```

新增並配置 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"]
}
```

ES6 Module 模組規範寫法：

```js
import gulp from 'gulp';
import sass from 'gulp-sass';

const compileSass = () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
};

export { compileSass as sass };
```

執行指定任務：

```bash
$ gulp sass
```

此時結果會與 CommonJS 相同，雖然 Gulp 官方範例都是使用 CommonJS 的寫法，但對於早已習慣 import/export 語法的開發者來說，使用 Babel 雖然較為麻煩，無痛上手等特點卻值得你去嘗試使用它。
