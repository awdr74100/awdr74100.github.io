---
title: Webpack 模組打包器 - 環境安裝與執行
description:
  [
    Webpack 可說是近年來最為熱門的技術，以往在編寫 ES6、Sass/SCSS、Pug、Vue、React 等預處理器或需編譯內容時，通常都得透過自動化工具，如 Gulp、Grunt 等任務流程執行工具進行編譯處理，到了現在，Webpack 已逐漸取代這些工具，Webpack 本身提供許多強大的功能，包含現正熱門的 SPA (單頁式應用) 透過配置 loader 方式也能輕鬆應付。本篇將從 Webpack 運行原理開始做介紹，接著說明如何安裝 Webpack，最後透過打包方式產出我們的第一個 bundle.js 檔案。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-17 17:29:46
updated: 2020-02-17 17:29:46
---

## 前言

Webpack 可說是近年來最為熱門的技術，以往在編寫 ES6、Sass/SCSS、Pug、Vue、React 等預處理器或需編譯內容時，通常都得透過自動化工具，如 Gulp、Grunt 等任務流程執行工具進行編譯處理，到了現在，Webpack 已逐漸取代這些工具，Webpack 本身提供許多強大的功能，包含現正熱門的 SPA (單頁式應用) 透過配置 loader 方式也能輕鬆應付。本篇將從 Webpack 運行原理開始做介紹，接著說明如何安裝 Webpack，最後透過打包方式產出我們的第一個 bundle.js 檔案。

## 筆記重點

- Webpack 簡介
- Webpack 安裝

## Webpack 簡介

![Webpack 介紹](https://img.magiclen.org/albums/webpack/shot-01.png)

Webpack 本身是一個開源的 JavaScript 模組打包工具，提供了前端缺乏的模組化開發方式，將各種靜態資源視為模組，當執行相關命令進行編譯時，將依 `webpack.config.js` 配置檔案執行優化並將其打包成單個 JavaScript 檔案。
