---
title: Gulp 前端自動化 - 壓縮並優化 HTML、CSS、JavaScript 代碼
description:
  [
    在正式上線的網站中，壓縮並優化代碼已經算是不可或缺的一個流程，具有節省空間和提高網頁整體效能等效益，這次來介紹如何使用 gulp-htmlmin、gulp-clean-css、gulp-uglify 三個套件幫助我們壓縮並優化代碼。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, HTML, CSS, JavaScript]
date: 2020-01-17 13:19:27
---

## 前言

在正式上線的網站中，壓縮並優化代碼已經算是不可或缺的一個流程，具有節省空間和提高網頁整體效能等特點，這次來介紹如何使用 gulp-htmlmin、gulp-clean-css、gulp-uglify 三個套件幫助我們壓縮並優化代碼。

## 筆記重點

- gulp-htmlmin、gulp-clean-css、gulp-uglify 安裝
- gulp-htmlmin、gulp-clean-css、gulp-uglify 基本使用
- gulp-htmlmin、gulp-clean-css、gulp-uglify 可傳遞選項

## gulp-htmlmin、gulp-clean-css、gulp-uglify 安裝

> 套件連結：[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)、[gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)、[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

gulp-htmlmin **用於 HTML 壓縮並優化**：

```bash
$ npm install gulp-htmlmin
```

gulp-clean-css **用於 CSS 壓縮並優化**：

```bash
$ npm install gulp-clean-css
```

gulp-uglify **用於 JavaScript 壓縮並優化**：

```bash
$ npm install gulp-uglify
```

以上三個套件分別用於不同的語言，均無任何相依套件需下載。網上很多人是使用 gulp-minify-css 套件進行 CSS 壓縮並優化，但目前這一個套件已被棄用，原作者推薦使用 gulp-clean-css，後面教學就會以這一個套件進行。

## gulp-htmlmin、gulp-clean-css、gulp-uglify 基本使用

初始專案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - css/
|       | - style.css  # CSS 主檔案
|
|   | - js/
|       | - main.js    # JavaScript 主檔案
|
|   | - index.html     # HTML 主檔案
|
| - gulpfile.js        # gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-htmlmin、gulp-clean-css、gulp-uglify
```

載入並使用 gulp-htmlmin、gulp-clean-css、gulp-uglify：

```js
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

/* --- 壓縮並優化 HTML --- */
gulp.task('minify-html', () => {
  return gulp
    .src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public/'));
});

/* --- 壓縮並優化 CSS --- */
gulp.task('minify-css', () => {
  return gulp
    .src('source/css/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public/css'));
});

/* --- 壓縮並優化 JavaScript --- */
gulp.task('minify-js', () => {
  return gulp
    .src('source/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

/* --- 同步執行全部任務 --- */
gulp.task('minify', gulp.parallel('minify-html', 'minify-css', 'minify-js'));
```

執行指定任務：

```bash
$ gulp minify
```

在 public 資料夾下，會自動生成壓縮過後的 `index.html`、`style.css`、`main.js` 檔案，此後如果有壓縮代碼的需求，就都不需要依賴線上的工具了，本地端即可完成操作，非常的方便；可能會有人問，壓縮類型只限代碼相關嗎？當然不只！包含各類型圖片都可以進行壓縮，我們就不需要再依靠類似 [tinypng](https://tinypng.com/) 等服務完成了，相關內容將在下一篇文章在做介紹。

## gulp-htmlmin、gulp-clean-css、gulp-uglify 可傳遞選項


