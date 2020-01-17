---
title: Gulp 前端自動化 - 編譯 Pug
description:
  [
    Pug 原來的名稱為 Jade，是一套 HTML 的模板語言，你可以把它想像成 CSS 與 SCSS 的關係，Pug 可以幫助開發者簡化語法和模組化開發，一樣需要透過編譯器使之編譯成 HTML 才能正常運行，這次我們會使用 gulp-pug 來完成我們的編譯動作，同時也會簡單介紹 Pug 的語法。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, Pug]
date: 2020-01-02 18:44:48
---

## 前言

Pug 原來的名稱為 Jade，是一套 HTML 的模板語言，你可以把它想像成 CSS 與 SCSS 的關係，Pug 可以幫助開發者簡化語法和模組化開發，一樣需要透過編譯器使之編譯成 HTML 才能正常運行，這次我們會使用 gulp-pug 來完成我們的編譯動作，在後面也會簡單介紹 Pug 的語法。

## 筆記重點

- gulp-pug 安裝
- gulp-pug 基本使用
- gulp-pug 可傳遞選項
- 補充：Pug 語法介紹

## gulp-pug 安裝

> 套件連結：[gulp-pug](https://www.npmjs.com/package/gulp-pug)

```bash
$ npm install gulp-pug
```

舊版套件名稱為 gulp-jade，目前已棄用，原作者建議改使用 gulp-pug 來完成開發，基本上兩者是一樣的東西，由於商標的問題，名稱才由原本的 Jade 改成 Pug 。

## gulp-pug 基本使用

初始專案結構：

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

```js
const gulp = require('gulp');
const pug = require('gulp-pug'); // 載入 gulp-pug 套件

gulp.task('pug', () => {
  return gulp
    .src('source/**/*.pug') // Pug 主檔案路徑
    .pipe(pug()) // 使用 gulp-pug 進行編譯
    .pipe(gulp.dest('./public/')); // 編譯完成輸出路徑
});
```

執行指定任務：

```bash
$ gulp pug
```

生成 `./public/index.html` 檔案，此時專案結構如下：

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

可參考 [Pug Options](https://pugjs.org/api/reference.html) 可傳遞參數列表，以下為常用的參數配置：

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

## 補充：Pug 語法介紹

> 官網介紹：[Pug](https://pugjs.org/api/getting-started.html)

在前面有提到 Pug 可以幫助我們簡化語法和模組化開發，在這補充單元我們就針對這兩個特點去做說明，未來會有 Pug 完整的單元介紹，讓我們先來打好一點基礎以便未來更能夠得心應手。

針對 Pug 簡化語法的特點，相信大多人在上面範例已經有稍微了解到了，先來看看下面這個範例：

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
            .col-md-4.d-flex.justify-content-center
                p textContent
            .col-md-4.d-flex.align-items-center
                p textContent
            .col-md-4
```

上面這段程式碼等同於：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div class="container">
      <div class="col-md-4 d-flex justify-content-center">
        <p>textContent</p>
      </div>
      <div class="col-md-4 d-flex align-items-center">
        <p>textContent</p>
      </div>
      <div class="col-md-4"></div>
    </div>
  </body>
</html>
```

很明顯的 Pug 在撰寫時不需加入起始標籤與結束標籤也就是`<`和`>`，區分父子階層的準則為縮排，透過縮排就能將元素定義為子階層，整體的版面變得非常簡潔，讓我們來繼續來看 Pug 是如何進行模組化應用的。

初始專案結構：

```plain
pugDemo/
|
| - node_modules/
|
| - source/            # 原始資料
|   | - modules/
|       | - head.pug   # head 模組 - 供載入用
|       | - navbar.pug # navbar 模組 - 供載入用
|
|   | - index.pug      # 主要渲染檔案
|   | - layout.pug     # template
|
... 以下省略
```

路徑：`./source/modules/head.pug`

```pug
meta(charset="UTF-8")
meta(name="viewport", content="width=device-width, initial-scale=1.0")
meta(http-equiv="X-UA-Compatible", content="ie=edge")
title Document
```

路徑：`./source/modules/navbar.pug`

```pug
.navbar 這是 Navbar
```

路徑：`./source/layout.pug`

```pug
<!DOCTYPE html>
html(lang="en")
    head
        include ./modules/head.pug
    body
        block navbar
        block content
```

路徑：`./source/index.pug`

```pug
extend ./layout.pug

block content
    .content 這是內容

block navbar
    include ./modules/navbar
```

說明：在 Pug 中我們可以使用 `include` 方式插入內容，如同上面的 `head.pug` 與 `navbar.pug` 模塊，接著我們在主要的渲染檔案 `extned` 我們的 `layout` 檔案，這一個 `layout` 檔案就類似於我們的模板，定義了兩個 `block` 區塊，分別是 `navbar` 和 `content`，我們在 `index.pug` 這個主要檔案插入 `block` 內容，透過編譯，最後就會形成下面的 HTML 檔案：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div class="navbar">這是 Navbar</div>
    <div class="content">這是內容</div>
  </body>
</html>
```

我們可以針對上面這一個範例做出以下統整：

- `include`：在指定的位置插入其他 Pug 內容
- `extend`：指定檔案當作延伸依據，通常搭配 `block`
- `block`：宣告區塊名稱，`extend` 區塊所屬檔案時，可在 `block` 位置插入內容
