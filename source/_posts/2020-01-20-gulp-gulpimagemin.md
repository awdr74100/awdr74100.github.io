---
title: Gulp 前端自動化 - 壓縮並優化圖片
description:
  [
    上一次介紹完了代碼該如何壓縮，這一次我們來介紹該如何壓縮圖片，事實上，影響網頁載入速度最重要的關鍵就在於圖片，無論你的代碼優化的多麼完美，只要一張 size 較大的圖片存在於網頁上，就有可能造成渲染速度的低落，我們所要做的就是將這些圖片進行壓縮，盡可能的減少檔案大小，達到最佳化的目的。此篇將介紹如何使用 gulp-imagemin 套件進行圖片壓縮等應用。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-20 02:01:36
updated: 2020-02-08 01:59:02
---

## 前言

上一次介紹完了代碼該如何壓縮，這一次我們來介紹該如何壓縮圖片，事實上，影響網頁載入速度最重要的關鍵就在於圖片，無論你的代碼優化的多麼完美，只要一張 size 較大的圖片存在於網頁上，就有可能造成渲染速度的低落，我們所要做的就是將這些圖片進行壓縮，盡可能的減少檔案大小，達到最佳化的目的；此篇將介紹如何使用 gulp-imagemin 套件進行圖片壓縮等應用。

## 筆記重點

- gulp-imagemin 安裝
- gulp-imagemin 基本使用
- gulp-imagemin 可傳遞選項
- 補充：optipng 圖片優化器

## gulp-imagemin 安裝

> 套件連結：[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)

```bash
$ npm install gulp-imagemin
```

gulp-imagemin 套件可以幫助我們壓縮 PNG、JPEG、GIF、SVG 等類型圖檔，無任何相依套件需安裝，直接安裝此套件即可。

## gulp-imagemin 基本使用

初始專案結構

```plain
gulp-demo/
│
├─── node_modules/
├─── source/
│   │
│   └─── img/
│       │
│       └─── IMG1.jpg     # JPG 圖檔
│
├─── gulpfile.js          # Gulp 配置檔案
├─── package-lock.json
└─── package.json         # 安裝 gulp、gulp-imagemin
```

載入並使用 gulp-imagemin：

```js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin'); // 載入 gulp-imagemin 套件

gulp.task('imagemin', () => {
  return gulp
    .src('source/img/*')
    .pipe(imagemin()) // 執行優化(壓縮)
    .pipe(gulp.dest('public/img'));
});
```

執行指定任務：

```bash
$ gulp imagemin
```

生成 `./public/img/IMG.JPG` 圖檔，觀察已壓縮與未壓縮檔案大小差異：

未壓縮圖片資訊：

<img src="https://i.imgur.com/grzZrmK.png" alt="未壓縮圖片資訊">

以壓縮圖片資訊：

<img src="https://i.imgur.com/EiWGpcr.png" alt="以壓縮圖片資訊">

在不破壞原有圖檔畫質的情況下，gulp-imagemin 幫助我們壓縮了整整 50% 的大小，從原有的 144.7KB 變成 65.1KB，可以說是相當的有感，除此之外，我們還可以針對壓縮處理做細部設定，下面會再進行補充。

## gulp-imagemin 可傳遞選項

gulp-imagemin 與其他 Gulp 套件相比較為不同，主要依靠各類圖檔優化器進行設定，相關優化器如下：

- [gifsicle](https://github.com/imagemin/imagemin-gifsicle)：GIF 圖片優化器
- [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg)：JPEG 圖片優化器
- [optipng](https://github.com/imagemin/imagemin-optipng)：PNG 圖片優化器
- [svgo](https://github.com/imagemin/imagemin-svgo)：SVG 圖片優化器

上述套件均為 gulp-imagemin 相依套件，無須進行任何下載，配置即可使用，下面為 mozjpeg 使用範例：

```js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg'); // 載入 imagemin-mozjpeg 套件

gulp.task('imagemin', () => {
  return gulp
    .src('source/img/*')
    .pipe(
      imagemin([
        mozjpeg({
          quality: 75, // 壓縮品質
        }),
      ])
    )
    .pipe(gulp.dest('public/img'));
});
```

## 補充：optipng 圖片優化器

這邊補充一下關於 optipng 圖片優化器的應用：

```js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const optipng = require('imagemin-optipng'); // 載入 imagemin-optipng 套件

gulp.task('imagemin', () => {
  return gulp
    .src('source/img/*')
    .pipe(
      imagemin([
        mozjpeg({
          quality: 75,
        }),
        optipng({
          optimizationLevel: 3, // 優化級別
        }),
      ])
    )
    .pipe(gulp.dest('public/img'));
});
```

基本上圖片優化器使用方式都大同小異，參照官方 API 文件即可進行配置。
