---
title: Webpack 前端打包工具 - 使用 purgecss-webpack-plugin 清除多餘的 CSS
description:
  [
    在上一篇文章中，介紹了如何使用 Webpack 打包客製化的 Bootstrap 樣式，但在這邊還有一個問題，那就是打包出來的 CSS 太肥了，這也是 Bootstrap 為人詬病的原因，我們根本不需要這麼多的樣式，一半以上的 class 都沒有存在的必要，當時的解決辦法是手動移除預設載入的 component，但我們使用的可是 Webpack 自動化工具阿！，當然也要以自動化方式進行處理。此篇將介紹如何使用 purgecss-webpack-plugin 清除多餘的 CSS 代碼，大幅縮減檔案大小。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Bootstrap, PurgeCSS, CSS, w3HexSchool]
date: 2020-03-30 13:37:33
updated: 2020-03-30 13:37:33
---

## 前言

在上一篇文章中，介紹了如何使用 Webpack 打包客製化的 Bootstrap 樣式，但在這邊還有一個問題，那就是打包出來的 CSS 太肥了，這也是 Bootstrap 為人詬病的原因，我們根本不需要這麼多的樣式，一半以上的 class 都沒有存在的必要，當時的解決辦法是手動移除預設載入的 component，但我們使用的可是 Webpack 自動化工具阿！，當然也要以自動化方式進行處理。此篇將介紹如何使用 purgecss-webpack-plugin 清除多餘的 CSS 代碼，大幅縮減檔案大小。

## 筆記重點

- purgecss-webpack-plugin 安裝
- purgecss-webpack-plugin 基本使用
- purgecss-webpack-plugin 可傳遞選項
- 補充：@fullhuman/postcss-purgecss 插件
- 補充：PurifyCSS 線上縮減服務

## purgecss-webpack-plugin 安裝
