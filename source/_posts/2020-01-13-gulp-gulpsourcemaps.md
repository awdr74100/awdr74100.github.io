---
title: Gulp 前端自動化 - 生成 SourceMap 映射文件
description:
  [
    前端發展越來越複雜，各種預處理器的使用，導致實際運行代碼不同於開發代碼，除錯(debug)變得困難重重，常見的例子為 Sass/SCSS、CoffeeScript 等預處理器，通常代碼出錯時，編譯器只會告訴你第幾行第幾列出現錯誤，但這對於編譯後的代碼是毫無作用的，我們需要得知的是尚未編譯代碼片段的錯誤，並不是以編譯代碼片段的錯誤。此篇將利用 gulp-sourcemaps 套件生成 SourceMap 文件改善此問題。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, SCSS]
date: 2020-01-13 17:57:03
updated: 2020-02-03 15:34:10
---

## 前言

前端發展越來越複雜，各種預處理器的使用，導致實際運行代碼不同於開發代碼，除錯(debug)變得困難重重，常見的例子為 Sass/SCSS、CoffeeScript 等預處理器，通常代碼出錯時，編譯器只會告訴你第幾行第幾列出現錯誤，但這對於編譯後的代碼是毫無作用的，我們需要得知的是尚未編譯代碼片段的錯誤，並不是以編譯代碼片段的錯誤；此篇將利用 gulp-sourcemaps 套件生成 SourceMap 文件改善此問題。

## 筆記重點

- gulp-sourcemaps 安裝
- gulp-sourcemaps 基本使用
- gulp-sourcemaps 可傳遞選項
- 補充：gulp-concat 生成 sourcemap

## gulp-sourcemaps 安裝

> 套件連結：[gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)

```bash
$ npm install gulp-sourcemaps
```

我們可以使用 gulp-sourcemaps 套件生成 SourceMap 文件，不需要下載其他相依套件，開箱即可使用。

## gulp-sourcemaps 基本使用

<div class="note warning">此次範例會結合 gulp-sass 套件一起使用，相關文章連結：<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/" target="_blank">gulp-sass</a></div>

初始專案結構：

```plain
gulp-demo/
│
└─── node_modules/
└─── source/
│   │
│   └─── scss/
│       │
│       └─── base
│           │
│           └─── _reset.scss
│       │
│       └─── component
│           │
│           └─── _button.scss
│       │
│       └─── helpers
│           │
│           └─── _variables.scss
│       │
│       └─── layout
│           │
│           └─── _footer.scss
│       │
│       └─── all.scss     # SCSS 主檔案
│
└─── gulpfile.js          # Gulp 配置檔案
└─── package-lock.json
└─── package.json         # 安裝 gulp、gulp-sass、gulp-sourcemaps
```

`./source/scss/all.scss` 載入所有組件：

```scss
// base
@import 'base/reset';

// helpers
@import 'helpers/variables';

// component
@import 'component/button';

// layout
@import 'layout/footer';
```

載入並使用 gulp-sourcemaps：

```js
const gulp = require('gulp');
const sass = require('gulp-sass'); // 載入 gulp-sass 套件
const sourcemaps = require('gulp-sourcemaps'); // 載入 gulp-sourcemaps 套件

gulp.task('sass', function() {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(sass().on('error', sass.logError)) // 使用 gulp-sass 進行編譯
    .pipe(sourcemaps.write('./')) // 生成 sourcemaps 文件 (.map)
    .pipe(gulp.dest('public/css'));
});
```

執行指定任務：

```bash
$ gulp sass
```

生成 `./public/css/all.css` 和 `./public/css/all.css.map`檔案，開啟 DevTool 工具並觀察 sourcemap 是否映射成功：

<img src="https://i.imgur.com/C1e8h43.jpg" alt="DevTool 觀察 sourcemap">

從上圖可以發現，各元素映射的 Style 路徑從原本的 all.css 改為尚未編譯的 .scss 路徑，這樣的結果也就代表 sourcemap 映射成功，相同的原理也可套用在其他檔案類型身上，下面會再做補充。

## gulp-sourcemaps 可傳遞選項

可參考 [sourcemap Options](https://www.npmjs.com/package/gulp-sourcemaps#init-options) 可傳遞參數列表，以下為常用的參數配置：

- sourceMappingURLPrefix：`String`
  設定映射源的前綴，默認為 `none`

範例：

```js
gulp.task('sass', function() {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(sass().on('error', sass.logError)) // 使用 gulp-sass 進行編譯
    .pipe(
      sourcemaps.write('./', {
        sourceMappingURLPrefix: 'scss',
      })
    ) // 寫入 sourcemaps
    .pipe(gulp.dest('public/css'));
});
```

## 補充：gulp-concat 生成 sourcemap

gulp-concat 套件主要為合併檔案用，通常在開發專案時，我們會引入許多的套件，比如說 jquery、bootstrap 等等，這些分散的檔案我們需要一個一個引入，造成許多的麻煩，這時我們就可以利用合併檔案的方式彙整成一個檔案，供 HTML 引入，這時問題就來了，這一個彙整檔案是無法映射原始單獨檔案的，造成除錯(debug)較為困難，這一個問題也可以由 sourcemap 來解決，讓我們先從安裝開始。

> 套件連結：[gulp-concat](https://www.npmjs.com/package/gulp-concat)、[jquery](https://www.npmjs.com/package/jquery)、[bootstrap](https://www.npmjs.com/package/bootstrap)

gulp-concat：

```bash
$ npm install gulp-concat
```

jquery：

```bash
$ npm install jquery
```

bootstrap：

```bash
$ npm install bootstrap
```

此次範例會結合 jquery 與 bootstrap 一起使用，說明如何使用 gulp-concat 合併檔案並生成 sourcemap。

載入並使用 gulp-concat：

```js
gulp.task('vendorsJs', () => {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.slim.min.js',
      './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
      './source/js/all.js',
    ])
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(concat('vendors.js')) // 合併檔案，名稱為：vendors.js
    .pipe(sourcemaps.write('./')) // 寫入 sourcemaps
    .pipe(gulp.dest('./public/js'));
});
```

執行指定任務：

```bash
$ gulp vendorsJs
```

生成 `./public/js/vendors.js` 和 `./public/js/vendors.js.map` 檔案，開啟 DevTool 工具並觀察 sourcemap 是否映射成功：

<img src="https://i.imgur.com/jMPTkLZ.jpg" alt="DevTool 觀察 sourcemap">

從上圖可以發現，頁面映射的 JavaScript 路徑從原本的 vendors.css 改為尚未編譯的各獨立檔案路徑，這樣的結果也就代表 sourcemap 映射成功。

從前面的幾個範例可以發現，sourcemap 的生成主要是利用 `sourcemaps.init()` 與 `sourcemaps.write()` 來完成，前者用來初始化，建議放置在第一個 pipe 節點，後者用來寫入 sourcemap，建議放在輸出文件的前一個 pipe 節點；事實上，gulp-sourcemaps 支援非常多種類型檔案生成 sourcemap，查詢檔案類型是否支援可參考下面連結：

> 支援列表：[Plugins with gulp sourcemaps support](https://github.com/gulp-sourcemaps/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support)
