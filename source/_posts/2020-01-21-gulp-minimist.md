---
title: Gulp 前端自動化 - Minimist 命令行參數解析工具
description:
  [
    通常在開發項目時，我們會分所謂的 development(開發環境) 與 production(生產環境)；常見的壓縮代碼流程就屬於 production 環境，你不會想再 development 環境壓縮代碼的，全部代碼都擠在一起，除起錯來相當困難。此篇將介紹如何使用 Minimist 命令行參數解析工具區分 Gulp 套件在 development 與 production 環境下的使用。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-21 16:18:32
---

## 前言

通常在開發項目時，我們會分所謂的 development(開發環境) 與 production(生產環境)；常見的壓縮代碼流程就屬於 production 環境，你不會想再 development 環境壓縮代碼的，全部代碼都擠在一起，除起錯來相當困難。此篇將介紹如何使用 Minimist 命令行參數解析工具區分 Gulp 套件在 development 與 production 環境下的使用。

## 筆記重點

- minimist 安裝
- minimist 基本使用
- minimist 可傳遞選項
- 補充：Node.js 原生獲取命令行參數方法

## minimist 安裝

> 套件連結：[minimist](https://www.npmjs.com/package/minimist)、[gulp-if](https://www.npmjs.com/package/gulp-if)

minimist：

```bash
$ npm install minimist
```

gulp-if：

```bash
$ npm install gulp-if
```

minimist 套件為解析命令行傳遞參數用，我們可以使用 gulp-if 套件針對這一個參數做判斷，區分出 development 與 production 環境分別運行那些套件。為使下面範例正常運行，請先將這兩個套件進行安裝。

## minimist 基本使用

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
| - test.js            # minimist 範例檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-sass、minimist、gulp-if
```

minimist 語法：

```js
const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2)); // 取得命令行傳遞參數
```

minimist 範例檔案：

```js
const argv = require('minimist');

console.log(argv); // Function

/* --- 終端機執行：node test.js --env development --- */
console.log('測試 1：' + argv(process.argv.slice(2))); // 測試 1：{ _: [], env: 'development' }

/* --- 終端機執行：node test.js --env development --- */
console.log('測試 2：' + argv(process.argv.slice(2)).env); // 測試 2：development

/* --- 終端機執行：node test.js --env production --- */
console.log('測試 3：' + argv(process.argv.slice(2)).env); // 測試 3：production

/* --- 終端機執行：node test.js --config HelloWorld --- */
console.log('測試 4：' + argv(process.argv.slice(2)).config); // 測試 4：HelloWorld
```

從上面範例可以得知，使用 `parseArgs(process.argv.slice(2))` 即可取得命令行傳遞參數，命令行格式需為 `$ node test.js --參數(key) 參數(value)`；應用時只需拿取對應的參數(key)，即可獲得參數(key)內的參數(value)。讓我們來實際演練一番。

載入並使用 minimist、gulp-if：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const parseArgs = require('minimist'); // 載入 minimist 套件
const gulpif = require('gulp-if'); // 載入 gulp-if 套件

// 獲取命令行參數
const argv = parseArgs(process.argv.slice(2)).env;

/* --- SCSS 編譯 --- */
gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' }))) // 區分套件使用環境
    .pipe(gulp.dest('public/css'));
});
```

執行 development 環境：

```bash
$ gulp sass --env development
```

SCSS 編譯結果：

```scss
.box1 {
  color: red;
}

.box2 {
  color: blue;
}

.box3 {
  color: black;
}
```

執行 production 環境：

```bash
$ gulp sass --env production
```

SCSS 編譯結果：

```scss
.box1{color:red}.box2{color:#00f}.box3{color:#000}
```

從上面範例可以得知，gulp-if 套件能夠幫助我們進行邏輯判斷，第一個參數為 `True` or `False`，第二個參數為作用的 gulp 套件，當我們成功獲取命令行傳遞參數時，即可針對這一個參數做邏輯判斷，development 與 production 環境就是由此方法來做區分。

## minimist 可傳遞選項

可參考 [minimist Options](https://www.npmjs.com/package/minimist) 可傳遞參數列表，以下為常用的參數配置：

- opts.string：`Array` => `[ 參數(key), ... ]`
  指定參數(key)內的參數(value)強制轉型為 string，默認為 `none`

- opts.boolean：`Array` => `[ 參數(key), ... ]`
  指定參數(key)內的參數(value)強制轉型為 boolean，默認為 `none`

- opts.default：`Object` => `{ 參數(key): 參數(value) }`
  預設命令行傳遞參數，默認為 `none`

範例：

```js
const argv = require('minimist');

/* --- minimist可傳遞選項 --- */
const opts = {
  string: ['env1'], // or 'env1'
  boolean: ['env2'], // or 'env2'
  default: { env: 'development' },
};

/* --- 終端機執行：node test.js --- */
console.log('測試 1：' + argv(process.argv.slice(2))); // 測試 1：{ _: [], env2: false, env: 'development' }

/* --- 終端機執行：node test.js --env production --- */
console.log('測試 2：' + argv(process.argv.slice(2))); // 測試 2：{ _: [], env2: false, env: 'production' }

/* --- 終端機執行：node test.js --env1 1234 --- */
console.log('測試 3：' + argv(process.argv.slice(2))); // 測試 3：{ _: [], env2: false, env1: '1234', env: 'development' }

/* --- 終端機執行：node test.js --env2 5678 --- */
console.log('測試 4：' + argv(process.argv.slice(2))); // 測試 4：{ _: [ 5678 ], env2: true, env: 'development' }
```

## 補充：Node.js 原生獲取命令行參數方法

事實上，minimist 套件是以 Node.js 中的 `process.argv` API 來實現，不過基於原生方法較為不這麼人性化，故大多人都是使用 minimist 套件完成獲取命令行傳遞參數任務。以下為 Node.js 原生獲取命令行參數範例：

```js
/* --- 終端機執行：node test.js --env development --- */
const argv = process.argv;

console.log(argv); // [Node.js 路徑, test.js 路徑, '--env', 'development']

console.log(argv[3]); // development
```

從上面範例可以得知，原生的 Node.js 獲取命令行參數方法參數(key)與參數(value) 是沒有任何關聯性的，所有參數值都將成為陣列中的項目，實際使用起來很不人性化，建議使用 minimist 套件來完成。
