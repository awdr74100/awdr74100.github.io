---
title: Gulp 前端自動化 - CommonJS 模組化設計
description:
  [
    CommonJS 為當初最早設計用來解決 JavaScript 模組化設計的規範，使用簡單的幾個語法，即可達到模組化的效果。本篇不會探討較新標準的其他規範，比如 ES6 Module 等等，將會把焦點放在如何以 CommonJS 規範針對 Gulp 進行模組化設計，以及 CommonJS 規範中最常被人拿來討論的 module.exports 與 exports 語法兩者差別。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, JavaScript]
date: 2020-01-26 21:25:12
updated: 2020-01-28 17:26:48
---

## 前言

CommonJS 為當初最早設計用來解決 JavaScript 模組化設計的規範，使用簡單的幾個語法，即可達到模組化的效果。本篇不會探討較新標準的其他規範，比如 ES6 Module 等等，將會把焦點放在如何以 CommonJS 規範針對 Gulp 進行模組化設計，以及 CommonJS 規範中最常被人拿來討論的 module.exports 與 exports 語法兩者差別。

## 筆記重點

- CommonJS 初始環境建構
- CommonJS 規範相關語法
- Gulp 相關套件安裝
- Gulp 模組化設計

## CommonJS 初始環境建構

專案結構：

```plain
commonjs/
|
| - main.js            # JavaScript 主檔案
|
| - module.js          # JavaScript 模組
```

在之後講解到關於 CommonJS 規範相關語法時，都會以上面這一個專案結構做為測試目的。

## CommonJS 規範相關語法

<div class="note warning">在 Node.js 中，一個 .js 檔即代表一個模組，每個模組內都有一個隱式(implicit)的 module 物件，這個 module 物件身上有一個 exports (即 module.exports) 屬性</div>

CommonJS 規範相關語法：

- `module.exports`：導出模塊(推薦寫法)
- `exports`：導出模塊
- `require`：引入模塊

內部原理：

- `exports` = `module.exports` = `{}` = 空物件
- `exports` 是 `module.exports` 的一個捷徑變數
- `exports.xxx`，相當於在匯出物件上新增屬性，該屬性對呼叫模組直接可見
- `exports = xxx`，相當於給 `exports` 物件重新賦值，`require` 無法訪問 `exports` 物件及其屬性
- `require` 引用模組後，返回給呼叫者的是 `module.exports` 而不是 `exports`
- 由於一個模組只有一個 `exports`，當有多個物件需要 `exports` 時，可利用新增屬性方式掛載到物件上，最後統一導出

### `exports` = `module.exports` = `{}` = 空物件

路徑：`./module.js`

```js
console.log(module.exports); // {}
console.log(exports); // {}
console.log(module.exports === exports); // true

// 以物件方式增加屬性
module.exports.test1 = 'Hi module.exports';
console.log(module.exports); // { test1: 'Hi module.exports' }

// 以物件方式增加屬性
exports.test2 = 'Hi exports';
console.log(exports); // { test1: 'Hi module.exports', test2: 'Hi exports' }
```

從上面範例可以得知，`module.exports` 與 `exports` 本身是一個物件，而 `exports` 本身是 `module.exports` 的捷徑變數，兩者指向記憶體位址是一樣的，也就代表不管是操作 `module.exports` 還是 `exports` 物件，其實都是操作同一個物件。

### `exports` 是 `module.exports` 的一個捷徑變數

路徑：`./module.js`

```js
// 以物件方式增加屬性
module.exports.test1 = 'Hi module.exports';
console.log(module.exports); // { test1: 'Hi module.exports' }

// 以物件方式增加屬性
exports.test2 = 'Hi exports';
console.log(exports); // { test1: 'Hi module.exports', test2: 'Hi exports' }

module.exports = {
  test3: 10,
};
console.log(module.exports); // { test3: 10 }
console.log(exports); // { test1: 'Hi module.exports', test2: 'Hi exports' }
```

前面有講解到 `exports` 是 `module.exports` 的捷徑變數，但需要注意的是，這邊說的捷徑變數是指 `module.exports` 初始物件，如果 `module.exports` 有任何賦值動作，`exports` 只會透過捷徑映射到初始物件，如同上面範例。

### `exports.xxx`，相當於在匯出物件上新增屬性，該屬性對呼叫模組直接可見

路徑：`./module.js`

```js
const fun = () => {
  console.log('Hello World');
};

/* --- 導出模塊 --- */
module.exports.fun = fun;
```

路徑：`./main.js`

```js
/* --- 導入模塊 ---*/
const obj = require('./module');
console.log(obj); // { fun: [Function: fun] }
obj.fun(); // Hello World
```

在我們導出模塊時，可透過物件新增屬性的方式掛載內容，接收方只需要使用 `require` 導入模塊即可載入目標模塊的物件以及掛載內容，前面有提到 `exports` 是 `module.exports` 的捷徑變數，我們可改寫導出模塊方式：

路徑：`./module.js`

```js
const fun = () => {
  console.log('Hello World');
};

/* --- 導出模塊 --- */
exports.fun = fun;
```

### `exports = xxx`，相當於給 `exports` 物件重新賦值，`require` 無法訪問 `exports` 物件及其屬性

路徑：`./module.js`

```js
const fun = () => {
  console.log('Hello World');
};

/* --- 將 module.exports 重新賦值 --- */
module.exports = fun;
```

路徑：`./main.js`

```js
/* --- 導入模塊 ---*/
const fun = require('./module');

console.log(fun); // [Function: fun]
fun(); // Hello World
```

前面我們都是針對 `module.exports` 本身物件新增屬性，之後再導出模塊，事實上，我們可以直接針對 `module.exports` 重新賦值，這樣子的作法在導入模塊時，就不需要以物件方式拿取裡面的內容，可以直接進行取用，可能有人就在想，既然 `exports` 是 `module.exports` 的捷徑變數，那我們是否可針對 `exports` 重新賦值？如下面寫法：

路徑：`./module.js`

```js
const fun = () => {
  console.log('Hello World');
};

/* --- 將 exports 重新賦值 --- */
exports = fun;
```

答案是不行的，下段介紹會有說明。

### `require` 引用模組後，返回給呼叫者的是 `module.exports` 而不是 `exports`

路徑：`./module.js`

```js
const fun = () => {
  console.log('Hello World');
};

/* --- 將 exports 重新賦值 --- */
exports = fun;
```

路徑：`./main.js`

```js
/* --- 導入模塊 ---*/
const fun = require('./module');

console.log(fun); // {}
```

前面有提到，使用 `exports` 重新賦值時，`require` 接收到的或是一個空物件，造成此結果的原因在於 `require` 引用模組時，返回給呼叫者的是 `module.exports` 而不是 `exports`，`exports` 預設是 `module.exports` 的捷徑變數，代表兩者指向記憶體位址相同，當我們針對 `exports` 物件新增屬性時，`module.exports` 也會接連變動，但當我們針對 `exports` 重新賦值後，`exports` 就與 `module.exports` 無任何關係，兩個是完全不一樣的東西，這才導致使用 `require` 時，接收到的會是一個空物件，因為 `module.exports` 物件匯出時沒有任何掛載屬性，簡單來講，`exports` 只適合用以掛載屬性導出模塊，如果你想要避免兩者的使用陷阱，`module.exports` 是最好的選擇。

### 由於一個模組只有一個 `exports`，當有多個物件需要 `exports` 時，可利用新增屬性方式掛載到物件上，最後統一導出

路徑：`./module.js`

```js
const variable = '變數';

const fun = () => {
  console.log('函式');
};

const people = {
  name: 'Roya',
  age: 20,
};

exports.variable = variable;
exports.fun = fun;
exports.people = people;

// or

// module.exports = { variable: variable, fun: fun, people: people };
```

路徑：`./main.js`

```js
const obj = require('./module');

console.log(obj);
/* 
{ 
  variable: '變數',
  fun: [Function: fun],
  people: { name: 'Roya', age: 20 }
}
*/
```

由於一個 .js 檔案就等於一個 `module.exports`，如果有多個物件、變數、函式需要做導出時，可使用物件新增屬性方式掛載內容，如上面範例。此時也可以搭配物件解構直接取用掛載內容：

路徑：`./main.js`

```js
const { variable, fun, people } = require('./module');

console.log(variable); // 變數
console.log(fun); // [Function: fun]
console.log(people); // { name: 'Roya', age: 20 }
```

## Gulp 相關套件安裝

> 套件連結：[gulp-sass](https://www.npmjs.com/package/gulp-sass)

```bash
$ npm install gulp-sass
```

此次範例會使用 gulp-sass 套件，請先進行安裝

## Gulp 模組化設計

初始專案結構：

```plain
gulpDemo/
| - gulpfile.js
|   | - indedx.js      # Gulp 主檔案
|   | - compile.js     # Gulp 模組檔案 - SCSS 編譯
|
| - node_modules/
|
| - source/
|   | - scss/
|       | - all.scss   # SCSS 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-sass
```

請注意 Gulp 主檔案位置，原本我們都是使用 `gulpfile.js` 作為依據，設計模組化應用時，建議將同應用檔案放在同一個資料夾，所以我們新增了一個 `gulpfile.js` 資料夾，裡面新增了一個 `index.js` 檔案，這一個就是我們的 Gulp 主檔案，而 `compile.js` 是我們 SCSS 相關套件的模組檔案，下面會有說明。

<div class="note danger">gulpfile.js 資料夾默認是使用 index.js 作為執行檔案，要注意的是使用 CLI 執行任務時，入口路徑為 gulpfile.js 資料夾路徑，並不是 index.js 路徑</div>

Gulp 主檔案：

```js
const gulp = require('gulp');
/* --- 導入模組 --- */
const { compile } = require('./compile');

gulp.task('default', gulp.series(compile));
```

Gulp 模組檔案：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');

/* --- 以函式方式宣告任務 --- */
const compile = () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
};

/* --- 導出模組 --- */
exports.compile = compile;
```

之前我們都是使用 Task 名稱作為執行任務參數依據，在 Gulp 4 中可接受函式作為參數依據，就如同上面範例所演示，Gulp 主檔案使用 `gulp.series` 非同步方式執行任務，而這一個任務以往都是字串形式的 Task 名稱，但現在我們使用函式方式導入，而這一個函示就是 `./compile.js` 所宣告的函式，我們可以將任務內容寫到函式裡頭，最後再將這一個函式導出，即可完成模組化應用，相同方式可套用在其他模組，只需要了解 `exports` 與 `require` 原理，就能夠拆分出任何形式的模組。
