---
title: Gulp 前端自動化 - 替換 Stream 中的檔案名稱
description:
  [
    上一次介紹了 Minimist 這個套件以區分生產環境與開發環境的處理流程，通常在一般開發中，我們會針對生產環境與開發環境所釋出的檔案個別命名以方便辨認，但在 Gulp 中預設是無法進行重命名操作的，Stream 的起始文件名稱為何，導出時名稱就為何。此篇將介紹如何使用 gulp rename 套件針對 Gulp 中的 Stream 檔案進行重命名動作。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-22 20:56:36
updated: 2020-02-10 14:19:30
---

## 前言

上一次介紹了 Minimist 這個套件以區分生產環境與開發環境的處理流程，通常在一般開發中，我們會針對生產環境與開發環境所釋出的檔案個別命名以方便辨認，但在 Gulp 中預設是無法進行重命名操作的，Stream 的起始文件名稱為何，導出時名稱就為何。此篇將介紹如何使用 gulp rename 套件針對 Gulp 中的 Stream 檔案進行重命名動作。

## 筆記重點

- gulp-rename 安裝
- gulp-rename 基本使用
- gulp-rename 可傳遞方法

## gulp-rename 安裝

> 套件連結：[gulp-rename](https://www.npmjs.com/package/gulp-rename)

```bash
$ npm install gulp-rename
```

無任何相依套件，直接安裝即可。

## gulp-rename 基本使用

<div class="note warning">此次範例會結合 minimist、gulp-sass 套件一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-01-21-gulp-minimist/" target="_blank">minimist</a>、<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/" target="_blank">gulp-sass</a></div>

初始專案結構：

```plain
gulp-demo/
│
├─── node_modules/
├─── source/
│   │
│   └─── scss/
│       │
│       └─── all.scss     # SCSS 主檔案
│
├─── gulpfile.js          # Gulp 配置檔案
├─── package-lock.json
└─── package.json         # 安裝 gulp、gulp-rename、other...
```

載入並使用 gulp-rename：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const parseArgs = require('minimist');
const gulpif = require('gulp-if');
const rename = require('gulp-rename'); // 載入 gulp-rename 套件

// 獲取命令行參數
const argv = parseArgs(process.argv.slice(2)).env;

/* --- SCSS 編譯 --- */
gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpif(argv === 'production', rename('all.min.css'))) // 重命名
    .pipe(gulp.dest('public/css')); // ./public/css/all.min.css
});
```

在 production 環境執行指定任務：

```bash
$ gulp sass --env production
```

此時生成檔案的名稱會從 `all.css` 改為 `all.min.css`，由於上面這一個 rename 名稱是寫死的，如果有多個檔案同時導入，最後在導出檔案時因為名稱相同，可能會發生錯誤，我們可以改使用下面寫法：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const parseArgs = require('minimist');
const gulpif = require('gulp-if');
const rename = require('gulp-rename'); // 載入 gulp-rename 套件

// 獲取命令行參數
const argv = parseArgs(process.argv.slice(2)).env;

/* --- SCSS 編譯 --- */
gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(
      gulpif(
        argv === 'production',
        rename((path) => {
          console.log(path); // { dirname: '.', basename: 'all', extname: '.css' }
          path.basename += '.min';
        })
      )
    )
    .pipe(gulp.dest('public/css')); // ./public/css/all.min.css
});
```

gulp-rename 套件預設可傳入一個 callback，第一個參數可得到初始檔案組成的物件，針對這一個物件做修改，同樣也可以達到重命名的目的，推薦使用此方法。

## gulp-rename 可傳遞方法

可參考 [rename Options](https://www.npmjs.com/package/gulp-rename#usage) 可傳遞參數列表，以下為常用的參數配置：

- dirname：`String`
  檔案目錄，預設為 `./`

- basename：`String`
  基本名稱，預設為 `Stream 初始檔案名稱`

- prefix：`String`
  增加前綴，預設為 `none`

- suffix：`String`
  增加後綴，預設為 `none`

- extname：`String`
  副檔名，預設為 `Stream 初始檔案副檔名`

範例：

```js
gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(
      rename({
        dirname: './component',
        basename: 'stylesheet',
        prefix: 'master-',
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('public/css')); // ./public/component/master-stylesheet.min.css
});
```

以可傳遞選項方式重命名檔案，相比上面幾種方法來說，似乎最為方便，我個人是比較常使用此方法，自己喜歡最重要。
