---
title: JavaScript ES6 陣列處理方法(含 filter()、map() ... )
date: 2019-10-26 17:10:34
description:
categories:
  - JavaScript
tags:
  - JavaScript
  - ES6
---

## 前言
在大部分語言，第一次接觸到的陣列處理方法不外乎是 for、while 等等，但現代開發講求效率以及可讀性，當有其他判斷需求，整個處理的結構就會變得很複雜，這次來紀錄一下 ES6 新增陣列處理方法，在實戰中，可大幅的幫助開發，自己使用下來，效果顯卓！
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

雖然說傳統方法也不錯，不過當**程序複雜時**，難免會有**可讀性較差**等問題，如果要搭配其他方法做應用，整個程序只會變得更加複雜，ES6新增的陣列處理方法就是為了解決這一個問題。

## 初始陣列資料
在下面陳述 ES6 的陣列方法時，都會直接以實例的方式做紀錄，針對所處理的陣列，就直接記錄在這邊，可再自行比對。

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
forEach() 是陣列方法中最單純的一個，但也是最好理解的一個，用法類似於 for 迴圈，不同的地方在於，**可直接利用參數獲取陣列內容**。如下範例：

``` js
object.forEach(function (item, index, array) {
    console.log(item.weight); // 項目：60、42、46、52
    console.log(index); // 索引：0,1,2,3
    console.log(array); // 陣列：指向所處理陣列
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
filter()是我最愛使用的一個方法！有開發過需要**過濾陣列**的人，都因該學習這一個方法，比如說商品搜尋、商品類別切換等等，filter()的關鍵在於**依序判斷項目內容，如果為 True 即放入新陣列，最後回傳新陣列**。如下範例： 

``` js
let originData = object.filter(function (item, index, array) {
    return false; // 所有項目都為false，新陣列為空
})

let filterData1 = object.filter(function (item) {
    return item.weight >= 60; // 體重大於等於60放入新陣列
})

let filterData2 = object.filter(item => item.age <= 20) // 配合箭頭函式

console.log(originData); // []空陣列
console.log(filterData1); // [ { name: 'Eric', weight: 60, age: 28 } ]
console.log(filterData2); // [ { name: 'Emma', weight: 46, age: 18 } ]
```

## Array.prototype.find()
find()類似於filter()，不過其處理為**依序判斷項目內容，回傳第一次判斷為True的項目**

``` js
let originData = object.find(function (item, index, array) {
    return false; // 所有項目都為False，回傳undefined
})

let filterData1 = object.find(function (item) {
    return item.weight < 50; // 體重大於等於60放入新陣列
})

let filterData2 = object.find(item => item.age >= 18) // 配合箭頭函式

console.log(originData); // undefined
console.log(filterData1); // { name: 'Alice', weight: 42, age: 24 }
console.log(filterData2); // { name: 'Eric', weight: 60, age: 28 }
```

## Array.prototype.map()


