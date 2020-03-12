---
title: Webpack 前端打包工具 - 使用 babel-loader 與 @babel/runtime 編譯 ES6+ 代碼
description:
  [
    Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，提高兼容性。此篇將介紹如何透過 babel-loader 處理我們的 ES6+ 代碼，後面也會補充介紹 @babel/runtime 與 @babel/polyfill 組件的使用。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Babel]
date: 2020-03-12 08:22:03
updated: 2020-03-12 08:22:03
---

## 前言

Babel 是一款 JavaScript 的編譯器，你可能會有疑問，JavaScript 不是可以直接在 Browser 上運行嗎？為何還需要編譯？事實上 JavaScript 從發行到現在，經過了許多版本的更新，常見的 ES6、ES7 都屬於較新的版本，最為穩定的版本為 ES5，兼容性也是最高的， Babel 的用意就是將較新版本的 JavaScript 編譯成穩定版本，提高兼容性。此篇將介紹如何透過 babel-loader 處理我們的 ES6+ 版本代碼，後面也會補充介紹 @babel/runtime 與 @babel/polyfill 組件的使用。

## 筆記重點

- babel-loader 安裝
- babel-loader 基本使用
- babel-loader 可傳遞選項
