---
title: Gulp 前端自動化 - 編譯 Pug
description:
  [
    Pug 原來的名稱為 Jade，是一套 HTML 的模板語言，你可以把它想像成 CSS 與 SCSS 的關係，Pug 可以幫助開發者簡化語法和模組化開發，一樣需要透過編譯器使之編譯成 HTML 才能正常運行，這次我們會使用 gulp-pug 來完成我們的編譯動作，同時也會簡單介紹 Pug 的語法。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-02 18:44:48
---

## 前言

Pug 原來的名稱為 Jade，是一套 HTML 的模板語言，你可以把它想像成 CSS 與 SCSS 的關係，Pug 可以幫助開發者簡化語法和模組化開發，一樣需要透過編譯器使之編譯成 HTML 才能正常運行，這次我們會使用 gulp-pug 來完成我們的編譯動作，在後面也會簡單介紹 Pug 的語法。

## 筆記重點

- gulp-pug 安裝
- gulp-pug 基本使用
- gulp-pug 可傳遞選項
  <!-- - 補充：Pug 起手式 -->

## gulp-pug 安裝

> 套件連結：[NPM](https://www.npmjs.com/package/gulp-pug)

```bash
$ npm install gulp-pug
```

舊版套件名稱為 gulp-jade，目前已棄用，原作者建議改使用 gulp-pug 來完成開發，基本上兩者是一樣的東西，由於商標的問題，名稱才由原本的 Jade 改成 Pug 。

## gulp-pug 基本使用

初始檔案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/            # 原始資料
|   | - index.pug      # pug 主檔案
|
| - gulpfile.js        # gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-pug
```

撰寫 Pug 範例：
路徑：`./source/index.pug`

```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title Document
    body
        .container
            .title 測試 Pug
```

載入並使用 gulp-pug：
路徑：`./gulpfile.js`

```js
const gulp = require('gulp');
const pug = require('gulp-pug'); // 載入 gulp-pug 套件

gulp.task('pug', () => {
  return gulp
    .src('source/**/*.pug') // Pug 主檔案路徑
    .pipe(pug()) // 使用 gulp-pug 進行編譯
    .pipe(gulp.dest('public/')); // 編譯完成輸出路徑
});
```

執行指定任務：

```bash
$ gulp pug
```

完成編譯：

```plain
gulpDemo/
|
| - node_modules/
|
| - public/
|   | - index.html     # 編譯完成的 HTML 檔案
|
| - source/
|   | - index.pug      # pug 主檔案
|
... 以下省略
```

執行 gulp pug 指令後便會將 `./source/index.pug` 編譯到 `./public/index.html`，如果有即時編譯的需求，可使用 gulp.watch() 監控檔案變化，如下範例：

```js
gulp.task('watch', () => {
  gulp.watch('./source/**/*.pug', gulp.series('pug'));
});
```

## gulp-pug 可傳遞選項

可參考 [Pug API](https://pugjs.org/api/reference.html) 可傳遞參數列表，以下為常用的參數配置：

- pretty：`true` | `false`
  增加代碼可讀性，默認為 `false`

範例：

```js
gulp.task('pug', () => {
  return gulp
    .src('source/**/*.pug')
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest('public/'));
});
```
