---
title: Gulp 前端自動化 - 客製化 Bootstrap 樣式並進行編譯
description:
  [
    Bootstrap 目前已經算是前端必備的技能了，相信大部分人在使用時都是以 CDN 的方式進行載入，但這樣子的作法等同於將整個官方預編譯好的 Bootstrap 進行載入，當我們需要客製化 Bootstrap 樣式時，必定得採取其他方法。此篇將介紹如何使用 npm 方式載入 Bootstrap，並透過 Gulp 編譯屬於我們自己的客製化樣式。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, Bootstrap, CSS]
date: 2020-01-24 15:46:07
updated: 2020-02-03 15:31:19
---

## 前言

Bootstrap 目前已經算是前端必備的技能了，相信大部分人在使用時都是以 CDN 的方式進行載入，但這樣子的作法等同於將整個官方預編譯好的 Bootstrap 進行載入，當我們需要客製化 Bootstrap 樣式時，必定得採取其他方法。此篇將介紹如何使用 npm 方式載入 Bootstrap，並透過 Gulp 編譯屬於我們自己的客製化樣式。

## 筆記重點

- 相關套件安裝
- 客製並編譯 Bootstrap 預設變數
- 客製並編譯 Bootstrap 載入元件

## 相關套件安裝

> 套件連結：[gulp-sass](https://www.npmjs.com/package/gulp-sass)、[gulp-postcss](https://www.npmjs.com/package/gulp-postcss)、[autoprefixer](https://www.npmjs.com/package/autoprefixer)、[bootstrap](https://getbootstrap.com/)

bootstrap：

```bash
$ npm install bootstrap
```

require：

```bash
$ npm install gulp-sass gulp-postcss autoprefixer
```

Bootstrap 4 主要由 SCSS 建構而成，當你使用 npm 方式進行安裝時，在下載下來的 package 內即包含未編譯的 SCSS 原始檔案，我們可以針對這一個原始檔案進行客製化並編譯它，在這邊使用 gulp-sass 套件進行編譯，由於 Bootstrap 官方的預編譯版本有使用到 autoprefixer 插件以便自動在構建時向某些 CSS 屬性增加前輟詞，我們在處理編譯後檔案時，也必須參照此作法，所以同時安裝了 gulp-postcss 與 autoprefixer 套件。

## 客製並編譯 Bootstrap 預設變數

<div class="note warning">此次範例會結合 gulp-sass、gulp-postcss 套件一起使用，相關文章連結：<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/" target="_blank">gulp-sass</a>、<a href="https://awdr74100.github.io/2020-01-12-gulp-gulppostcss/" target="_blank">gulp-postcss</a></div>

初始專案結構：

```plain
gulp-demo/
│
└─── node_modules/
└─── source/
│   │
│   └─── scss/
│       │
│       └─── helpers
│           │
│           └─── _variables.scss    # 新增並修改 Bootstrap 預設變數
│       │
│       └─── all.scss     # SCSS 主檔案
│
└─── gulpfile.js          # Gulp 配置檔案
└─── package-lock.json
└─── package.json         # 安裝 gulp、gulp-sass、gulp-postcss、autoprefixer、bootstrap
```

<div class="note warning">推薦使用懶人覆蓋法，將 ./node_modules/bootstrap/scss/_variables.scss 另存新檔至本地端</div>

`./source/scss/helpers/_variables.scss` 新增並修改預設變數(須查詢預設變數名稱)：

```scss
/* 查詢 node_modules/bootstrap/scss/_variables.scss 預設變數並新增到本地檔案 */

$primary: #178ba0; // 隨意修改變數
$success: #35a327;
```

`./source/scss/helpers/_variables.scss` 新增並修改預設變數(懶人覆蓋法)：

<!-- prettier-ignore-start -->
```scss
/* 另存新檔 node_modules/bootstrap/scss/_variables.scss 預設變數並修改 */

// 其他省略 ...
$primary:       #178ba0; // $blue !default;
$success:       #35a327; // $green !default;
```
<!-- prettier-ignore-end -->

根據官方文檔說明，Bootstrap 4 中的每個 SCSS 變數都包含 `!default` 標誌，允許您在自己的 SCSS 中覆蓋變數的預設值，而無需修改 Bootstrap 的原始碼。唯一要注意的是**新變數必須在導入 Bootstrap 的 SCSS 主文件之前**，否則無法成功，如下範例：

<div class="note warning">includePaths 為 gulp-sass 套件的可傳遞選項，接受屬性值為字串符陣列，默認為空陣列，主要用來讓解析引擎遍歷這些傳入的路徑，尋找 SCSS 模塊，已嘗試解析 @import 宣告</div>

路徑：`./source/scss/all.scss`

```scss
/* --- Required (使用 includePaths 方法) --- */
@import 'functions';
@import './helpers/variables'; // 使用本地檔案
@import 'mixins';

/* --- Bootstrap 主檔案 --- */
// @import "../../node_modules/bootstrap/scss/bootstrap.scss";

/* --- Bootstrap 主檔案 (使用 includePaths 方法)--- */
@import 'bootstrap';
```

編寫 `gulpfile.js` 文件

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

/* --- SCSS 編譯 --- */
gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed', // 執行壓縮
        includePaths: ['node_modules/bootstrap/scss/'], // 導入 sass 模塊可能路徑
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()])) // 加入 CSS Prefix
    .pipe(gulp.dest('./public/css'));
});
```

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

執行指定任務：

```bash
$ gulp sass
```

生成 `./public/css/all.css` 檔案，觀察 Bootstrap 預設變數是否成功更改：

官方預編譯版本：

```scss
.text-primary {
  color: #007bff !important;
}

.text-success {
  color: #28a745 !important;
}

// 其他省略
```

客製化版本：

```scss
.text-primary {
  color: #178ba0 !important;
}

.text-success {
  color: #35a327 !important;
}

// 其他省略
```

由上面結果可得知，Bootstrap 預設變數已經被我們給覆蓋掉，同時也代表整個流程正確無誤，事實上 Bootstrap 客製化應用都大同小異，差別只在於你想要如何客製化 Bootstrap 而已。

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

Bootstrap 是一個標準的 OOCSS 範例，也因為使用此設計準則，我們可以很輕鬆的移除沒有使用到的元件。請先將 Bootstrap 主檔案內容複製到 `./source/scss/all.scss` 內，接著註釋掉不需使用的元件，如下範例：

```scss
// 路徑：./source/scss/all.scss

// Required
@import 'functions';
@import 'variables';
@import 'mixins';

// 自訂需載入的元件
@import 'forms';
@import 'buttons';
// @import "transitions";
// @import "dropdown";
@import 'button-group';
// ... 以下省略
```

`gulpfile.js` 檔案內容如同前面範例，這邊要注意的是，`function`、`variables`、`mixins` 是必要載入的檔案，所有元件都須依賴這三個檔案。

執行指定任務

```bash
$ gulp sass
```

最後觀察編譯後 CSS 檔案，你會發現檔案縮小了很多，這就是客製化 Bootstrap 載入元件的方法，在每次開發後可自行載入須使用的元件，有利於減少 CSS 檔案大小。
