---
title: JavaScript 容易混淆的遍歷方法
date: 2019-11-28 17:18:16
description:
  [
    在之前開發 Python 時，最常使用 for in 去遍歷物件；仔細想想，自己好像被 forEach 寵壞了，都忘記 JavaScript 也有相關的語法，實際使用下來，發現有部分觀念需要釐清，且某些情境可能不是這麼好用，需要搭配其他方法才能完成目的。此篇重點圍繞在 for、for/in、for/of、forEach 的使用情境與差別。,
  ]
categories: [JavaScript]
tags: [JavaScript, ES6, ES8]
---

## 前言

在之前開發 Python 時，最常使用 for in 去遍歷物件；仔細想想，自己好像被 forEach 寵壞了，都忘記 JavaScript 也有相關的語法，實際使用下來，發現有部分觀念需要釐清，且某些情境可能不是這麼好用，需要搭配其他方法才能完成目的。此篇重點圍繞在 for、for/in、for/of、forEach 的使用情境與差別。

## 筆記重點

- 遍歷物件基本操作
- 使用情境 - 非數值屬性
- 使用情境 - 陣列的空元素
- 使用情境 - this 的指向
- 結論

## 遍歷物件基本操作

此篇文章將會針對下列 4 種迴圈語法做介紹，讓我們先來看看各語法的基本操作：

- **for** (let index = 0; index < array.length; index += 1) {}
- **for** (const key **in** object) {}
- **for** (const interator **of** object) {}
- array.**forEach**((item, index, array) => {} )

> **處理陣列：**

```js
let arr = ['Eric', 'Allen', 'Owen'];
```

> **處理物件：**

```js
let obj = {
  name: 'Danny',
  age: 26,
  height: 180,
  weight: 72,
};
```

### for

作用對象：陣列
遍歷對象：無

> **遍歷陣列**

```js
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // Eric 、 Allen 、 Owen
}
```

### for in

作用對象：陣列、物件
遍歷對象：鍵(key)

> **遍歷陣列**

```js
for (const key in arr) {
  console.log(key); // 0 、 1 、 2
}
```

> **遍歷物件**

```js
for (const key in obj) {
  console.log(obj[key]); // Danny 、 26 、 180 、 72
}
```

> **繼承屬性物件問題：hasOwnProperty**

```js
Array.prototype.newType = 'newValue';
for (const key in arr) {
  console.log(arr[key]); // Eric 、 Allen 、 Owen 、 newValue
  if (arr.hasOwnProperty(key)) {
    console.log(arr[key]); // Eric 、 Allen 、 Owen
  }
}
```

### for of

作用對象：陣列
遍歷對象：值(value)

> **遍歷陣列**

```js
for (const value of arr) {
  console.log(value); // Eric 、 Allen 、 Owen
}
```

> **遍歷物件：搭配 Object.values() - ES8 新增**

```js
for (const value of Object.values(obj)) {
  console.log(value); // Danny 、 26 、 180 、 72
}
```

> **遍歷物件：搭配 Object.entries() - ES8 新增**

```js
for (const [key, value] of Object.entries(obj)) {
  console.log(key); // name 、 age 、 height 、 weight
  console.log(value); // Danny 、 26 、 180 、 72
}
```

> **遍歷陣列：搭配 Array.prototype.entries() - ES6 新增**

```js
for (const iterator of arr.entries()) {
  console.log(iterator); // [ 0, 'Eric' ] 、 [ 1, 'Allen' ] 、 [ 2, 'Owen' ]
}
```

### forEach

作用對象：陣列
遍歷對象：鍵(key)、值(value)、作用對象(array)

> **遍歷陣列**

```js
arr.forEach((item, index, array) => {
  console.log(item); // Eric 、 Allen 、 Owen
  console.log(index); // 0 、 1 、 2
  console.log(array); // [ 'Eric', 'Allen', 'Owen' ]
});
```

> **遍歷物件：搭配 Object.entries() - ES8 新增**

```js
Object.entries(obj).forEach((item) => {
  let [key, value] = item;
  console.log(key); // name 、 age 、 height 、 weight
  console.log(value); // Danny 、 26 、 180 、 72
});
```

## 使用情境 - 非數值屬性

事實上 JavaScript 的陣列是類似列表的物件，這就意味著我們可以直接給陣列新增屬性：

```js
let arr = ['red', 'blue', 'yellow'];

arr.newPrototype = 'value';

console.log(arr); // [ 'red', 'blue', 'yellow', newPrototype: 'value' ]
```

需要注意的是，遍歷相關語法對於非數值屬性的處理方式是不一樣的，主要分為兩種：

> **不會忽略非數字屬性：for in**

```js
let arr = ['red', 'blue', 'yellow'];

arr.newPrototype = 'value';

for (const key in arr) {
  console.log(arr[key]); // red 、 blue 、 yellow 、 value
}
```

> **會忽略非數字屬性：for、for of、forEach**

```js
let arr = ['red', 'blue', 'yellow'];

arr.newPrototype = 'value';

/* --- for --- */
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // red 、 blue 、 yellow
}

/* --- for of --- */
for (const value of arr) {
  console.log(value); // red 、 blue 、 yellow
}

/* --- forEach --- */
arr.forEach((item) => {
  console.log(item); // red 、 blue 、 yellow
});
```

由上面測試可得知，使用 for in 時，會連同非數字屬性也一起遍歷，其他 3 種則不會，正常來講，不應該連同非數字屬性一起遍歷才對，**遍歷陣列時，應該避免使用 for in**，轉而使用其他三種遍歷語法。

## 使用情境 - 陣列的空元素

JavaScript 中的陣列是允許有空元素的，如下範例：

```js
let arr = ['red', , 'blue'];
arr[4] = 'black';

console.log(arr.length); // 5
```

奇怪的地方在於，遍歷相關語法對於空元素的處理方式卻是不一樣的，主要分為兩種：

> **跳過空元素：for in、forEach**

```js
let arr = ['red', , 'blue'];
arr[4] = 'black';

/* --- for in --- */
for (const key in arr) {
  console.log(arr[key]); // red 、 blue 、 black
}

/* --- forEach --- */
arr.forEach((item) => {
  console.log(item); // red 、 blue 、 black
});
```

> **不會跳過空元素：for、for of**

```js
let arr = ['red', , 'blue'];
arr[4] = 'black';

/* --- for --- */
for (let i = 0; i < arr.length; i += 1) {
  console.log(arr[i]); // red 、 undefined 、 blue 、 undefined 、 black
}

/* --- for of --- */
for (const value of arr) {
  console.log(value); // red 、 undefined 、 blue 、 undefined 、 black
}
```

> **額外補充：JSON 也不支援空元素**

```js
/* --- JSON.stringify --- */
let arrString1 = ['red', , 'blue', 'black'];

console.log(JSON.stringify(arrString1)); // ["red",null,"blue","black"]

/* --- JSON.parse --- */
let arrString2 = `["red", , "blue", "black"]`;

console.log(JSON.parse(arrString2)); // SyntaxError: Unexpected token
```

由上面測試可得知，for in、forEach 遇到空元素會直接跳過，for、for of 則不會，**取決於你遍歷的目的是什麼，選擇相對應的方法**，同時也得注意 JSON 是否支援等問題。

## 使用情境 - this 的指向

在 JavaScript 中各遍歷語法對於 this 的指向都是大同小異的，基本上都是指向外部的 window 物件，唯獨 forEach 最特別，如下範例：

> **保留外部作用域：for、for in、for of**

```js
let arr = ['red'];

/* --- for --- */
for (let i = 0; i < arr.length; i += 1) {
  console.log(this); // window
}

/* --- fpr in --- */
for (const key in arr) {
  console.log(this); // window
}

/* --- for of --- */
for (const value of arr) {
  console.log(this); // window
}
```

> **指向特定的對象：forEach**

- 非嚴謹模式

```js
let arr = ['red'];

/* --- 定義 thisArg 參數 --- */
arr.forEach(function(item) {
  console.log(this); // 30
}, 30);

/* --- 未定義 thisArg 參數 --- */
arr.forEach(function(item) {
  console.log(this); // window
});

/* --- 箭頭函式 --- */
arr.forEach((item) => {
  console.log(this); // window
});
```

- 嚴謹模式

```js
'use strict'; // JavaScript 嚴謹模式

let arr = ['red'];

/* --- 定義 thisArg 參數 --- */
arr.forEach(function(item) {
  console.log(this); // 30
}, 30);

/* --- 未定義 thisArg 參數 --- */
arr.forEach(function(item) {
  console.log(this); // undefined
});

/* --- 箭頭函式 --- */
arr.forEach((item) => {
  console.log(this); // window
});
```

由上例可看出，forEach 所指向的 this 是根據第 2 個 thisArg 參數所提供，相反的，**如果 thisArg 參數未定義或為 null，this 將根據設定模式指向對應的對象，嚴謹模式下為 undefined，非嚴謹模式下為 window**，盡可能的要求所有 callback function 必須使用箭頭函式。

## 使用情境 - 中斷迴圈

在一般遍歷語法中，使用 break、return 中斷迴圈是再正常不過的事情，但這兩個語法使用在 forEach 上是行不通的，相關範例如下：

> **中斷迴圈成功：for、for in、for of**

```jS
let arr = ['red', 'blue', 'black'];

/* --- for --- */
for (let i = 0; i < arr.length; i += 1) {
  if (arr[i] === 'blue') {
    break;
  }
  console.log(i); // 0
}

/* --- for in --- */
for (const key in arr) {
  if (arr[key] === 'blue') {
    break;
  }
  console.log(key); // 0
}

/* --- for of --- */
for (const [index, value] of arr.entries()) {
  if (value === 'blue') {
    break;
  }
  console.log(index); // 0
}
```

> **中斷迴圈失敗：forEach**

```js
let arr = ['red', 'blue', 'black'];

/* --- break --- */
arr.forEach((item, index) => {
  if (item === 'blue') {
    break;
  }
  console.log(index); // SyntaxError: Illegal break statement
});

/* --- return --- */
arr.forEach((item, index) => {
  if (item === 'blue') {
    return;
  }
  console.log(index); // 0 、 2
});
```

> **其他遍歷方法：every、some**

```js
let arr = ['red', 'blue', 'black'];

/* --- every --- */
arr.every((item, index) => {
  if (item === 'blue') {
    return false;
  }
  console.log(index); // 0
});

/* --- some --- */
arr.some((item, index) => {
  if (item === 'blue') {
    return true;
  }
  console.log(index); // 0
});
```

由上例可看出，forEach 使用 break 會發生錯誤，使用 return 最多只能中斷當前遍歷項目，最後依然會遍歷後面的項目，個人建議，**如果有中斷迴圈需求，請使用 for、for in、for of 方法，或者利用 every、some 依序判斷項目特性來完成操作**。

## 結論

經過上面的討論，你會發現 for of 是遍歷陣列最可靠的方式，它比 for 語法簡潔，並且沒有 for in 與 forEach 那麼多奇怪的特例，唯二的缺點是取得索引值需要搭配其他方法才能完成，以及無法像 forEach 一樣鏈式操作物件；在 Airbnb 的 Style Guide 中，禁止使用 for 相關的遍歷方法，推薦使用 forEach 高階函數來完成遍歷，其主要原因為較容易推論結果，其實也蠻有道理的，除非遇到上述所講的特殊情境，使用 for of 較為容易，不然在一般情境中 forEach 或許是你更好的選擇。
