---
title: Sass / SCSS 預處理器 - @function 建立函式與 @return 返回結果
description:
  [
    之前介紹 @mixin 時是以一般語言的函式做為參考進行操作，事實上 SCSS 有更符合函式定義的語法名為 @function，與 @mixin 不同的地方在於 @function 無法直接將 CSS 樣式加載至當前所在的 CSS 塊內，反而是透過 @return 將函式內處理的結果返回到呼叫的對象後續再進行相關處理，簡單來講就是 @mixin 負責包裝 CSS 樣式，而 @function 則是包裝需透過處理使之形成的有效對象，該如何透過 @function 進一步提升開發效率也就是本篇的重點。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-06-01 12:30:43
updated: 2020-06-01 12:30:43
---

## 前言

之前介紹 @mixin 時是以一般語言的函式做為參考進行操作，事實上 SCSS 有更符合函式定義的語法名為 @function，與 @mixin 不同的地方在於 @function 無法直接將 CSS 樣式加載至當前所在的 CSS 塊內，反而是透過 @return 將函式內處理的結果返回到呼叫的對象後續再進行相關處理，簡單來講就是 @mixin 負責包裝 CSS 樣式，而 @function 則是包裝需透過處理使之形成的有效對象，該如何透過 @function 進一步提升開發效率也就是本篇的重點。
