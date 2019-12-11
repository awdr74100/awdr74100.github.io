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

非同步處理一直以來都是 JavaScript 開發者很常遇到的情境，在之前，我們都是使用 callback 去完成任務，當結構變得複雜時，容易形成所謂的 callback hell，造成程式碼難以維護；在 ES6 版本中，新增了 Promise 物件，它能夠將非同步流程包裝成簡潔的結構，並提供統一的錯誤處理機制，解決了傳統 callback hell 的問題。

<!-- more -->

## 筆記重點

- **何謂 Callback hell ？**
- **Promise 狀態**
- **Promise 操作**
- **Promise 方法**
- **Promise 限制**