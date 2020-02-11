---
title: Gulp 前端自動化 - 基於 Gulp 4 的學習總結
description:
  [
    此篇將紀錄從接觸 Gulp 開始到結束的學習總結。從最基礎的環境建構到各套件的使用，同時也會將之前 Gulp 3 的寫法更改為 Gulp 4 的建議寫法，從無到有的建構出 Gulp 的現代開發環境。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, w3HexSchool, 學習總結]
date: 2020-02-10 23:30:55
---

## 前言

此篇將紀錄從接觸 Gulp 開始到結束的學習總結。從最基礎的環境建構到各套件的使用，同時也會將之前 Gulp 3 的寫法更改為 Gulp 4 的建議寫法，從無到有的建構出 Gulp 的現代開發環境。

## 筆記重點

- 本系列文章
- 環境安裝與執行
- 編譯 Sass/SCSS
- 編譯 Pug
- 使用 Babel 編譯 ES6

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

## 環境安裝與執行

安裝 [Node.js](https://nodejs.org/en/) 依賴環境，並使用以下指令查看是否正確安裝：

```bash
$ node -v
```

在全域環境安裝 gulp-cli：

```bash
$ npm install gulp-cli -g
```

移動至新建立的專案目錄：

```bash
$ mkdir gulp-demo
```

```bash
$ cd gulp-demo
```

建立 `package.json` 文件：

```bash
$ npm init -y
```

在專案環境安裝 gulp：

```bash
$ npm install gulp
```

使用以下指令檢查 gulp 在全域與專案環境下是否正確安裝：

```bash
$ gulp -v
```

## 編譯 Sass/SCSS

建立 `gulpfile.js` 檔案：

```bash
$ touch gulpfile.js
```

將專案結構新增如下：

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
| - package.json
```

安裝 [gulp-sass](https://www.npmjs.com/package/gulp-sass) 套件：

```bash
$ npm install gulp-sass
```

載入並使用 gulp-sass：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');

/* --- 編譯 Sass/SCSS --- */
const scssTask = () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
};

exports.scss = scssTask;
```

執行指定任務即可完成編譯：

```bash
$ gulp sass
```

## 編譯 Pug

將專案結構新增如下：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - scss/
|       | - all.scss
|
|   | - index.pug      # Pug 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json
```

安裝 [gulp-pug](https://www.npmjs.com/package/gulp-pug) 套件：

```bash
$ npm install gulp-pug
```

載入並使用 gulp-pug：

```js
/* --- 編譯 Sass/SCSS --- */
// ...
/* --- 編譯 Pug --- */
const pugTask = () => {
  return gulp
    .src('source/**/*.pug')
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest('./public/'));
};

module.exports = {
  scss: scssTask, // 單獨編譯 Sass/SCSS
  pug: pugTask, // 單獨編譯 Pug
  build: gulp.parallel(scssTask, pugTask), // 並行運行指定任務
};
```

執行指定任務即可完成編譯：

```bash
$ gulp pug
```

## 使用 Babel 編譯 ES6

將專案結構新增如下：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - js
|       | - all.js    # # JavaScript 主檔案
|
|   | - scss/
|       | - all.scss
|
|   | - index.pug
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json
```

安裝 [gulp-babel](https://www.npmjs.com/package/gulp-babel) 相關套件：

```bash
$ npm install gulp-babel @babel/core @babel/preset-env
```

載入並使用 gulp-babel：

```js
/* --- 編譯 Sass/SCSS --- */
// ...
/* --- 編譯 Pug --- */
// ...
/* --- 編譯 ES6+ 代碼 --- */
const babelTask = () => {
  return gulp
    .src('./source/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./public/js/'));
};

module.exports = {
  scss: scssTask, // 單獨編譯 Sass/SCSS
  pug: pugTask, // 單獨編譯 Pug
  babel: babelTask, // 單獨編譯 ES6+ 代碼
  build: gulp.parallel(scssTask, pugTask, babelTask), // 並行運行指定任務
};
```

新增並配置 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"]
}
```

<div class="note danger">Babel 默認只針對 Syntax 做轉換，在這邊使用 @babel/runtime-corejs3 解決此問題，強烈建議觀看原文章，裡面有 @babel/runtime 與 @babel/polyfill 的使用差別。</div>

安裝 [@babel/runtime-corejs3](https://www.npmjs.com/package/@babel/runtime-corejs3)、[@babel/plugin-transform-runtime](https://www.npmjs.com/package/@babel/plugin-transform-runtime) 套件：

```bash
$ npm install @babel/runtime-corejs3 @babel/plugin-transform-runtime
```

更改 `.babelrc` 配置：

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

執行指定任務即可完成編譯：

```bash
$ gulp babel
```
