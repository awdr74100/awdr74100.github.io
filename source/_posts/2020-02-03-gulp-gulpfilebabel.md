---
title: Gulp 前端自動化 - 使用 ES6 語法撰寫 gulpfile.js
description:
  [
    隨著 JavaScript 版本的推進，ES6 版本已逐漸大眾化，在各種開發環境下，ES6 相關語法都能夠更有效率的幫助你完成目的，唯一的問題是，在某些環境下，我們得依靠 Babel 等相關編譯器將代碼編譯成 ES5 代碼以提高兼容性。此篇將使用 import/export 等 ES6 module 語法撰寫我們的 gulpfile.js，並透過 Babel 編譯以保證任務成功運行。,
  ]
categories: [Gulp]
tags: [Gup 4, Node.js]
date: 2020-02-03 18:57:47
---

## 前言

隨著 JavaScript 版本的推進，ES6 版本已逐漸大眾化，在各種開發環境下，ES6 相關語法都能夠更有效率的幫助你完成目的，唯一的問題是，在某些環境下，我們得依靠 Babel 等相關編譯器將代碼編譯成 ES5 代碼以提高兼容性。此篇將使用 import/export 等 ES6 module 語法撰寫我們的 gulpfile.js，並透過 Babel 編譯以保證任務成功運行。

## 筆記重點

- Babel 相關套件安裝
- CommonJS 改成 ES6 Module 寫法

## Babel 相關套件安裝