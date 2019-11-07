---
title: JavaScript ES6 遠端獲取資料 - Fetch API
date: 2019-10-27 16:54:01
description:
categories:
  - JavaScript
tags:
  - JavaScript
  - ES6
  - AJAX
---

## 前言

大多人開發項目都是使用 Axios 或者 jQuery 庫的 \$.ajax 方法來完成 HTTP 請求行為，如果要使用 JS 原生的方法，只有 XMLHttpRequest 可以選擇，但程序繁瑣、順序混亂等問題，我相信大家因該都有遇到過，這次來記錄一下 ES6 新增的原生方法 Fetch API。

<!-- more -->

## 筆記重點

- 傳統 XMLHttpRequest 方法
- Fetch 基本用法
- ReadableStream 解析方法
- Fetch POST 行為

## 傳統 XMLHttpRequest 方法

<img src="https://i.imgur.com/Iz6mnGL.png" alt="XMLHttpRequest行為">

一般人對於 AJAX 行為的理解，差不多都是從封裝過後的方法去做學習，原因很簡單，容易理解、操作方便，但有時我們不想要套用框架，需要使用原生的寫法，我們就只能選擇 XMLHttpRequest 這一個物件去做使用，他是 JS 原生對於 HTTP 請求的操作物件，範例如下：

```js
// 宣告一個 xhr 物件
let xhr = new XMLHttpRequest();

// 請求方式、請求網址、處理方式( true：非同步處理 , false：同步處理 ))
xhr.open('get', 'https://randomuser.me/api/', true);

// 送出請求
xhr.send(null);

// 請求成功觸發
xhr.onload = () => {
  let data = JSON.parse(xhr.response);
};
```

上面是一個 GET 請求範例，很明顯的程序與封裝過後的方法相比較為繁瑣，且令人詬病的點在於**每一個請求都必須新增一個請求的實體**，一個網站通常也不會只有一個請求，整個建構下來，會變得非常混亂，通常不太建議使用這個方法做請求。

## Fetch 基本用法

Fetch 是 ES6 新增的 HTTP 請求方法，基於 Promise 所設計，他讓接口更簡單、簡潔、同時也避免了回調的複雜性，主要就是用來取代傳統的 XMLHttpRequest 方法，下面是一個基本的範例：

- **json() 解析為 JSON 物件**
- **then() 觸發下一步操作**
- **catch() 錯誤時觸發**

```js
fetch('https://randomuser.me/api/')
  .then((response) => {
    // 操作 response 屬性、方法
    return response.json();
  })
  .then((data) => {
    // 實際存取到資料
    console.log(data);
  })
  .catch((error) => {
    // 錯誤回應
    console.log(error);
  });
```

上面是基於 **GET 請求**所撰寫的範例，很明顯的，更為簡單、直接，且利用 Promise 的特性，一步一步的使用 then 操作回應，關於 response 可應用的屬性、方法，將在下面做介紹。

## ReadableStream 解析方法

在 Fetch 回應的資料中，我們可以使用相關的屬性、方法傳遞給下一步做使用，但要注意的是我們**不能直接在回應資料中做資料取用**，因為 Fetch 回應的資料，實際上是一個物件實例，我們所要做的，就是針對這一個物件實例中的 **ReadableStream** 做解析，下面是相關的解析方法：

- **json() ： 解析為 JSON 物件**
- **text() ： 解析為 String 字串**
- **blob() ： 解析為 Blob 內容**
- **arrayBuffer ： 解析為 ArrayBuffer 內容**
- **formData() ： 解析為 formData 內容**
- **clone ： 複製實例物件**

## Fetch POST 行為

在上面都是使用 GET 行為當作範例，不需設定 method，因為 GET 為預設行為，如需使用其他行為，只需要**加入相對應屬性並包裝成物件**即可，如下範例：

```js
fetch('https://vue-course-api.hexschool.io/admin/signin', {
  // 設定為 POST 請求
  method: 'post',
  // 在 headers 加入 json 格式
  headers: {
    'Content-Type': 'application/json',
  },
  // 傳送內容須轉換為字串
  body: JSON.stringify({
    username: 'test@gmail.com',
    password: '66666666',
  }),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

這次使用六角學院的註冊帳號 API 做 POST 行為測試，Fetct 畢竟還是未經過封裝的原生行為，需在傳送內容中做一些調整，這邊要注意的是**傳送內容需轉換為字串**，不然會造成解析錯誤。

## 使用感想

針對 Fetch API 我認為的確有效改善傳統 XMLHttpRequest 為人所詬病的問題，**寫起來乾淨又好維護**，**且基於 Promise 設計**，**支援 async/await**，確實非常強大，不過對於開發稍有規模的專案來講，我還是會以 Axios 來做使用，畢竟支援 Promise 且操作方便，核心是以 xhr 物件做封裝，也不需考慮支援性問題；**Fetch API 畢竟還是底層方法**，操作過程還是得**自己編寫各式各樣的封裝和異常處理**，**並非開箱即用**，不過我認為，他絕對是推動前端 HTTP 行為的潛力股，時間問題而已。
