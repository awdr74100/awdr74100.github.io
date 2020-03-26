---
title: Webpack 前端打包工具 - 使用 webpack-dev-server 實現 Live Reload 或 HMR 方式進行開發
description:
  [
    在 Gulp 的環境中，我們會導入 Browsersync 套件方便以 Live Reload 方式做開發，在 Webpack 中也有類似的套件，名為 webpack-dev-server，與傳統 Live Reload 工具較為不同的是，除了支援 Live Reload 以外，還支援 HMR (Hot Module Replacement) 特性，再不刷新 Browser 的情況下注入修改過後的代碼，達到不丟失應用狀態下即時更新畫面。此篇將介紹如何使用 webpack-dev-server 以 Live Reload 或 HMR 方式進行開發，途中也會補充 publicPath 與 contentBase 這兩個很常坑人的選項正確用法。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-03-26 00:20:08
updated: 2020-03-26 00:20:08
---

## 前言

在 Gulp 的環境中，我們會導入 Browsersync 套件方便以 Live Reload 方式做開發，在 Webpack 中也有類似的套件，名為 webpack-dev-server，與傳統 Live Reload 工具較為不同的是，除了支援 Live Reload 以外，還支援 HMR (Hot Module Replacement) 特性，再不刷新 Browser 的情況下注入修改過後的代碼，達到不丟失應用狀態下即時更新畫面。此篇將介紹如何使用 webpack-dev-server 以 Live Reload 或 HMR 方式進行開發，途中也會補充 publicPath 與 contentBase 這兩個很常坑人的選項正確用法。

## 筆記重點

- webpack-dev-server 安裝
- webpack-dev-server 基本使用
- webpack-dev-server 可傳遞選項

## webpack-dev-server 安裝

> 套件連結：[webpack-dev-server](https://github.com/webpack/webpack-dev-server)、[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

webpack-dev-server：

```bash
$ npm install webpack-dev-server -D
```

require：

```bash
$ npm install html-webpack-plugin css-loader mini-css-extract-plugin -D
```

請先將一般開發環境所需的 loader 與 plugin 進行安裝，最後也必須安裝 webpack-dev-server 用以作為此次討論的目標。

## webpack-dev-server 基本使用

<div class="note warning">此次範例會搭配 css-loader、html-webpack-plugin、mini-css-extract-plugin 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a>、<a href="https://awdr74100.github.io/2020-03-23-webpack-htmlwebpackplugin/" target="_blank">html-webpack-plugin</a>、<a href="https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/" target="_blank">mini-css-extract-plugin</a></div>
