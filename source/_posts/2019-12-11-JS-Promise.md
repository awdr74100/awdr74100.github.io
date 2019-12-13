---
title: JavaScript ES6 非同步操作 - Promise
date: 2019-12-11 22:19:42
description:
categories:
tags:
  - ES6
  - JavaScript
---

## 前言

非同步處理一直以來都是 JavaScript 開發者很常遇到的情境，在之前，我們都是使用 callback 去完成任務，當結構變得複雜時，容易形成所謂的 callback hell，造成程式碼難以維護；在 ES6 版本中，新增了 Promise 物件，它能夠將非同步流程包裝成簡潔的結構，並提供統一的錯誤處理機制，解決了傳統 callback hell 的問題。此篇將會解析 Promise 的處理流程與相關方法。

<!-- more -->

## 筆記重點

- 何謂 Callback 與 Callback hell ？
- Promise 物件建立與基本使用

## 何謂 Callback 與 Callback hell ？

Callback 是 JavaScript 很常使用的一種處理方式，以下是一個簡單的 callback 範例：

- **Callback：以參數型態傳入另一個函式的函式**

```js
function alertMsg() {
  console.log('alertMsg trigger');
}

function main(callback) {
  console.log('main start');
  callback();
  console.log('main end');
}

main(alertMsg);
/*
  main start
  alertMsg trigger
  main end
*/
```

在一般開發中，我們很常需要使用非同步處理去完成任務，像是 `XMLHttpRequest`、`setTimeout` ...之類的，以下使用 setTimeout 來模擬非同步事件：

```js
function alertMsg() {
  // 使用 setTimeout 模擬非同步事件，0s 無法改變它本質還是非同步事件
  setTimeout(() => {
    console.log('alertMsg trigger');
  }, 0);
}

function main(callback) {
  console.log('main start');
  callback();
  console.log('main end');
}

main(alertMsg);
/*
  main start
  main end
  alertMsg trigger
*/
```

在 JavaScript 中，有 `event queue` 的特性，**所有非同步事件都不會立即執行當下行為**，而是將這些行為放到 `event queue` 中，等待事件觸發後再回來執行；從上面範例可得知，結果的順序改變了，如果我們要確保 `main end` 在最後觸發，只需將 `main end` 包裝成 function 並且當成 callback 傳進去就好了，如下範例：

```js
function alertMsg(callback2) {
  setTimeout(() => {
    console.log('alertMsg trigger');
    callback2();
  }, 0);
}

function main(callback) {
  console.log('main start');
  callback(() => {
    console.log('main end');
  });
}

main(alertMsg);
/*
  main start
  alertMsg trigger
  main end
*/
```

使用 callback 解決了非同步事件引發的問題，但當結構變得複雜時，使用 callback 容易產生 callback hell，使得後期維護非常痛苦，閱讀性也變得非常差，如下範例：

- **Callback hell：簡稱回調地獄，通常發生在程式間需按照順序執行**

```js
const async_api1 = (callback2) => {
  setTimeout(() => {
    console.log('async_api1 end');
    callback2();
  }, 1000);
};

const async_api2 = (callback3) => {
  setTimeout(() => {
    console.log('async_api2 end');
    callback3();
  }, 2000);
};

const main = (callback) => {
  async_api1(() => {
    async_api2(callback);
  });
};

main(() => {
  setTimeout(() => {
    console.log('main end');
  }, 3000);
});
/*
  --- delay 1s ---
  async_api1 end
  --- delay 2s ---
  async_api2 end
  --- delay 3s ---
  main end
*/
```

當你有許多的行為需要按照順序執行下去，此時你的程式碼就會變得非常混亂，如下：

```js
async_api1(() => {
  async_api2(() => {
    async_api3(() => {
      async_api4(() => {
        // ...
      });
    });
  });
});
```

讓我們來看看 ES6 新推出的 Promise 物件是如何改善 callback hell 問題的。

## Promise 物件建立與基本使用

### Promise 物件的建立

<div class="note warning">ES6 Promise 的實作中，會確保 Promise 物件一實體化後就會固定住狀態，要不就是"以實現"，要不就是"已拒絕"</div>

一個簡單的 Promise 語法結構如下：

```js
const async_api = () =>
  new Promise((resolve, reject) => {
    // 成功時
    resolve('success');
    // 失敗時
    reject('error');
  });

async_api()
  .then((response) => {
    // on fulfillment (以實現時)
    console.log(response);
  })
  .catch((error) => {
    // on rejection (已拒絕時)
    console.log(error);
  });
```

我們先來看 Promise 的建構函式，它的語法如下：

```js
new Promise(function(resolve, reject) { ... });
```

用箭頭函式簡化一下：

```js
new Promise((resolve, reject) => { ... });
```

建構函式的傳入參數需要一個函式，參數名稱可自由定義，但建議要符合使用上的命名，如果沒有其他需求，使用 reslove 與 reject 更能夠提高其閱讀性。

### Promise 基本的使用

<div class="note warning"></div>
