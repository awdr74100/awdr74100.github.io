---
title: 針對不同版本的 Node.js 開啟 ECMAScript 模塊支持
description:
  [
    當初在學習 ES6 Modules 相關語法時，主要得依靠 Babel 編譯才能在 Node.js 中運行，原因為 Node.js 預設是使用 CommonJS 模組規範，事實上，大可不必這麼麻煩，Node.js 原生是支援 ES6 Modules 模組規範的，不過得透過一些方法才能將其切換，且不同版本還有各自的切換方法。本篇將使用 nvm (Node Version Manager) 切換不同的 Node.js 版本，並介紹在不同版本下該如何啟用對 ECMAScript 模塊的支持。,
  ]
categories: [Node.js]
tags: [Node.js, JavaScript, ES6]
date: 2020-02-16 17:23:15
---

## 前言

當初在學習 ES6 Modules 相關語法時，主要得依靠 Babel 編譯才能在 Node.js 中運行，原因為 Node.js 預設是使用 CommonJS 模組規範，事實上，大可不必這麼麻煩，Node.js 原生是支援 ES6 Modules 模組規範的，不過得透過一些方法才能將其切換，且不同版本還有各自的切換方法。本篇將使用 nvm (Node Version Manager) 切換不同的 Node.js 版本，並介紹在不同版本下該如何啟用對 ECMAScript 模塊的支持。

## 筆記重點

- Node.js v12 版本切換方式
- Node.js v13 版本切換方式

## Node.js v12 版本切換方式

輸入 `nvm use 12.16.0` 切換成指定 Node.js 版本：

```bash
$ nvm use 12.16.0
```

參考 [官方文檔](https://nodejs.org/dist/latest-v12.x/docs/api/esm.html#esm_enabling) 啟用方式：

- 使用 `--experimental-modules` 標誌，啟用對 ECMAScript 模塊的支持。

啟用後，以下操作將視為 ECMAScript 模塊：

- 帶有 `.mjs` 結尾的文件。
- `package.json` 文件包含 `"type": "module"` 屬性。

範例 (1)：

```js
/* --- main.mjs --- */
import fun from './module.mjs';

fun();

/* --- module.mjs --- */
export default function() {
  console.log('Hello World');
}
```

輸入以下指令：

```bash
$ node --experimental-modules main.mjs
```

範例 (2)：

```js
/* --- main.js --- */
import fun from './module.mjs';

fun();

/* --- module.js --- */
export default function() {
  console.log('Hello World');
}
```

```js
/* --- package.json --- */
{
  "type": "module"
}
```

輸入以下指令：

```bash
$ node --experimental-modules main.js
```

## Node.js v13 版本切換方式

輸入 `nvm use 13.7.0` 切換成指定 Node.js 版本：

參考 [官方文檔](https://nodejs.org/dist/latest-v13.x/docs/api/esm.html#esm_enabling) 啟用方式：

**v13 版本不須傳遞任何標誌，本身已支持 ECMAScript。**

以下操作將視為 ECMAScript 模塊：

- 帶有 `.mjs` 結尾的文件。
- `package.json` 文件包含 `"type": "module"` 屬性。

範例 (1)：

```js
/* --- main.mjs --- */
import fun from './module.mjs';

fun();

/* --- module.mjs --- */
export default function() {
  console.log('Hello World');
}
```

輸入以下指令：

```bash
$ node main.mjs
```

範例 (2)：

```js
/* --- main.js --- */
import fun from './module.mjs';

fun();

/* --- module.js --- */
export default function() {
  console.log('Hello World');
}
```

```js
/* --- package.json --- */
{
  "type": "module"
}
```

輸入以下指令：

```bash
$ node main.js
```
