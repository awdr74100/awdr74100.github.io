---
title: Gulp 前端自動化 - 使用 Babel 編譯 ES6
description:
  [
    Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，提高兼容性，此篇將介紹如何透過 gulp-babel 這個套件編譯我們的 JavaScript。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, Babel]
date: 2020-01-08 23:25:41
---

## 前言

Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，提高兼容性，此篇將介紹如何透過 gulp-babel 這個套件編譯我們的 JavaScript。

## 筆記重點

- gulp-babel 安裝
- gulp-babel 基本使用
- gulp-babel 可傳遞選項
- 補充：@babel/runtime 與 @babel/polyfill 組件使用的必要
- 補充：@babel/runtime 使用方式
- 補充：@babel/polyfill 使用方式

## gulp-babel 安裝

> 套件連結：[gulp-babel](https://www.npmjs.com/package/gulp-babel)

Babel 7：

```bash
$ npm install gulp-babel @babel/core @babel/preset-env
```

Babel 6：

```bash
$ npm install gulp-babel@7 babel-core babel-preset-env
```

在這邊我們使用 Babel 7 版本做示範，要注意的是 @babel/core 與 @babel/preset-env 並不是 gulp-babel 的相依套件，但我們還是必須依賴在此環境才能成功運行，所以必須連同這兩個套件一起安裝。與 gulp-sass 不同，安裝時會連同 node-sass 的環境一起幫你安裝。

## gulp-babel 基本使用

初始專案結構：

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

執行指定任務：

```bash
$ gulp babel
```

生成 `./public/js/all.js` 檔案，此時專案結構如下：

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

## 補充：@babel/runtime 與 @babel/polyfill 組件使用的必要

<div class="note danger">Babel 默認只針對 Syntax 做轉換，例如：箭頭函式、ES6 變數、Class 語法糖等等，而自帶的 API 與原生內置的 methods 需要透過 polyfill 後才能在瀏覽器正常運行。</div>

當前使用 Babel 版本：`v7.7.7`

---

有礙於網上的文章都是以較舊版本的 Babel 作討論，針對新版的 @babel/runtime 與 @babel/polyfill 這兩大 Babel 最重要的組件都沒有細項討論，導致使用 Babel 7 版本時，各種運行錯誤，官方 API 雖然完整，但各章節並沒有連貫性，操作下來也不知道問題在哪，在我們探討這兩個組件之前，我們先來解釋這兩個組件到底是要幫我們解決什麼問題。

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

聰明的你應該發現問題了，Babel 不是會幫我們處理兼容性的問題嗎？`Array.prototype.filter` 與 `Promise` 物件好像都沒有編譯到的感覺，不要懷疑！Babel 真的沒有幫我們編譯到；事實上，如果你採用預設的編譯環境，**Babel 只會針對語法(Syntax)做編譯，底層的 API 與原型擴展都不會進行編譯**，這也就代表兼容性的問題根本沒有解決，在 IE 11 等較舊瀏覽器上面，它還是不知道什麼是 Promise，運行時就會發生錯誤；在這邊還有一個問題，**Babel 針對 Class 語法糖的處理，你會發現它新增了一個全域的 function 當作語法糖的呼叫，這樣子的處理會造成嚴重的全域汙染**，如果你有多個 JavaScript 檔案，同時都進行編譯的動作，產生出來的 function 都會是一模一樣的，不僅造成檔案的肥大，也有可能發生汙染影響運行等問題；這時候就會需要 @babel/runtime 與 @babel/polyfill 的幫忙，在介紹這兩個組件時，我們先將 Babel 的設定移置專屬的設定檔，如下所示：

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

```json
{
  "presets": ["@babel/preset-env"]
}
```

此時運行 gulp babel 指令，結果會是一模一樣的，在之後針對 Babel 所作的處理，我們都會使用 `.babelrc` 這一個檔案做修改，接下來讓我們開始正式介紹 @babel/runtime 與 @babel/polyfill。

## 補充：@babel/runtime 使用方式

@babel/runtime 是由 Babel 提供的 polyfill 套件，由 core-js 和 regenerator 組成，core-js 是用於 JavaScript 的組合式標準化庫，它包含各種版本的 polyfills 實現；而 regenerator 是來自 facebook 的一個函式庫，主要用於實現 generator/yeild，async/await 等特性，我們先從安裝開始講起。

> 套件連結：[@babel/runtime](https://www.npmjs.com/package/@babel/runtime)、[@babel/plugin-transform-runtime](https://www.npmjs.com/package/@babel/plugin-transform-runtime)

@babel/runtime：

```bash
$ npm install @babel/runtime
```

@babel/plugin-transform-runtime：

```bash
$ npm install @babel/plugin-transform-runtime --save-dev
```

在安裝 @babel/runtime 時，記得不要安裝錯誤，新版的是帶有 `@` 開頭的；同時也必須安裝 @babel/plugin-transform-runtime 這個套件，babel 在運行時是依賴 plugin 去做取用，這兩個套件雖然不是相依套件，但實際使用時缺一不可，在後面會有相關說明，在這邊我們先把這兩個套件裝好就可以了。

修改 `./.babelrc` 內容為下面範例：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false
      }
    ]
  ]
}
```

我們以之前 JavaScript 檔案進行示範，執行 gulp-babel 指令進行編譯，結果如下：

```js
'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

/* --- 箭頭函式、ES6 變數、ES6 陣列方法--- */
var color = [1, 2, 3, 4, 5];
var result = color.filter(function(item) {
  return item > 2;
});

/* --- class 語法糖 --- */
var Circle = function Circle() {
  (0, _classCallCheck2['default'])(this, Circle);
};

/* --- Promise 物件 --- */
var promise = Promise.resolve();
```

從編譯後的結果可以得知，之前提到的 Class 語法糖全域汙染問題已經解決了，透過 @babel/plugin-transform-runtime 這個套件，它會幫我們分析是否有 polyfill 的需求，並自動透過 require 的方式，向 @babel/runtime 拿取 polyfill，簡單來講，**@babel/runtime 提供了豐富的 polyfill 供組件使用，開發者可以自行 require，但自行 require 太慢了，使用 @babel/plugin-transform-runtime 可以自動分析並拿取 @babel/runtime 的 polyfill**，這也是為什麼這兩個套件缺一不可的原因。

可能有些人還是有疑問，透過 require 的方式為什麼就能避免全域污染的問題？事實上，當初我也很困惑，結果恍然大悟，終於理解了，簡單來講，當初是因為 babel 會在全域環境宣告 function，只要同時有 1 個檔案以上需要編譯時，這些 function 就會相遇干擾，實際運行就會發生錯誤，透過 @babel/runtime 直接 require 的方式進行取用，最後編譯出來的檔案就不會汙染到全域環境，而是生成許多的 require 指令，**Node.js 默認是從緩存中載入模組，一個模組被加載一次之後，就會在緩存中維持一個副本，如果遇到重複取用問題，會直接向緩存拿取副本，這也就代表每個模組在緩存中止存在一個實例**。

仔細觀察，Babel 還是沒有幫我們編譯 Promise 物件，那是因為我們還沒有解放 @babel/runtime 這一個套件全部力量，由上面範例，你會發現我在 plugin 中傳遞了一個 corejs 選項，預設是關閉的，可傳遞的選項為：

| corejs 選項 | 安裝指令                                  |
| :---------- | :---------------------------------------- |
| false       | npm install --save @babel/runtime         |
| 2           | npm install --save @babel/runtime-corejs2 |
| 3           | npm install --save @babel/runtime-corejs3 |

事實上 @babel/runtime 有許多的擴展版本，在之前的範例中，我們都是將 corejs 給關閉，這也就導致它並沒有幫我們編譯底層的 API 與相關的方法，這次我們就來使用各版本進行編譯，記得要執行相對應的安裝指令喔！

修改 `./.babelrc` 內容為下面範例：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2 // 2 or 3
      }
    ]
  ]
}
```

corejs2 版本編譯結果：

```js
'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _promise = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/promise'));

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/classCallCheck'));

/* --- 箭頭函式、ES6 變數、ES6 陣列方法--- */
var color = [1, 2, 3, 4, 5];
var result = color.filter(function(item) {
  return item > 2;
});

/* --- class 語法糖 --- */
var Circle = function Circle() {
  (0, _classCallCheck2['default'])(this, Circle);
};

/* --- Promise 物件 --- */
var promise = _promise['default'].resolve();
```

corejs3 版本編譯結果：

```js
'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs3/helpers/interopRequireDefault');

var _promise = _interopRequireDefault(require('@babel/runtime-corejs3/core-js-stable/promise'));

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime-corejs3/helpers/classCallCheck'));

var _filter = _interopRequireDefault(require('@babel/runtime-corejs3/core-js-stable/instance/filter'));

/* --- 箭頭函式、ES6 變數、ES6 陣列方法--- */
var color = [1, 2, 3, 4, 5];
var result = (0, _filter['default'])(color).call(color, function(item) {
  return item > 2;
});

/* --- class 語法糖 --- */
var Circle = function Circle() {
  (0, _classCallCheck2['default'])(this, Circle);
};

/* --- Promise 物件 --- */
var promise = _promise['default'].resolve();
```

從上面結果可以得知，**corejs2 版本主要針對底層 API 做編譯，如 Promise、Fetch 等等；corejs3 版本主要針對底層 API 和相關擴展方法，如 Array.pototype.filter，Array.pototype.map 等等**，簡單來講，如果你要將兼容性的問題徹底解決，就得使用 corejs3 版本，到了這邊，我們之前所提到 Babel 的種種問題都已經獲得解決。

<div class="note warning">使用 @babel/runtime 能夠在不汙染全域環境下提供相對應的 polyfill，擁有自動識別功能，有效減少體積，並不像 @babel/polyfill 一次性的載入全部 ployfill，造成體積異常肥大，如果你使用的 Babel 版本 >= 7.4.0。不要懷疑，直接使用 @babel-runtime 可以滿足你全部需求。 </div>

## 補充：@babel/polyfill 使用方式

@babel/polyfill 與 @babel/runtime 一直以來這兩者的差別都很模糊，網上的文章大多也都是複製官方的說明文檔，並沒有實際去使用，造成開發者一知半解的疑慮，這一次我們就來討論 @babel/polyfill 究竟要如何使用。先從安裝開始說起：

Babel 版本 < `v7.4.0`：

```bash
$ npm install @babel/polyfill
```

Babel 版本 >= `v7.4.0`：

```bash
$ npm intsall core-js regenerator-runtime/runtime
```

從 Babel >= 7.4.0 後，@babel/polyfill 組件庫已被棄用，事實上 @babel/polyfill 本身就是由 stable 版本的 core-js 和 regenerator-runtime 組成，我們可以直接下載這兩個組件庫當作 @babel/polyfill 來使用，官方也推薦此做法，這邊要注意的是 regenerator-runtime 為 @babel/runtime 的相依套件，可以自行檢查是否有正確安裝。

修改 `./.babelrc` 內容為下面範例：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": false,
        "corejs": 3 // 當前 core-js 版本
      }
    ]
  ]
}
```

我們使用之前 JavaScript 檔案進行示範，執行 gulp-babel 指令進行編譯，結果如下：

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

編譯結果就如同單純使用 Bbael 一樣，只有針對語法(Syntax)做編譯，那是因為我們尚未開啟 polyfill 的功能，可通過更改 `useBuiltIns` 來變更模式，可選模式為 `false`、`usage`、`entry`，以下為各模式的編譯結果：

useBuiltIns：`usage`：

```js
'use strict';

require('core-js/modules/es.array.filter');

require('core-js/modules/es.object.to-string');

require('core-js/modules/es.promise');

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

很明顯的將 useBuiltIns 更改為 `usage`，就如同使用 @babel/runtime-corejs3 一樣，自動識別需要 require 的新語法，將兼容性問題徹底解決，不同的地方在於，@babel/runtime 在不汙染全域環境下提供 polyfill，而 @babel/polyfill 則是將需要兼容的新語法掛載到全局對象，這樣子的做法即會造成所謂的全局汙染，讓我們來看最後一個 useBuiltIns 選項。

useBuiltIns：`entry`：

<div class="note warning">使用 entry 選項記得在前面 import core-js 和 regenerator-runtime/runtime 組件庫</div>

待編譯檔案：

```js
import 'core-js';
import 'regenerator-runtime/runtime';

/* --- 箭頭函式、ES6 變數、ES6 陣列方法 --- */
let color = [1, 2, 3, 4, 5];
let result = color.filter((item) => item > 2);

/* --- class 語法糖 --- */
class Circle {}

/* --- Promise 物件 --- */
const promise = Promise.resolve();
```

完成編譯檔案：

```js
'use strict';

require('core-js/modules/es.symbol');

require('core-js/modules/es.symbol.description');

require('core-js/modules/es.symbol.async-iterator');

// ...省略 500 多個包

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

`entry` 這一個選項就簡單多了，不需要做任何的識別，直接將整個 ES 環境掛載到全局對象，確保瀏覽器可以兼容所有的新特性，但這樣子做的缺點也顯而易見，整個專案環境會較為肥大，你可能會好奇 `entry` 選項的必要，事實上 Babel 默認不會檢測第三方依賴組件，所以使用 `usage` 選項時，可能會出現引入第三方的代碼包未載入模組而引發的 Bug，這時就有使用 `entry` 的必要。

<div class="note warning">@babel/polyfill 提供一次性載入或自動識別載入 polyfill 的功能，使用掛載全局對象的方法，達到兼容新特性目的，適合開發在專案環境，較不適合開發組件庫或工具包，存在汙染全局對象疑慮。</div>

經過了一番對於 @babel/runtime 與 @babel/polyfill 的討論，相信各位已經了解兩者的差別，在這邊做一個總結：

1. Babel 版本 < `7.4.0`：

   - 開發組件庫、工具包，選擇 @babel/runtime
   - 開發本地專案，選擇 @babel/polyfill

2. Babel 版本 >= `7.4.0`

   - 不用考慮，直接選擇 @babel/runtime
