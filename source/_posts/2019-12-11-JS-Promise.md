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
- Promise 執行流程與錯誤處理

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

<div class="note warning">then 方法是 Promise 的最核心方法，也是控制非同步事件最關鍵的因素</div>

在 Promise 中，我們可以使用 `then` 與 `catch` 來接收回傳的內容，接續 Promise 物件的建立中的範例：

```js
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

可能會有人看到的是下面這種寫法：

```js
async_api().then(
  function(response) {
    // on fulfillment (以實現時)
    console.log(response);
  },
  function(error) {
    // on rejection (已拒絕時)
    console.log(error);
  }
);
```

事實上，兩者的結果是一樣的，`then` 方法接受兩個函式當作傳入參數，第一個函式為 Promise 物件狀態轉變成 `fulfillment` 所呼叫，有一個傳入參數值可用；第二個函式為 Promise 物件狀態改變成 `rejected` 所呼叫，也有一個傳入參數值可用。

為什麼說它是一樣的結果呢？對於 `catch` 方法來說，相當於 `then(undefined, rejection)`，也就是 `then` 方法的第一個函式傳入參數沒有給定值的情況下，它算是個 `then` 方法的語法糖，這也代表著兩者在名稱的定義上有點不同，但意義其實是相近的。**如果有 Promise Chain 的需求，盡量還是使用 `catch` 取代 `then` 的第二個函式**，不然說實在的，對於結構性來講，會顯得非常混亂，下面是 `Promise Chain` 的例子：

```js
async_api()
  .then((response1) => {
    console.log(response1);
    return response1;
  })
  .then((response2) => {
    console.log(response2);
    return response2;
  })
  .then((response3) => {
    console.log(response3);
  });
```

在 `then` 方法中的 `fulfillment` 函式，它是一個連鎖的結構，這也就代表著我們可以使用 `return` 語句來回傳值，這個值可以繼續往下面的 `then` 方法傳送，傳送過去的是一個**新的** Promise 物件；而 `rejected` 這一個函式，也有連鎖結構的特性，但由於它是使用在錯誤處理情況，除非你要用來修正錯誤之類的操作，不然這樣子的回傳操作，可能會造成結構異常混亂，這也是我上面提到的問題。

<div class="note warning">為了方便進行多個不同程式碼的連鎖，通常在只使用 then 方法時，都只寫第 1 個函式傳入參數。而錯誤處理通常交給另一個 catch 方法來做</div>

## Promise 執行流程與錯誤處理

### throw 與 reject

<div class="note warning">Promise 中會隱藏 throw 例外的錯誤輸出，改用轉變狀態為 rejected(已拒絕)來做錯誤處理</div>

在 Promise 建構函式中，直接使用 throw 語句相當於 reject 方法的作用，範例如下：

```js
const async_api = () =>
  new Promise((resolve, reject) => {
    throw '發生錯誤';
    // 如同使用下面語句
    // reject('發生錯誤');
  });

async_api()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error); // 觸發：發生錯誤
  });
```

我們知道 `throw` 主要用來使 JavaScript 停止執行並拋出錯誤，在 Promise 中按照規則，只要有丟出例外動作，當下狀態就會直接變成 `rejected` ，這也是使用 `throw` 能夠達到與 `reject()` 同樣效果的原因，但這僅限於同步的操作，我們以下面範例做補充：

```js
const async_api = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      throw 10;
    }, 100);
  });

async_api()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
```

上面這是一個使用 `setTimeout` 模擬非同步事件的範例，對於 `throw` 在一般程式使用中，會拋出錯誤並停止執行，在 Promise 的同步操作中，Promise 會隱藏錯誤並將當下狀態更改為 `rejected`，而在非同步操作中是無法隱藏錯誤的，這也代表 Promise 後續的連鎖都將出現錯誤，所以還是乖乖的使用 `reject` 方法就好，這才是正規操作 Promise 狀態的方法。

### 執行流程與錯誤處理

在前面我們有介紹到關於 Promise Chain 的相關操作，這次我們來探討關於執行流程與錯誤處理的相關內容，先來看一下範例：

```js
const async_api = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(10);
    }, 0);
  });

async_api()
  .then((value) => {
    console.log('第一個');
    return value;
  })
  .then((value) => {
    console.log('第二個');
    return value;
  })
  .catch((error) => {
    console.log('第三個'); // 觸發 (第三個)
    return error;
  })
  .then(
    function(value) {
      console.log('第四個 - fulfillment'); // 觸發 (第四個 - fulfillment)
      return value;
    },
    function(error) {
      console.log('第四個 - reject');
      return error;
    }
  )
  .catch((error) => {
    console.log('第五個');
    return value;
  })
  .then((value) => {
    console.log('第六個'); // 觸發 (第六個)
  })
  .catch((error) => {
    console.log('第七個');
  });
```

在 `then` 的第一個回傳條件下，會尋找相符合的第一個狀態，如同上面範例會觸發第三個 `catch`，接下來的回傳值都必須遵循下面的規範：

- 回傳值不是函式或物件，直接將回傳值狀態用 `fulfilled` 實現，例：String、Number。
- 回傳值是 Promise 物件，回傳 Promise 最後的操作結果，例：resolve 方法、reject 方法。
- 回傳值是函式或物件，判斷是否為包裝的 Promise 物件，如果是，回傳 Promise 操作結果，如果不是，則直接將回傳值狀態用 `fulfilled` 實現，例：Object

理解了上面三個規範，就能夠清楚的了解 `then` 的處理方式，如同上面這一個範例，雖然觸發了第三個 `catch`，但回傳值卻是 `Number`，這也就導致回傳值狀態用 `fulfilled` 實現，才會觸發第四個的 fulfilled 結果。

## Promise 靜態方法

<div class="note warning">Promise.resolve 或 Promise.reject 只用於單純的傳入物件、值或外部的 thenable 物件，轉換為 Promise 物件的場合</div>

`Promise.resolve` 與 `Promise.reject` 是 Promise 的靜態方法，`Promise.resolve` 等於是產生 `fulfilled` 狀態的物件，`Promise.reject` 則是 `rejected` 狀態，如下範例：

```js
let promiseObject = Promise.resolve(10);

promiseObject.then((num) => {
  console.log(num);
});
```

## Promise 變體方法
