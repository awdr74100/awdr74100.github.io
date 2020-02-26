---
title: Webpack 前端打包工具 - 使用 css-loader 處理樣式表
description:
  [
    上次在介紹 Webpack 時有稍微提到 Loader 究竟是做什麼用，簡單來講，Webpack 本身只能處理 JavaScript 模組，如果要處理其他類型的文件，就需要使用相關的 Loader 進行轉換。Loader 可以理解為模組和資源的轉換器，它本身是一個 function，接受源文件作為參數傳遞，最後返回轉換後的結果。這次讓我們從最基本的打包 CSS 開始講解，利用 css-loader 將源文件相關的 CSS 檔進行轉換，並利用 css-loader 的好搭檔 style-loader 將轉換後的 CSS 附加到 style 標籤已進行存取。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-26 19:17:58
updated: 2020-02-26 19:17:58
---

## 前言

上次在介紹 Webpack 時有稍微提到 Loader 究竟是做什麼用，簡單來講，Webpack 本身只能處理 JavaScript 模組，如果要處理其他類型的文件，就需要使用相關的 Loader 進行轉換。Loader 可以理解為模組和資源的轉換器，它本身是一個 function，接受源文件作為參數傳遞，最後返回轉換後的結果。這次讓我們從最基本的打包 CSS 開始講解，利用 css-loader 將源文件相關的 CSS 檔進行轉換，並利用 css-loader 的好搭檔 style-loader 將轉換後的 CSS 附加到 style 標籤已進行存取。

## 筆記重點

- css-loader 安裝

## css-loader 安裝

> 套件連結：[css-loader](https://github.com/webpack-contrib/css-loader)

