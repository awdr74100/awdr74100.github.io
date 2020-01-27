---
title: Gulp 前端自動化 - CommonJS 模組化設計
description:
  [
    CommonJS 為當初最早設計用來解決 JavaScript 模組化設計的規範，使用簡單的幾個語法，即可達到模組化的效果。本篇不會探討較新標準的其他規範，比如 ES6 Module 等等，將會把焦點放在如何以 CommonJS 規範針對 Gulp 進行模組化設計，以及 CommonJS 規範中最常被人拿來討論的 module.exports 與 exports 語法兩者差別。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, JavaScript]
date: 2020-01-26 21:25:12
---

## 前言

CommonJS 為當初最早設計用來解決 JavaScript 模組化設計的規範，使用簡單的幾個語法，即可達到模組化的效果。本篇不會探討較新標準的其他規範，比如 ES6 Module 等等，將會把焦點放在如何以 CommonJS 規範針對 Gulp 進行模組化設計，以及 CommonJS 規範中最常被人拿來討論的 module.exports 與 exports 語法兩者差別。

## 筆記重點

- CommonJS 初始環境建構
- CommonJS 規範相關語法

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
- `require` 引用模組後，返回給呼叫者的是 `module.exports` 而不是 `exports`
- `export.xxx`，相當於在匯出物件上新增屬性，該屬性對呼叫模組直接可見
- `exports = xxx`，相當於給 `exports` 物件重新賦值，`require` 無法訪問 `exports` 物件及其屬性
- 由於一個模組只有一個 `exports`，當有多個物件需要 `exports` 時，可利用

### `exports` = `module.exports` = `{}` = 空物件

路徑：`./module.js`

```js
console.log(module.exports); // {}
console.log(exports); // {}

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

### require 引用模組後，返回給呼叫者的是 module.exports 而不是 exports
