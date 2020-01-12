---
title: Gulp 前端自動化 - 編譯 SCSS
description:
  [
    Sass/SCSS 是 CSS 的預處理器，擴充了既有 CSS 的語法、規則及功能，目前已經算是前端必備的工具，但 .sass/.scss 檔案是無法再 Browser 運行的，需要透過編譯器使之編譯成 CSS 檔案才能成功運行，這一次我們來使用 gulp-sass 這一個套件編譯 .sass/.scss 檔案吧！,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, SCSS]
date: 2019-12-31 17:58:33
---

## 前言

Sass/SCSS 是 CSS 的預處理器，擴充了既有 CSS 的語法、規則及功能，目前已經算是前端必備的工具，但 .sass/.scss 檔案是無法再 Browser 運行的，需要透過編譯器使之編譯成 CSS 檔案才能成功運行，這一次我們來使用 gulp-sass 這一個套件編譯 .sass/.scss 檔案吧！

## 筆記重點

- gulp-sass 安裝
- gulp-sass 基本使用
- gulp-sass 可傳遞選項
- 補充：Dart Sass 與 Node Sass

## gulp-sass 安裝

> 套件連結：[gulp-sass](https://www.npmjs.com/package/gulp-sass)

```bash
$ npm install gulp-sass
```

node-sass 為 gulp-sass 的相依套件，安裝 gulp-sass 的同時會連同 node-sass 一起安裝，代表本地端只須執行安裝 gulp-sass 的指令即可。

## gulp-sass 基本使用

初始專案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/            # 原始資料
|   | - scss/
|       | - all.scss   # SCSS 主檔案
|
| - gulpfile.js        # gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-sass
```

撰寫 SCSS 範例：

```scss
$color-primary: blue;

body {
  color: $color-primary;
  font-size: 16px;
}
```

載入並使用 gulp-sass：

```js
const gulp = require('gulp');
const sass = require('gulp-sass'); // 載入 gulp-sass 套件

gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss') // SCSS 主檔案路徑
    .pipe(sass().on('error', sass.logError)) // 使用 gulp-sass 進行編譯
    .pipe(gulp.dest('./public/css')); // 編譯完成輸出路徑
});
```

執行指定任務：

```bsah
$ gulp sass
```

生成 `./public/css/all.css` 檔案，此時專案結構如下：

```plain
gulpDemo/
|
| - node_modules/
|
| - public/
|   | - css/
|       | - all.css    # 編譯完成的 CSS 檔案
|
| - source/
|   | - scss/
|       | - all.scss   # SCSS 主檔案
|
... 以下省略
```

執行 gulp sass 指令後便會將 `./source/scss/all.scss` 編譯到 `./public/css/all.css`，如果有即時編譯的需求，可使用 gulp.watch() 監控檔案變化，如下範例：

```js
gulp.task('watch', () => {
  gulp.watch('./source/**/*.scss', gulp.series('sass'));
});
```

## gulp-sass 可傳遞選項

可參考 [Node Sass Options](https://github.com/sass/node-sass#options) 可傳遞參數列表，以下為常用的參數配置：

- outputStyle：`nested` | `expanded` | `compact` | `compressed`
  指定輸出型態，默認為 `nested`

範例：

```js
gulp.task('sass', () => {
  return gulp
    .src('./source/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});
```

## 補充：Dart Sass 與 Node Sass

<div class="note warning">Dart Sass 與 Node Sass 都屬於 Sass 的編譯器，Dart Sass 具備編譯輸出為 JavaScript 的能力，目前為 Sass 的主要開發對象，這也代表各種新功能將優先引入；Node Sass 底層使用的是 LibSass，基於 C/C++ 編寫，這使其編譯速度快過 Dart Sass；對於一般開發建議使用 Node Sass，如有新功能的需求，可使用 Dart Sass。</div>

在 gulp-sass 中，預設是使用 Node Sass，如果想將編譯器調整成 Dart Sass，可做以下動作：

> 套件連結：[dart-sass](https://www.npmjs.com/package/dart-sass)

安裝 Dart Sass：

```bash
$ npm install dart-sass
```

更改編譯器為 Dart Sass：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');

sass.compiler = require('dart-sass'); // 將編譯器調整為 Dart Sass
gulp.task('sass', () => {
  return gulp
    .src('./source/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});
```
