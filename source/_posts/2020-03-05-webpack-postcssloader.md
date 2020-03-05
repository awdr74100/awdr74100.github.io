---
title: Webpack 前端打包工具 - 使用 postcss-loader 自動為 CSS 增加 Prefix
description:
  [
    PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，在某些情境也有可能為前處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS Prefix、CSS Conpress 等等。此篇將介紹如何使用 postcss-loader 擴展我們的 CSS 語言特性，主要會以 Autoprefixer 這個 PostCSS Plugin 做示範，自動為編譯完成的 CSS 增加 Prefix，免除手動添加的麻煩。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, PostCSS, SCSS]
date: 2020-03-05 20:09:44
updated: 2020-03-05 20:09:44
---

## 前言

PostCSS 是一套使用 JavaScript 轉換 CSS 的工具，有別於以往 Sass、Less 等預處理器將檔案編譯成 CSS，PostCSS 是針對 CSS 後續所作行為處理的後處理器，在某些情境也有可能為前處理器，透過載入並使用 Plugin 的方式來完成目的，常見的使用情境為 CSS Prefix、CSS Conpress 等等。此篇將介紹如何使用 postcss-loader 擴展我們的 CSS 語言特性，主要會以 Autoprefixer 這個 PostCSS Plugin 做示範，自動為編譯完成的 CSS 增加 Prefix，免除手動添加的麻煩。

## 筆記重點

- postcss-loader 安裝
- postcss-loader 基本使用
- postcss-loader 可傳遞選項

## postcss-loader 安裝

> 套件連結：[postcss-loader](https://github.com/postcss/postcss-loader)、[autoprefixer](https://github.com/postcss/autoprefixer)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

postcss-loader 與 autoprefixer：

```bash
$ npm install postcss-loader autoprefixer -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```
