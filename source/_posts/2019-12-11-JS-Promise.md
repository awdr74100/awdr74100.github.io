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
- Promise 狀態與流程
- Promise 變體方法
- Promise 靜態方法

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

ES6 時代來臨，讓我們來看看新推出的 Promise 物件是如何改善 callback 問題的。

## Promise 狀態與流程

<img src="https://bitsofco.de/content/images/2016/06/Creating-Promises.png" alt="Promise ststus">

在 Promise 物件中，我們所做的一切行為都是在控制它本身的狀態，從宣告開始，物件本身就已經擁有狀態了，我們可利用物件本身的 callback 去更改它的狀態，最後拿取 Promise 返回的狀態即可完成操作。下面是 Promise 的建構函式：

```js
new Promise((resolve, reject) => {});
```

Promise 本身有三種狀態：

- **pending：沒有回應**
- **fulfilled：承諾兌現，操作完成**
- **rejected：拒絕承諾，操作失敗**

Promise 本身的 callback 可用來改變狀態：

- **resolve()：承諾兌現**
- **reject()：拒絕承諾**

Promise 本身的方法可用來接收狀態：

- **then()：當承諾兌現即接收**
- **catch()：拒絕承諾時接收**

了解了 Promise 物件的執行流程，讓我們開始來做第一個範例：

```js
const async_api = (timeout, status) =>
  new Promise((resolve, reject) => {
    if (status) {
      setTimeout(() => {
        resolve('success');
      }, timeout);
    } else {
      reject('error');
    }
  });

async_api(1000, true)
  .then((response) => {
    console.log(response); // success
  })
  .catch((error) => {
    console.log(error);
  });
/*
  --- delay 1s ---
  success
*/
```

上面範例一樣使用了 setTimeout 來模擬非同步事件，當 Promise 狀態被改變時，使用 then() 來接收回傳的結果，是不是發現與 callback 相比，結構變得非常整潔，讓我們使用 Promise 來完成 callback 的範例看看：

- **Promise Chain：使用 return & then 來完成，可依造流程來處理資料**

```js
const async_api = (timeout, status) =>
  new Promise((resolve, reject) => {
    if (status) {
      setTimeout(() => {
        resolve('success：' + timeout / 1000);
      }, timeout);
    } else {
      reject('error');
    }
  });

async_api(1000, true)
  .then((response) => {
    console.log(response);
    return async_api(2000, true);
  })
  .then((response2) => {
    console.log(response2);
    return async_api(3000, true);
  })
  .then((response3) => {
    console.log(response3);
    return async_api(444444, false);
  })
  .catch((error) => {
    console.log(error);
  });
/*
  --- delay 1s ---
  success：1
  --- delay 2s ---
  success：2
  --- delay 3s ---
  success：3
  error
*/
```

很明顯的，使用 Promise 對比 callback 來說，結構的簡潔性提高非常多，且提供統一的錯誤處理機制，方便控制內部所觸發的問題，我們也可以使用 return 與 then() 來控制非同步的流程，這也是一般人常講的 Promise Chain。

## Promise 變體方法

有時我們需要針對多個非同步事件來觸發相對應的動作，此時就可以使用 Promise 內建的變體方法來完成任務，相關方法如下：

- **Promise.all([...])：所有的 Promise 都是成功的，才會執行**
- **Promise.race([...])：執行第一個成功的 Promise，其他捨棄**

### Promise.all([...])

```js
const async_api = (timeout, status) =>
  new Promise((resolve, reject) => {
    if (status) {
      setTimeout(() => {
        resolve('success：' + timeout / 1000);
      }, timeout);
    } else {
      reject('error');
    }
  });

Promise.all([async_api(1000, true), async_api(2000, true), async_api(3000, true)])
  .then((list) => {
    console.log(list);
  })
  .catch((error) => {
    console.log(error);
  });
/*
  --- delay 3s ---
  [ 'success：1', 'success：2', 'success：3' ]
*/
```

`Promise.all([...])` 會回傳一個 Array，類似於 AND 處理，所有 Promise 都回傳成功才進行下一個任務，如果有任何一個 Promise 回傳失敗，則直接進入失敗的處理狀況，範例如上，`async_api 1s`、`async_api 2s`、`async_api 3s` 都完成才進行下一個任務。

### Promise.race([...])

```js
const async_api = (timeout, status) =>
  new Promise((resolve, reject) => {
    if (status) {
      setTimeout(() => {
        resolve('success：' + timeout / 1000);
      }, timeout);
    } else {
      reject('error');
    }
  });

Promise.race([async_api(1000, true), async_api(2000, true), async_api(3000, true)])
  .then((first) => {
    console.log(first);
  })
  .catch((error) => {
    console.log(error);
  });
/*
  --- delay 1s ---
  success：1
```

`Promise.race([...])` 會回傳一個 result，類似於 OR 處理，只要有任何一個 Promise 回傳成功即執行下一個任務，其餘捨棄，範例如上，`async_api 1s` 最快回傳成功，其他的事件直接捨棄即進行下一個任務。

## Promise 靜態方法


