---
title: Gulp 前端自動化 - PostCSS 與 Autoprefixer
description:
  [
    PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS Prefix、CSS Conpress 等等。此篇將結合 gulp-postcss 與 gulp-sass 來說明，途中也會補充常見的 PostCSS Plugin，像是 autoprefixer 和 cssnano。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, PostCSS, SCSS]
date: 2020-01-12 14:50:41
---

## 前言

PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS Prefix、CSS Conpress 等等，此篇將結合 gulp-postcss 與 gulp-sass 來說明，途中也會補充常見的 PostCSS Plugin，像是 autoprefixer 和 cssnano。

## 筆記重點

- gulp-postcss 安裝
- gulp-postcss 基本使用
- gulp-postcss 可傳遞選項
- 補充：Autoprefixer 與 Browserslist
- 補充：使用 cssnano 優化代碼

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

autoprefixer 為 PostCSS 最為著名的 CSS Prefix 插件，前面會先以它當作第一個範例，請務必安裝。

## gulp-postcss 基本使用

<div class="note warning">此次範例會搭配 gulp-sass 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2019-12-31-gulp-gulpsass/">gulp-sass</a></div>

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
| - gulpfile.js        # Gulp 主檔案
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

你會發現 autoprefixer 替我們增加了相關的 CSS Prefix，以往這些語法都需要手動增加，造成許多的不方便，使用此插件即可自動幫我們完成此操作，我認為 PostCSS 更像是一個平台，利用豐富的插件進行前後處理，有沒有發現我說的是前後處理？事實上，某些 PostCSS 插件是以預處理的方式進行，比如說：[postcss-each](https://www.npmjs.com/package/postcss-each)，所以我們並不能直接把 PostCSS 定義為後處理器，得看使用的性質而定。

## gulp-postcss 可傳遞選項

可參考 [postcss.config.js](https://www.npmjs.com/package/postcss-load-config) 可傳遞參數列表，以下為常用的參數配置：

- plugins：`Array` | `Function`
  需要使用的插件，默認為 `none`

- parser：`Function`
  採用的解析器，默認為 `default`

範例：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sugarss = require('sugarss');

gulp.task('scss', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()], { parser: sugarss })) // 更改預設解析器
    .pipe(gulp.dest('./public/css'));
});
```

## 補充：Autoprefixer 與 Browserslist

Browserslist 是一款用於不同前端工具之間共享目標瀏覽器和 Node.js 版本的工具，在之前如果要配置 Babel、ESLint、Autoprefixer 等相關工具，需要再各自的配置文件依序設定，造成許多的麻煩，Browserslist 就是為了解決這一個麻煩而建構，只需配置 `.browserslistrc` 文件，上面所提到的工具即可共享專案配置，這次我們就來介紹如何使用 Browserslist 配置 Autoprefixer 吧！

Browserslist 為 Autoprefixer 的相依套件，可自行檢查是否正確安裝，如需下載，可使用以下指令：

```bash
$ npm install browserslist
```

Browserslist 可以在 `package.json` 中設定，也可以用單獨檔案 `.browserslistrc` 設定。

> 參考 [Full List](https://github.com/browserslist/browserslist#full-list) 進行配置：

package.json:

```json
{
  "browserslist": ["last 1 version", "> 1%", "IE 10"]
}
```

.browserslistrc：

```json
last 2 version
> 1%
IE 10
```

執行 `gulp scss` 指令進行編譯，結果如下：

```scss
.d-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
          flex-flow: row wrap;
}

.text-primary {
  color: blue;
}
```

觀察編譯後檔案可以發現 Autoprefixer 針對了我們的 `.browserslistrc` 配置進行編譯，大功告成！

## 補充：使用 cssnano 優化代碼

cssnano 是基於 PostCSS 所建構的插件，集合多個優化、壓縮代碼等應用插件，使用方式也非常簡單，讓我們先從安裝開始說起：

> 套件連結：[cssnano](https://www.npmjs.com/package/cssnano)

```bash
$ npm install cssnano
```

載入並使用 cssnano：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano'); // 載入 cssnano 套件

gulp.task('scss', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()])) // 陣列方式啟用插件
    .pipe(gulp.dest('./public/css'));
});
```

執行 gulp scss 指令即可進行編譯及壓縮代碼應用，基本上大部分情境都只需要使用 cssnano 默認配置，如果有特殊場景需要單獨配置，可參考官方的說明：

> 預設轉換 vs 高級轉換：[optimisations](https://cssnano.co/optimisations/)

以下示範高級轉換配置：

安裝高級轉換組件：

```bash
$ npm install cssnano-preset-advanced
```

更改 cssnano 的 preset 選項：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

gulp.task('scss', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano({ preset: 'advanced' })])) // 更改 cssnano 預設 preset
    .pipe(gulp.dest('./public/css'));
});
```

編譯即可看到結果。
