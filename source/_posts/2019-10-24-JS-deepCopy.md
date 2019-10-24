---
title: JavaScript 淺拷貝(Shallow Copy)與深拷貝(Deep Copy)
date: 2019-10-24 15:54:42
description: 
  # - 代編輯
categories:
  - JavaScript
tags:
  - JavaScript
  - ES6
  - Deep Copy
---

## 動機
在開發Vue項目時，需要利用Props與Emit使元件互相溝通，當時沒注意到物件有Shallow Copy與Deep Copy等特性，使用Computed計算屬性時，無法完成預期效果，故使用筆記加強印象！
<!-- more -->

## 筆記重點
+ 何謂傳值 ？
+ 何謂傳址 ？
+ 淺拷貝物件方式
+ 深拷貝物件方式

## 基本型別與物件型別差異
![JavaScript資料型別](https://dotnettricks.blob.core.windows.net/img/javascript/js-datatype.png)

在 JavaScript 的世界裡有基本型別與物件型別兩種定義。

基本型別為：Number、String、Boolean、Null、Undefined、Symbol (ES6新增)
其餘基本上都屬於物件型別，兩種資料型別最大的差異就在於傳值方式

基本型別在賦值時，是採用**pass by value**方式，也就是**傳值**

``` js
let a = 'blue';
let b = a;
b = 'red';

console.log(b); // red
```

而物件型別在賦值時，是採用**pass by reference**方式，也就是**傳址**

``` js
let array = ['red','blue','yellow'];
let object ={p1:'111',p2:'222',p3:'333'};

let arrayCP = array;
arrayCP[0] = 'black';

let objectCP = object;
objectCP.p2 = '444';

console.log(array); // [ 'black', 'blue', 'yellow' ]  <= 原陣列被影響，因為是傳址 
console.log(arrayCP); // [ 'black', 'blue', 'yellow' ]
console.log(object); // { p1: '111', p2: '444', p3: '333' }  <= 原物件被影響，因為是傳址 
console.log(objectCP); // { p1: '111', p2: '444', p3: '333' }  
```

看出兩者的差別了嗎！當你使用等號賦值時，會間接的影響原物件，因為都是指向**原物件記憶體位址**，並不會創造新的拷貝物件，這種方法是很不切實際的，牽一髮動全身的概念，所以當我們在**複製**物件或陣列時，基本上都是使用函式的方式去做處理。


















<!-- <img src='https://d1dwq032kyr03c.cloudfront.net/upload/images/20190926/20104175vA55RlDfRq.png' width='70%'> -->
<!-- <p>在 JavaScript 的世界裡有基本型別與物件型別兩種定義。</p>
<p>一般常見的 Hello World 就是屬於基本型別中的<span style='color:#ff8000'> String </span>，其中包括<span style='color:#ff8000'> Number、Boolean、Null、Undefined、Symbol </span>也都是屬於<span style='color:#ff8000'> String </span></p> -->



