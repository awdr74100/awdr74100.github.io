---
title: JavaScript ES6 陣列處理方法
date: 2019-10-26 17:10:34
description:
categories:
  - JavaScript
tags:
  - JavaScript
  - ES6
---

## 前言
在大部分語言，第一次接觸到的陣列處理方法不外乎是 for、while 等等，但現代開發講求效率以及可讀性，當有其他判斷需求，整個處理的結構就會變得很複雜，這次來紀錄一下 ES6 新增的幾種陣列處理方法，在實戰中，可大幅的幫助開發，自己使用下來，效果顯卓！
<!-- more -->

## 筆記重點
+ forEach()
+ filter()
+ find()
+ map()
+ every()
+ some()
+ reduce()

## 傳統陣列處理方法
一般人對於陣列的處理方式大多都是使用 for 迴圈就可以滿足基本應用，主要利用**迴圈變數**取出**陣列中的項目**，再依序做處理，如下範例：

``` js
let object = [{
    name: 'Eric',
    pay: 23000,
}, {
    name: 'Alice',
    pay: 26800,
}]

let payTotal = 0;

for (let i = 0; i < jsonData.length; i++) {
    console.log(jsonData[i].name); // Eric、Alice
    payTotal += jsonData[i].pay;
}
console.log(payTotal); // 49800
```

雖然說傳統方法也不錯，不過當**程序複雜時**，難免會有**可讀性較差**等問題，如果要搭配其他方法做應用，整個程序只會變得更加複雜，ES6 新增的陣列處理方法就是為了解決這一個問題。

## 初始作用陣列
在下面陳述 ES6 的陣列方法時，都會直接以實例的方式做紀錄，針對所作用的陣列，就直接記錄在這邊，可再自行比對。

``` js
let object = [{
    name: 'Eric',
    weight: 60,
    age: 28
}, {
    name: 'Alice',
    weight: 42,
    age: 24
}, {
    name: 'Emma',
    weight: 46,
    age: 18
}, {
    name: 'Owen',
    weight: 52,
    age: 32
}]
```

## Array.prototype.forEach()
forEach() 是陣列方法中最單純的一個，他也是最好理解的一個，用法類似於 for 迴圈，相比之下，更讓人容易理解，應用。如下範例：
+ **可直接利用參數操作陣列內容**

``` js
object.forEach(function (item, index, array) {
    console.log(item.weight); // 項目：60、42、46、52
    console.log(index); // 索引：0,1,2,3
    console.log(array); // 陣列：指向所作用陣列
})

object.forEach(item => {
    if (item.age <= 20) {
        console.log(item); // { name: 'Emma', weight: 46, age: 18 }
    }
})

let people = object.forEach(item => {
    return item.weight == 46; // forEach 無法 return，所以這寫法是無效的
})
console.log(people) // undefined
```

## Array.prototype.filter()
filter() 是我最愛使用的一個方法！傳統過濾陣列都是使用 for 迴圈加上許多判斷式， filter() 結合了兩者功能，配合箭頭函式，大幅提高效率與可讀性。如下範例： 
+ **依序判斷項目內容，如果為 True 即放入新陣列，最後回傳新陣列**

``` js
let data1 = object.filter(function (item, index, array) {
    return false; // 所有項目都為false，新陣列為空
})

let data2 = object.filter(function (item) {
    return item.weight >= 60; // 體重大於等於60放入新陣列
})

let data3 = object.filter(item => item.age <= 20) // 配合箭頭函式

console.log(data1); // []空陣列
console.log(data2); // [ { name: 'Eric', weight: 60, age: 28 } ]
console.log(data3); // [ { name: 'Emma', weight: 46, age: 18 } ]
```

## Array.prototype.find()
find() 類似於 filter() ，不過其處理為回傳首個符合的項目，還有一個類似方法叫findIndex()，處理方式與find()相同，不過是回傳索引值。如下範例：
+ **依序判斷項目內容，回傳第一次判斷為 True 的項目**

``` js
let data1 = object.find(function (item, index, array) {
    return false; // 所有項目都為False，回傳undefined
})

let data2 = object.find(function (item) {
    return item.weight < 50; // 體重大於等於60，回傳項目
})

let data3 = object.find(item => item.age >= 18) // 配合箭頭函式

console.log(data1); // undefined
console.log(data2); // { name: 'Alice', weight: 42, age: 24 }
console.log(data3); // { name: 'Eric', weight: 60, age: 28 }
```

## Array.prototype.map()
map() 主要用來做陣列的修改，或是整體項目的判斷，通常可搭配**展開**做內容新增。如下範例：
+ **依序處理項目內容，回傳陣列長度等於作用陣列長度**
+ **預設項目內容為 undefined**

``` js
let data1 = object.map(function (item, index, array) {})

let data2 = object.map(item => item.age > 20)

let data3 = object.map(item => {
    return {
        ...item,
        overweight: item.weight > 50 ? '過重' : '正常'
    }
})

console.log(data1); // [ undefined, undefined, undefined, undefined ]
console.log(data2); // [ true, true, false, true ]
console.log(data3); // [ { name: 'Eric', weight: 60, age: 28, overweight: '過重' }...]
```

## Array.prototype.every()
evely() 可用來檢查陣列項目是否符合條件，類似於 AND 處理，**全部項目都符合**，回傳 True
+ **回傳內容只有 True 和 Flase**
+ **判斷全部項目是否都符合條件，否則回傳 False**

``` js
let data1 = object.every(function (item, index, array) {
    return item.age >= 18; // 全部符合條件
})

let data2 = object.every(function (item) {
    return item.weight < 50; // 部分符合條件
})

console.log(data1); // true
console.log(data2); // false
```

## Array.prototype.some()
some() 類似於 evely() ，等同 OR 處理，**部分項目符合**，回傳 True
+ **回傳內容只有 True 和 Flase**
+ **一個(含)以上項目符合條件，回傳 True**

``` js
let data1 = object.some(function (item, index, array) {
    return item.age >= 24; // 部分符合條件
})

let data2 = object.some(function (item) {
    return item.weight < 40; // 全部項目都不符合
})

console.log(data1); // true
console.log(data2); // false
```

## Array.prototype.reduce()
reduce()主要用來做**累加應用**或者是**項目間的判斷**，如下範例：
+ **初始化數值(前一個數值)，可由後方傳入**
+ **全部操作皆由初始數值與當前項目做應用**

``` js
let data1 = object.reduce(function (accumulator, currentValue, currentIndex, array) {})

let data2 = object.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.weight; // 累加所有項目數值
}, 0)

let data3 = object.reduce((accumulator, currentValue) => {
    return Math.max(accumulator, currentValue.age); // 與前一個比大小
}, 0)

console.log(data1); // 沒有回傳，會是undefined
console.log(data2); // 200
console.log(data3); // 32
```

