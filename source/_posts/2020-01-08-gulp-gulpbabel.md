---
title: Gulp 前端自動化 - 使用 Babel 編譯
description:
  [
    Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，提高兼容性，此篇將介紹如何透過 gulp-babel 這個套件編譯我們的 JavaScript。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-08 23:25:41
---

## 前言

Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，提高兼容性，此篇將介紹如何透過 gulp-babel 這個套件編譯我們的 JavaScript。

## 筆記重點

- gulp-babel 安裝
- gulp-babel 基本使用
- gulp-babel 可傳遞選項
- 補充：babel-polyfill 與 babel-runtime 組件使用的必要
- 補充：babel-runtime 使用方式
- 補充：babel-polyfill 使用方式

## gulp-babel 安裝

> 套件連結：[NPM](https://www.npmjs.com/package/gulp-babel)

Babel 7：

```bash
$ npm install gulp-babel @babel/core @babel/preset-env
```

Babel 6：

```bash
$ npm install gulp-babel@7 babel-core babel-preset-env
```

在這邊我們使用 Babel 7 版本做示範，要注意的是 babel-core 與 babel-preset-env 並不是 gulp-babel 的相依套件，但我們還是必須依賴在此環境才能成功運行，所以必須連同這兩個套件一起安裝。與 gulp-sass 不同，安裝時會連同 node-sass 的環境一起幫你安裝。

## gulp-babel 基本使用

初始檔案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - js             # 原始資料
|       | - all.js     # javascript 主檔案
|
| - gulpfile.js        # gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-babel
```

撰寫 JavaScript 較新版本代碼：

```js
const people = {
  name: 'Roya',
  height: 170,
};

for (const [key, value] of Object.entries(people)) {
  console.log(key, value);
}
```

載入並使用 gulp-babel：

```js
const gulp = require('gulp');
const babel = require('gulp-babel'); // 載入 gulp-babel 套件

gulp.task(
  'babel',
  () =>
    gulp
      .src('./source/js/*.js') // javascript 檔案路徑
      .pipe(
        babel({
          presets: ['@babel/env'], // 使用預設環境編譯
        })
      )
      .pipe(gulp.dest('./public/js/')) // 編譯完成輸出路徑
);
```

執行指定任務

```bash
$ gulp babel
```

生成 `./public/js/all.js` 檔案，此時檔案結構如下：

```plain
gulpDemo/
|
| - node_modules/
|
| - public/
|   | - js/
|       | - all.js     # 編譯完成的 JavaScript 檔案
|
| - source/
|   | - js
|       | - all.js     # javascript 主檔案
|
... 以下省略
```

讓我們打開編譯完成的 JavaScript 檔案，看看 Babel 究竟做了什麼處理：

```js
// 以上省略

var people = {
  name: 'Roya',
  height: 170,
};

for (var _i = 0, _Object$entries = Object.entries(people); _i < _Object$entries.length; _i++) {
  var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
    key = _Object$entries$_i[0],
    value = _Object$entries$_i[1];

  console.log(key, value);
}
```

看到編譯完成的代碼，你的第一個想法大概都是 WTF ... 這是什麼鬼？不用擔心，Babel 只是將你的代碼優化為兼容性較高版本的代碼，你也不需要針對這一個檔案做任何修改，可以直接給 HTML 讀取，工作的原理就如同未編譯的 JavaScript 檔案，你只需要專注於目標的建構，不管你用多新版本的代碼來實現，Babel 都可以幫你改善兼容性等相關問題。

## gulp-babel 可傳遞選項

可參考 [Babel Options](https://babeljs.io/docs/en/options#presets) 可傳遞參數列表，以下為常用的參數配置：

- minified：`true` | `false`
  壓縮代碼，默認為 `false`

範例：

```js
gulp.task('babel', () =>
  gulp
    .src('./source/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
        minified: true,
      })
    )
    .pipe(gulp.dest('./public/js/'))
);
```

## 補充：babel-runtime 與 babel-polyfill 組件使用的必要

<div class="note danger">Babel 默認只針對 Syntax 做轉換，例如：箭頭函式、ES6 變數、Class 語法糖等等，而自帶的 API 與原生內置的 methods 需要透過 polyfill 後才能在瀏覽器正常運行。</div>

有礙於網上的文章都是以較舊版本的 Babel 作討論，針對新版的 babel-runtime 與 babel-polyfill 這兩大 Babel 最重要的組件都沒有細項討論，導致使用 Babel 7 版本時，各種運行錯誤，官方 API 雖然完整，但各章節並沒有連貫性，操作下來也不知道問題在哪，在我們探討這兩個組件之前，我們先來解釋這兩個組件到底是要幫我們解決什麼問題。

將 `./source/js/all.js` 檔案，修改為如下：

```js
/* --- 箭頭函式、ES6 變數、ES6 陣列方法 --- */
let color = [1, 2, 3, 4, 5];
let result = color.filter((item) => item > 2);

/* --- class 語法糖 --- */
class Circle {}

/* --- Promise 物件 --- */
const promise = Promise.resolve();
```

針對上面這一個 JavaScript 檔案，我們使用之前配置好的 gulp-babel 來編譯他，編譯結果如下：

```js
'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

/* --- 箭頭函式、ES6 變數、ES6 陣列方法 --- */
var color = [1, 2, 3, 4, 5];
var result = color.filter(function(item) {
  return item > 2;
});

/* --- class 語法糖 --- */
var Circle = function Circle() {
  _classCallCheck(this, Circle);
};

/* --- Promise 物件 --- */
var promise = Promise.resolve();
```

聰明的你應該發現問題了，Babel 不是會幫我們處理兼容性的問題嗎？`Array.prototype.filter` 與 `Promise` 物件好像都沒有編譯到的感覺，不要懷疑！Babel 真的沒有幫我們編譯到；事實上，如果你採用預設的編譯環境，**Babel 只會針對語法(Syntax)做編譯，底層的 API 與原型擴展都不會進行編譯**，這也就代表兼容性的問題根本沒有解決，在 IE 11 等較舊瀏覽器上面，它還是不知道什麼是 Promise，運行時就會發生錯誤；在這邊還有一個問題，**Babel 針對 Class 語法糖的處理，你會發現它新增了一個全域的 function 當作語法糖的呼叫，這樣子的處理會造成嚴重的全域汙染**，如果你有多個 JavaScript 檔案，同時都進行編譯的動作，產生出來的 function 都會是一模一樣的，不僅造成檔案的肥大，也有可能發生汙染影響運行等問題；這時候就會需要 babel-runtime 與 babel-polyfill 的幫忙，在介紹這兩個組件時，我們先將 Babel 的設定移置專屬的設定檔，如下所示：

路徑：`./gulpfile.js`：

```js
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('babel', () =>
  gulp
    .src('./source/js/*.js')
    .pipe(babel()) // 將可傳遞選項移至 .babelrc
    .pipe(gulp.dest('./public/js/'))
);
```

將原有的可傳遞選項移除，並新增 Babel 的專屬設定檔：

路徑：`./.babelrc`

```js
{
    "presets": ["@babel/preset-env"]
}
```

此時運行 gulp babel 指令，結果會是一模一樣的，在之後針對 Babel 所作的處理，我們都會使用 `.babelrc` 這一個檔案做修改，接下來讓我們開始正式介紹 babel-runtime 與 babel-polyfill。

## 補充：babel-runtime 使用方式

## 補充：babel-polyfill 使用方式
