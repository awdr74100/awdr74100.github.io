---
title: JavaScript 容易混淆的遍歷方法
date: 2019-11-28 17:18:16
description:
categories:
  - JavaScript
tags:
  - JavaScript
  - ES6
  - ES8
---

## 前言

在之前開發 Python 時，最常使用 for in 去遍歷物件；仔細想想，自己好像被 forEach 寵壞了，都忘記 JavaScript 也有相關的語法，實際使用下來，發現有部分觀念需要釐清，且某些情境可能不是這麼好用，需要搭配其他方法才能完成目的。此篇重點圍繞在 for、for/in、for/of、forEach 的使用情境與差別。

<!-- more -->

## 筆記重點

- 遍歷物件基本操作
- 使用情境 - 非數值屬性
- 使用情境 - 空元素
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

JavaScript 的陣列是類似列表的物件，這就意味著我們可以直接給陣列新增屬性：

```js
let arr = ['red', 'blue', 'yellow'];

arr.newPrototype = 'value';

console.log(arr); // [ 'red', 'blue', 'yellow', newPrototype: 'value' ]
```

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

## 使用情境 - 空元素

## 使用情境 - this 的指向

## 使用情境 - 中斷迴圈
