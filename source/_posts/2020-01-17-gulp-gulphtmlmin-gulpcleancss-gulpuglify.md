---
title: Gulp 前端自動化 - 壓縮 HTML、CSS、JavaScript 代碼
description:
  [
    在正式上線的網站中，壓縮代碼已經算是不可或缺的一個流程，具有節省空間和提高網頁整體效能等效益，這次來介紹如何使用 gulp-htmlmin、gulp-clean-css、gulp-uglify 三個套件幫助我們壓縮代碼。後面也會補充 gulp-uglify 無法處理 ES6+ 版本代碼，該如何解決等內容。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, HTML, CSS, JavaScript]
date: 2020-01-17 13:19:27
updated: 2020-01-20 02:08:54
---

## 前言

在正式上線的網站中，壓縮代碼已經算是不可或缺的一個流程，具有節省空間和提高網頁整體效能等效益，這次來介紹如何使用 gulp-htmlmin、gulp-clean-css、gulp-uglify 三個套件幫助我們壓縮代碼。後面也會補充 gulp-uglify 無法處理 ES6+ 版本代碼，該如何解決等內容。

## 筆記重點

- gulp-htmlmin、gulp-clean-css、gulp-uglify 安裝
- gulp-htmlmin、gulp-clean-css、gulp-uglify 基本使用
- gulp-htmlmin、gulp-clean-css、gulp-uglify 可傳遞選項
- 補充：gulp-uglify 無法編譯 ES6+ 版本代碼

## gulp-htmlmin、gulp-clean-css、gulp-uglify 安裝

> 套件連結：[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)、[gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)、[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

用於 HTML 壓縮：

```bash
$ npm install gulp-htmlmin
```

用於 CSS 壓縮：

```bash
$ npm install gulp-clean-css
```

用於 JavaScript 壓縮：

```bash
$ npm install gulp-uglify
```

以上三個套件分別用於不同的語言，均無任何相依套件需下載。網上很多人是使用 gulp-minify-css 套件進行 CSS 壓縮處理，但目前這一個套件已被棄用，原作者推薦使用 gulp-clean-css，後面教學都會以這一個套件進行示範。

## gulp-htmlmin、gulp-clean-css、gulp-uglify 基本使用

初始專案結構：

```plain
gulp-demo/
│
└─── node_modules/
└─── source/
│   │
│   └─── css/
│       │
│       └─── style.css    # CSS 主檔案
│   │
│   └─── js/
│       │
│       └─── main.js      # JavaScript 主檔案
│   │
│   └─── index.html       # HTML 主檔案
│
└─── gulpfile.js          # Gulp 配置檔案
└─── package-lock.json
└─── package.json         # 安裝 gulp、gulp-htmlmin、gulp-clean-css、gulp-uglify
```

載入並使用 gulp-htmlmin、gulp-clean-css、gulp-uglify：

```js
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin'); // 載入 gulp-htmlmin 套件
const cleanCSS = require('gulp-clean-css'); // 載入 gulp-clean-css 套件
const uglify = require('gulp-uglify'); // 載入 gulp-uglify 套件

/* --- 壓縮 HTML --- */
gulp.task('minify-html', () => {
  return gulp
    .src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public/'));
});

/* --- 壓縮 CSS --- */
gulp.task('minify-css', () => {
  return gulp
    .src('source/css/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public/css'));
});

/* --- 壓縮 JavaScript --- */
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

在 `./public` 資料夾下，會自動生成壓縮過後的 `index.html`、`style.css`、`main.js` 檔案，此後如果有壓縮代碼的需求，就都不需要依賴線上的工具了，本地端即可完成操作，非常的方便；可能會有人問，壓縮類型只限代碼相關嗎？當然不只！包含各類型圖片都可以進行壓縮，我們就不需要再依靠類似 [tinypng](https://tinypng.com/) 等服務完成了，相關內容將在下一篇文章在做介紹。

## gulp-htmlmin、gulp-clean-css、gulp-uglify 可傳遞選項

可參考 [gulp-htmlmin Options](https://github.com/kangax/html-minifier#options-quick-reference) 可傳遞參數列表，以下為常用的參數配置：

- collapseWhitespace：`true` | `false`
  折疊空白字元，默認為 `false`

- removeComments：`true` | `false`
  刪除 HTML 註釋，默認為 `false`

範例：

```js
gulp.task('minify-html', () => {
  return gulp
    .src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('public/'));
});
```

---

可參考 [gulp-clean-css Options](https://github.com/jakubpawlowicz/clean-css#compatibility-modes) 可傳遞參數列表，以下為常用的參數配置：

- compatibility：`*`、`ie9`、`ie8`、`ie7`
  兼容模式，默認為 `*` = Internet Explorer 10+ 兼容模式

- level：`0`、`1`、`2`
  優化級別，默認為 `1`

範例：

```js
gulp.task('minify-css', () => {
  return gulp
    .src('source/css/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8', level: 2 }))
    .pipe(gulp.dest('public/css'));
});
```

---

可參考 [gulp-uglify Options](https://github.com/mishoo/UglifyJS2#minify-options) 可傳遞參數列表，以下為常用的參數配置：

- compress：參考 [Compress options](https://github.com/mishoo/UglifyJS2#compress-options)
  傳遞一個對象以指定自定義壓縮選項，默認為 `{}`

```js
gulp.task('minify-js', () => {
  return gulp
    .src('source/js/*.js')
    .pipe(
      uglify({
        compress: {
          drop_console: true,
        },
      })
    )
    .pipe(gulp.dest('public/js'));
});
```

## 補充：gulp-uglify 無法編譯 ES6+ 版本代碼

相信大家都已經意識到前面 gulp-uglify 套件使用範例所引發的問題，如果你只是單純的使用 ES5 版本 JavaScript 代碼撰寫，是不會有任何問題的，重點在於，大部分人在撰寫專案時，多少都會使用 ES6+ 版本的代碼做撰寫，這時候如果使用 gulp-uglify 套件壓縮代碼是會跳出錯誤的，gulp-uglify 無法支援 ES6+ 代碼，如果要解決這個問題，我們可以使用 Babel 將 ES6+ 版本代碼編譯成 ES5 代碼，之後再進行 gulp-uglify 的處理，讓我們來嘗試看看是否能夠成功。

安裝 Babel 7：

```bash
$ npm install gulp-babel @babel/core @babel/preset-env
```

載入並使用 gulp-babel：

```js
const gulp = require('gulp');
const babel = require('gulp-babel'); // 載入 gulp-babel 套件
const uglify = require('gulp-uglify'); // 載入 gulp-uglify 套件

gulp.task('minify-js', () => {
  return gulp
    .src('source/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'], // 使用 Babel 編譯
      })
    )
    .pipe(uglify()) // 壓縮並優化 JavaScript
    .pipe(gulp.dest('public/js')); //
});
```

執行指定任務：

```bash
$ gulp minify-js
```

成功編譯！搭配 Babel 確實可以順利完成編譯，但這也代表了此後如果需要使用 gulp-uglify 套件，都得搭配 Babel 才能順利編譯，仔細想想，單純的使用 gulp-uglify 就得引入 Babel，會不會有點大材小用？是否有其他方法呢？當然有！我們可以改使用 gulp-uglify-es 這一個套件，它是官方針對 ES6+ 版本釋出的套件，使用方式與 gulp-uglify 幾乎一樣，下面是相關的說明，由於操作幾乎一樣，就不在多做介紹。

> 套件連結：[gulp-uglify-es](https://www.npmjs.com/package/gulp-uglify-es)
