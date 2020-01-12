---
title: Gulp 前端自動化 - PostCSS 後處理器
description:
  [
    PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS prefix、CSS conpress 等等，此篇將結合 gulp-postcss 與 gulp-sass 來說明，途中也會補充常見的 PostCSS Plugin，像是 autoprefixer 和 cssnano。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, SCSS]
date: 2020-01-12 14:50:41
---

## 前言

PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS prefix、CSS conpress 等等，此篇將結合 gulp-postcss 與 gulp-sass 來說明，途中也會補充常見的 PostCSS Plugin，像是 autoprefixer 和 cssnano。

## 筆記重點

- gulp-postcss 安裝
- gulp-postcss 基本使用
- gulp-postcss 可傳遞選項

## gulp-postcss 安裝

> 套件連結：[gulp-postcss](https://www.npmjs.com/package/gulp-postcss)、[autoprefixer](https://www.npmjs.com/package/autoprefixer)

gulp-postcss：

```bash
$ npm install gulp-postcss
```

autoprefixer：

```bash
$ npm install autoprefixer
```

autoprefixer 為 PostCSS 最為著名的 CSS prefix 插件，前面會先以它當作第一個範例，請務必安裝。

# gulp-postcss 基本使用

<div class="note warning">此次範例會搭配 gulp-sass 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/">gulp-scss</a></div>

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
| - package.json       # 安裝 gulp、gulp-sass、gulp-postcss、autoprefixer
```

撰寫 SCSS 範例：

```scss
$color-primary: blue;

.d-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
}

.text-primary {
  color: $color-primary;
}
```

載入並使用 gulp-postcss：

```js
const gulp = require('gulp');
const sass = require('gulp-sass'); // 載入 gulp-sass 套件
const postcss = require('gulp-postcss'); // 載入 gulp-postcss 套件
const autoprefixer = require('autoprefixer'); // 載入 autoprefixer 套件

gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()])) // 將編譯完成的 CSS 做 PostCSS 處理
    .pipe(gulp.dest('./public/css'));
});
```

執行指定任務：

```bash
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

以下為經過 autoprefixer 處理後的 CSS 檔案內容：

```css
.d-flex {
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-flow: row wrap;
}

.text-primary {
  color: blue;
}
```

你會發現 autoprefixer 替我們增加了相關的 CSS prefix，以往這些語法都需要手動增加，造成許多的不方便，使用此插件即可自動幫我們完成此操作，我認為 PostCSS 更像是一個平台，利用豐富的插件進行前後處理，有沒有發現我說的是前後處理？事實上，某些 PostCSS 插件是以預處理的方式進行，比如說：[postcss-each](https://www.npmjs.com/package/postcss-each)，所以我們並不能把 PostCSS 定義為後處理器，接下來我們來了解 autoprefixer 還有什麼特殊功能吧！

## gulp-postcss 可傳遞選項

如同前面所說，PostCSS 更像是一個平台，可傳遞參數也只是單純的傳遞需要啟用的插件，在這個章節我們就改來介紹 autoprefixer 的自定義選項功能：

