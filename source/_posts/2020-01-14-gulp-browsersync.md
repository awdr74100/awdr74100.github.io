---
title: Gulp 前端自動化 - Browsersync 瀏覽器同步測試工具
description:
  [
    在開發 Web 應用時，我們很常針對瀏覽器執行重新整理的指令，以便查看最新修改過後結果，從專案開始到結束，我們可能按了無數次的 F5，造成效率的低落，這時我們就可以使用 BrowserSync 這款工具，BrowserSync 能讓瀏覽器實現、快速響應你的文件修改(HTML、JavaScript、CSS、Sass、Less)並自動刷新頁面，啟動時會在本地端開啟一個虛擬伺服器，這也代表了不同裝置間能夠依靠伺服器位址同步更新並觀看頁面，無論你是前端還是後端工程師，都非常建議使用這款工具。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, SCSS, Pug, Babel]
date: 2020-01-14 23:38:37
---

## 前言

在開發 Web 應用時，我們很常針對瀏覽器執行重新整理的指令，以便查看最新修改過後結果，從專案開始到結束，我們可能按了無數次的 F5，造成效率的低落，這時我們就可以使用 BrowserSync 這款工具，BrowserSync 能讓瀏覽器實現、快速響應你的文件修改(HTML、JavaScript、CSS、Sass、Less)並自動刷新頁面，啟動時會在本地端開啟一個虛擬伺服器，這也代表了不同裝置間能夠依靠伺服器位址同步更新並觀看頁面，無論你是前端還是後端工程師，都非常建議使用這款工具。

## 筆記重點

- BrowserSync 安裝
- BrowserSync 基本使用
- BrowserSync 可傳遞選項

## BrowserSync 安裝

> 套件連結：[browser-sync](https://browsersync.io/docs/gulp)

```bash
$ npm install browser-sync
```

npm 上有一款名為 browsersync 的套件，這個套件並不是 BrowserSync 官方的套件，正確的套件名稱為 browser-sync，請安裝正確的官方套件，以便後面的範例能夠順利進行。

## BrowserSync 基本使用

<div class="note warning">此次範例會結合 gulp-sass 套件一起使用，相關文章連結：<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/">gulp-sass</a></div>

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
|   | - index.html     # HTML 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-sass、browser-sync
```

載入並使用 browser-sync：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

/* --- 編譯 Sass/SCSS --- */
gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream()); // <= 注入更改內容
});

/* --- 複製 HTML 主檔案 --- */
gulp.task('copyHTML', (done) => {
  gulp
    .src('./source/*.html')
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream()); // <= 注入更改內容
  done();
});

/* --- 監控指定目錄是否更改 --- */
gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './public', // <= 指向虛擬伺服器需存取的資料夾
    },
  });
  gulp.watch('./source/*.html', gulp.series('copyHTML'));
  gulp.watch('./source/**/*.scss', gulp.series('sass'));
});
```

執行指定任務：

```bash
$ gulp watch
```

此時瀏覽器會開啟指向 `./public` 資料夾的虛擬伺服器(localhost:xxxx)，配合 `gulp.watch()` 的使用，能夠在編寫 `./source` 資料夾中的指定檔案時(檔案有更動時)，實現 LiveReload 的效果，從此之後都不需要在按 F5 重新整理囉。

可能有人已經發現上面這段代碼的 Bug 了，在執行 gulp watch 時，雖然會直接開啟 localhost 伺服器，但執行的代碼並不是最新的，需要觸發指定目錄的更改，才能夠執行編譯並渲染最新畫面，正確的流程應該為執行 gulp watch 指令時，我們需要再開啟 localhost 伺服器之前，執行 `sass` 與 `copyHTML` 任務，已讓虛擬伺服器渲染最新的畫面，針對上述所提到的問題，我們可以新增一個 Gulp Task：

<div class="note warning">當任務名稱為 default 時，只須執行 gulp 指令即可執行任務，不需要執行完整的 gulp default 指令</div>

```js
gulp.task('default', gulp.series('copyHTML', 'sass', 'watch'));
```

這是一個名為 default 的 Task，主要利用了 `gulp.series()` 同步進行任務語法來完成，也就代表當執行 gulp 指令時，會依序執行 `copyHTML`、`sass`、`watch` 任務，此時的結果正好符合我們的預期，問題也就解決了。

## BrowserSync 可傳遞選項

可參考 [BrowserSync Options](https://www.browsersync.io/docs/options) 可傳遞參數列表，以下為常用的參數配置：

- port：`Number`
  端口號碼，默認為 `3000`

- reloadDelay：`Number`
  瀏覽器重新加載時間(以毫秒為單位)，默認為 `0`

範例：

```js
gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
    port: 6600,
    reloadDelay: 2000,
  });
  gulp.watch('./source/*.html', gulp.series('copyHTML'));
  gulp.watch('./source/**/*.scss', gulp.series('sass'));
});
```
