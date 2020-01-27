---
title: Gulp 前端自動化 - CommonJS 模組化設計
description:
  [
    CommonJS 為當初最早設計用來解決 JavaScript 模組化設計的規範，使用簡單的幾個語法，即可達到模組化的效果。本篇不會探討較新標準的其他規範，比如 ES6 Module 等等，將會把焦點放在如何以 CommonJS 規範針對 Gulp 進行模組化設計，以及 CommonJS 規範中最常被人拿來討論的 module.exports 與 exports 語法兩者差別。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, JavaScript]
date: 2020-01-26 21:25:12
---

## 前言

CommonJS 為當初最早設計用來解決 JavaScript 模組化設計的規範，使用簡單的幾個語法，即可達到模組化的效果。本篇不會探討較新標準的其他規範，比如 ES6 Module 等等，將會把焦點放在如何以 CommonJS 規範針對 Gulp 進行模組化設計，以及 CommonJS 規範中最常被人拿來討論的 module.exports 與 exports 語法兩者差別。

## 筆記重點

- CommonJS 規範相關語法

## CommonJS 規範相關語法

請先建立以下專案結構：

```plain
commonjs/
|
| - main.js            # JavaScript 主檔案
|
| - module.js          # JavaScript 模組
| - gulpfile.js
```

CommonJS 規範相關語法：

- `module.exports`：導出模塊(推薦寫法)
- `exports`：導出模塊
- `require`：引入模塊


