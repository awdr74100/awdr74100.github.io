---
title: Gulp 前端自動化 - 基於 Gulp 4 的學習總結
description:
  [
    此篇將紀錄從接觸 Gulp 開始到後來能夠獨立開發專案所需 Gulp 環境的學習總結。前面會先把之前所遇到的坑做一個解決辦法補充，比如透過 Babel 編譯後，require 語法無法在 Browser 運行等問題，以及使用 gulp-rename 套件後，該如何連同 HTML 相關的引用路徑做一個響應變動等等，最後也會提供我最為常用的 Gulp 開發環境，供有興趣的開發者快速導入現有專案。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, w3HexSchool]
date: 2020-02-10 23:30:55
updated: 2020-02-13 18:25:51
---

## 前言

此篇將紀錄從接觸 Gulp 開始到後來能夠獨立開發專案所需 Gulp 環境的學習總結。前面會先把之前所遇到的坑做一個解決辦法補充，比如透過 Babel 編譯後，require 語法無法在 Browser 運行等問題，以及使用 gulp-rename 套件後，該如何連同 HTML 相關的引用路徑做一個響應變動等等，最後也會提供我最為常用的 Gulp 開發環境，供有興趣的開發者快速導入現有專案。

## 筆記重點

- 本系列文章
- 踩坑 - require 語法無法在 Browser 運行
- 踩坑 - HTML 引用路徑該如何做響應變動
- 總結 - Gulp 常用開發環境

## 本系列文章

- [Gulp 前端自動化 - 環境安裝與執行](https://awdr74100.github.io/2019-12-24-gulp-install/)
- [Gulp 前端自動化 - 編譯 Sass/SCSS](https://awdr74100.github.io/2019-12-31-gulp-gulpsass/)
- [Gulp 前端自動化 - 編譯 Pug](https://awdr74100.github.io/2020-01-02-gulp-gulppug/)
- [Gulp 前端自動化 - 使用 Babel 編譯 ES6](https://awdr74100.github.io/2020-01-08-gulp-gulpbabel/)
- [Gulp 前端自動化 - PostCSS 與 Autoprefixer](https://awdr74100.github.io/2020-01-12-gulp-gulppostcss/)
- [Gulp 前端自動化 - 生成 SourceMap 映射文件](https://awdr74100.github.io/2020-01-13-gulp-gulpsourcemaps/)
- [Gulp 前端自動化 - Browsersync 瀏覽器同步測試工具](https://awdr74100.github.io/2020-01-14-gulp-browsersync/)
- [Gulp 前端自動化 - 自動清除檔案與資料夾](https://awdr74100.github.io/2020-01-15-gulp-del/)
- [Gulp 前端自動化 - 壓縮 HTML、CSS、JavaScript 代碼](https://awdr74100.github.io/2020-01-17-gulp-gulphtmlmin-gulpcleancss-gulpuglify/)
- [Gulp 前端自動化 - 壓縮並優化圖片](https://awdr74100.github.io/2020-01-20-gulp-gulpimagemin/)
- [Gulp 前端自動化 - Minimist 命令行參數解析工具](https://awdr74100.github.io/2020-01-21-gulp-minimist/)
- [Gulp 前端自動化 - 替換 Stream 中的檔案名稱](https://awdr74100.github.io/2020-01-22-gulp-gulprename/)
- [Gulp 前端自動化 - 導入 Bootstrap 客製並編譯它](https://awdr74100.github.io/2020-01-24-gulp-includebootstrap/)
- [Gulp 前端自動化 - CommonJS 模組化設計](https://awdr74100.github.io/2020-01-26-gulp-modular/)
- [Gulp 前端自動化 - 升級至 Gulp 4 完整說明](https://awdr74100.github.io/2020-01-28-gulp-upgradegulp/)
- [Gulp 前端自動化 - 使用 ES6 Module 撰寫 Gulpfile](https://awdr74100.github.io/2020-02-03-gulp-gulpfilebabel/)

## 踩坑 - require 語法無法在 Browser 運行

在之前的 [使用 Babel 編譯 ES6](https://awdr74100.github.io/2020-01-08-gulp-gulpbabel/) 文章中，有提到關於 @babel/runtime 與 @babel/polyfill 的使用方式，解決 Babel 預設只能處理 Syntax 的問題，但此時也就衍發了另一個問題，那就是編譯後檔案中的 require 語法是無法在 Browser 運行的，require 語法屬於 Node.js 的模組化語法，瀏覽器不兼容此語法，當初卡了這個問題好久，最後找到了 Webpack-stream 這一個套件，透過打包的方式解決此問題，讓我們直接來使用它吧！

初始專案結構：

```plain
gulp-demo/
│
├─── node_modules/
├─── source/
│   │
│   └─── js/
│       │
│       └─── all.js
│
├─── gulpfile.js
├─── package-lock.json
└─── package.json
```

> 套件連結：[gulp-babel](https://www.npmjs.com/package/gulp-babel)、[@babel/runtime-corejs3](https://www.npmjs.com/package/@babel/runtime-corejs3)、[@babel/plugin-transform-runtime](https://www.npmjs.com/package/@babel/plugin-transform-runtime)

安裝 Babel：

```bash
$ npm install gulp-babel @babel/core @babel/preset-env
```

安裝 Plugins：

```bash
$ npm install @babel/runtime-corejs3 @babel/plugin-transform-runtime
```

撰寫 ES6+ 版本代碼：

```js
const arr = [1, 2, 3, 4, 5];

const result = arr.filter((item) => item > 3);

console.log(result);
```

載入並使用 gulp-babel：

```js
const gulp = require('gulp');
const babel = require('gulp-babel');

const babelTask = () => gulp.src('./source/js/*.js').pipe(babel()).pipe(gulp.dest('public/js'));

exports.default = babelTask;
```

新增並配置 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

執行指定任務：

```bash
$ gulp
```

編譯結果：

```js
'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs3/helpers/interopRequireDefault');

var _filter = _interopRequireDefault(require('@babel/runtime-corejs3/core-js-stable/instance/filter'));

var arr = [1, 2, 3, 4, 5];
var result = (0, _filter['default'])(arr).call(arr, function (item) {
  return item > 3;
});
console.log(result);
```

瀏覽器運行結果(報錯)：

<code style="color:#e74b4b">Uncaught ReferenceError: require is not defined</code>

很明顯的 require 語法是無法在瀏覽器上運行的，通常都得透過像是 Webpack 的打包工具，將代碼轉換為適合瀏覽器的可用格式才能成功運行，事實上，Webpack-stream 就是 Webpack 用來與 Gulp 搭配的集成工具，透過 Webpack 的配置方式即可完成操作，讓我們先從安裝開始。

> 套件連結：[webpack-stream](https://www.npmjs.com/package/webpack-stream)、[babel-loader](https://github.com/babel/babel-loader)

```bash
$ npm install webpack-stream babel-loader
```

Webpack 本身是 Webpack-stream 相依套件，我們只需下載 Webpack-stream 即可，另外也必須下載 babel-loader 作為編譯的預處理器。

載入並使用 webpack-stream：

```js
const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

const babelTask = () =>
  gulp
    .src('./source/js/*.js')
    .pipe(
      webpack({
        mode: 'production',
        output: {
          filename: 'all.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest('public/js'));

exports.default = babelTask;
```

執行指定任務：

```bash
$ gulp
```

瀏覽器運行結果(成功)：

`[ 4, 5 ]`

相信熟悉 Webpack 的人對於上面配置應該再清楚不過了，事實上，Webpack-stream 就是用來導入 Webpack 的 Gulp 工具，當 Webpack 所在的 Stream 處理完成時，即進入下一個 pipe 節點，由於 babel-loader 的使用，我們也不需要使用 gulp-babel 了，Webpack 與 Gulp 的結合就是採用此方法來完成，有興趣的可以在進行研究，之後也會推出一系列的 Webpack 文章，敬請期待。

## 踩坑 - HTML 引用路徑該如何做響應變動

在我們之前介紹到 minimist 命令行參數解析工具時，有提到關於 development 與 production 環境的差別，當時是以 gulp-clean-css 與 gulp-rename 套件去做示例，假設當前為 production 環境，需使用 gulp-clean-css 壓縮代碼並且使用 gulp-rename 更改名稱為 `.min.css` 檔，此時當我們開啟 index.html 檔案時，會發現 js 與 css 都沒有被載入進來，因為此環境編譯後檔案是不存在 `.js` 或 `.css` 檔案的，檔名通通都改成 `.min` 了，可能會有人手動去更改編譯前的引用路徑，但這有違使用自動化工具的目的，這時我們可以使用 gulp-html-replace 套件來解決這一個問題，讓我們直接開始吧！

初始專案結構：

```plain
gulp-demo/
│
├─── node_modules/
├─── source/
│   │
│   └─── css/
│       │
│       └─── all.css
│   │
│   └─── index.html
│
├─── gulpfile.js
├─── package-lock.json
└─── package.json
```

> 套件連結：[del](https://www.npmjs.com/package/del)、[gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)、[gulp-if](https://www.npmjs.com/search?q=gulp-if)、[gulp-rename](https://www.npmjs.com/package/gulp-rename)、[minimist](https://www.npmjs.com/package/minimist)、[gulp-html-replace](https://www.npmjs.com/package/gulp-html-replace)

相關套件：

```bash
$ npm install del gulp-clean-css gulp-if gulp-rename minimist
```

主要套件：

```bash
$ npm install gulp-html-replace
```

載入並使用 gulp-html-replace：

```js
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const parseArgs = require('minimist');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const del = require('del');
const htmlreplace = require('gulp-html-replace');

// 獲取命令行參數
const argv = parseArgs(process.argv.slice(2)).env;

const htmlTask = () => {
  return gulp
    .src('./source/*.html')
    .pipe(
      gulpif(
        argv === 'production',
        htmlreplace({
          css: 'css/all.min.css', // 針對指定 name 做替換
        })
      )
    )
    .pipe(gulp.dest('./public'));
};

const cssTask = () => {
  return gulp
    .src('source/css/*.css')
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(
      gulpif(
        argv === 'production',
        rename({
          suffix: '.min',
        })
      )
    )
    .pipe(gulp.dest('public/css'));
};

const clean = () => {
  return del(['public']);
};

exports.default = gulp.series(clean, gulp.parallel(htmlTask, cssTask));
```

開啟 `./source/index.html` 並輸入以下註解：

```html
<!-- build:css -->
<link rel="stylesheet" href="css/all.css" />
<!-- endbuild -->
```

在 production 環境執行指定任務：

```bash
$ gulp --env production
```

編譯結果：

```html
<link rel="stylesheet" href="css/all.min.css" />
```

從上面結果可得知，使用 gulp-html-replace 套件確實可以響應引用路徑，它的原理其實很簡單，如下範例：

`index.html`：

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html>
<html>
  <head>

    <!-- build:css1 -->
    <link rel="stylesheet" href="css/style1" />
    <!-- endbuild -->

    <!-- build:css2 -->
    <link rel="stylesheet" href="css/style2" />
    <!-- endbuild -->

  </head>
  <body>

    <!-- build:js -->
    <script src="js/js1"></script>
    <script src="js/js2"></script>
    <script src="js/js3"></script>
    <!-- endbuild -->
    
  </body>
</html>
```
<!-- prettier-ignore-end -->

`gulpfile.js`：

```js
htmlreplace({
  css1: 'css/style1.min.css', // 針對 css1 塊做替換
  css2: 'css/style2.min.css', // 針對 css2 塊做替換
  js: 'js/all.min.js', // 針對 js 塊做替換
});
```

編譯結果：

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="css/style1.min.css" />

    <link rel="stylesheet" href="css/style2.min.css" />
  </head>
  <body>
    <script src="js/all.min.js"></script>
  </body>
</html>
```

使用 gulp-html-replace 的關鍵在於 `<!-- build:name -->` 註解中的 name 需要與 `htmlreplace` 中的 `key` 相互對應，告知此區塊開始進行處理，並且加入`<!-- endbuild -->` 告知此處結束處理，這邊要注意的是此操作是以塊的方式進行處理，如同上面範例的 js 區塊，不管有幾行的代碼，通通都會被取代成相對應的代碼，搭配 gulp-if 等相關套件即可解決 gulp-rename 後引用路徑錯誤的問題，達到真正的自動化效果。

## 總結 - Gulp 常用開發環境

| 主要套件                                                   | 優化套件                                                       | 輔助套件                                                             | 通用套件                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| [gulp-babel](https://www.npmjs.com/package/gulp-babel)     | [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) | [gulp-rename](https://www.npmjs.com/package/gulp-rename)             | [browser-sync](https://www.npmjs.com/package/browser-sync)     |
| [gulp-pug](https://www.npmjs.com/package/gulp-pug)         | [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)     | [gulp-html-replace](https://www.npmjs.com/package/gulp-html-replace) | [minimist](https://www.npmjs.com/package/minimist)             |
| [gulp-sass](https://www.npmjs.com/package/gulp-sass)       | [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)   | [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)     | [webpack-stream](https://www.npmjs.com/package/webpack-stream) |
| [gulp-postcss](https://www.npmjs.com/package/gulp-postcss) | [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)       | [gulp-if](https://www.npmjs.com/package/gulp-if)                     | [del](https://www.npmjs.com/package/del)                       |

安裝套件：

```bash
$ npm i gulp-babel gulp-sass gulp-postcss gulp-clean-css gulp-htmlmin gulp-imagemin gulp-uglify gulp-rename gulp-html-replace gulp-sourcemaps gulp-if browser-sync minimist webpack-stream del
```

Babel 相關套件：

```bash
$ npm i @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime-corejs3
```

PostCSS 相關套件：

```bash
$ npm i autoprefixer
```

Webpack-stream 相關套件：

```bash
$ npm i babel-loader
```

新增並配置 `gulpfile.js`：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const parseArgs = require('minimist');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const htmlreplace = require('gulp-html-replace');
const webpack = require('webpack-stream');

/* --- 獲取命令行參數 --- */
const argv = parseArgs(process.argv.slice(2)).env;

/* --- 編譯 Sass/SCSS --- */
const scssTask = () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss())
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(
      gulpif(
        argv === 'production',
        rename({
          suffix: '.min',
        })
      )
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'));
};

/* --- 編譯 HTML --- */
const htmlTask = () => {
  return gulp
    .src('source/**/*.html')
    .pipe(gulpif(argv === 'production', htmlmin({ collapseWhitespace: true })))
    .pipe(
      gulpif(
        argv === 'production',
        htmlreplace({
          css: 'css/all.min.css',
          js: 'js/all.min.js',
        })
      )
    )
    .pipe(gulp.dest('./public/'));
};

/* --- 編譯 ES6+ 代碼 --- */
const babelTask = () => {
  return gulp
    .src('./source/js/*.js')
    .pipe(babel())
    .pipe(
      webpack({
        mode: 'development',
        output: {
          filename: 'all.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
              },
            },
          ],
        },
      })
    )
    .pipe(gulpif(argv === 'production', uglify()))
    .pipe(
      gulpif(
        argv === 'production',
        rename({
          suffix: '.min',
        })
      )
    )
    .pipe(gulp.dest('./public/js/'));
};

/* --- 本地伺服器 --- */
const watch = () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
  });
  gulp.watch('./source/js/*.js', gulp.series(babelTask));
  gulp.watch('./source/*.html', gulp.series(htmlTask));
  gulp.watch('./source/scss/*.scss', gulp.series(scssTask));
};

/* --- 刪除指定目錄檔案 --- */
const cleanTask = () => {
  return del(['./public']);
};

/* --- 壓縮圖檔 --- */
const imageTask = () => {
  return gulp
    .src('source/img/*')
    .pipe(gulpif(argv === 'production', imagemin()))
    .pipe(gulp.dest('public/img'));
};

module.exports = {
  scss: scssTask, // 單獨編譯 Sass/SCSS
  html: htmlTask, // 單獨編譯 HTML
  babel: babelTask, // 單獨編譯 ES6+ 代碼
  image: imageTask, // 壓縮圖檔
  clean: cleanTask, // 刪除指定檔案目錄
  serve: gulp.series(cleanTask, gulp.parallel(scssTask, htmlTask, babelTask, imageTask), watch),
  build: gulp.series(cleanTask, gulp.parallel(scssTask, htmlTask, babelTask, imageTask)),
};
```

新增並配置 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

新增並配置 `postcss.config.js`：

```js
module.exports = {
  plugins: [require('autoprefixer')],
};
```

新增並配置 `.browserslistrc`：

```json
last 2 version
> 1%
IE 10
```

學到了這邊，看到很多相關文章都在探討 Webpack 將會取代 Gulp 成為主流，但我認為兩者本質上是不同的東西，何來比較？各有各的優缺點，雙方是互補的，在上面範例中，由於 require 無法運行在瀏覽器上面，我也是導入 Webpack-stream 用以打包代碼，並沒有誰好誰不好的說法，Gulp 適合小型開發，配置簡單，輕鬆上手，而 Wepack 適合開發稍有規模的專案，尤其是 SPA (單頁式應用)，對於筆者來講，兩個工具都把它學起來，就沒有這麼多的麻煩了，之後也會有一系列的 Webpack 文章，敬請期待。
