---
title: Webpack 前端打包工具 - 使用 url-loader 與 file-loader 處理靜態資源
description:
  [
    上一次在介紹 mini-css-extract-plugin 時，有提到關於使用 background-image:url() 以相對路徑參考本地圖片時所發生的錯誤，最後是使用 file-loader 解決此問題；簡單來說，file-loader 就是用來處理一般開發網頁時所使用的靜態資源，例如：字形、圖片等等，將所有資源載入到 Webpack 內，並且解析資源的相互依賴，最後以配置的選項生成對應的結果；而 url-loader 則類似於 file-loader，可依資源的大小做對應的處理。此篇將介紹 file-loader 與 url-loader 的使用方法，以及兩者在應用時最大的差別為何。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-03-07 17:54:48
updated: 2020-03-07 17:54:48
---

## 前言

上一次在介紹 mini-css-extract-plugin 時，有提到關於使用 background-image:url() 以相對路徑參考本地圖片時所發生的錯誤，最後是使用 file-loader 解決此問題；簡單來說，file-loader 就是用來處理一般開發網頁時所使用的靜態資源，例如：字形、圖片等等，將所有資源載入到 Webpack 內，並且解析資源的相互依賴，最後以配置的選項生成對應的結果；而 url-loader 則類似於 file-loader，可依資源的大小做對應的處理。此篇將介紹 file-loader 與 url-loader 的使用方法，以及兩者在應用時最大的差別為何。

## 筆記重點

