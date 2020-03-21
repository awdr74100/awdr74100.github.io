---
title: Webpack 前端打包工具 - 使用 html-webpack-plugin 生成 HTML 文件
description:
  [
    在之前介紹 Webpack 的各種 loader 時，最後都得手動生成 HTML 文件並引入相關的靜態檔案，這樣不是很矛盾嗎？Webpack 可是自動化工具阿！怎會有這麼個缺陷？不用擔心，那是因為我們還沒使用 html-webpack-plugin 這一個插件，html-webpack-plugin 可以幫助我們指定本地的模板文件，並透過傳遞選項方式，生成對應的 HTML 文件，同時也會將 entry 內的所有靜態文件做引入動作，解決手動引入的困擾。此篇將介紹如何透過 html-webpack-plugin 生成自動引入靜態檔案的 HTML 文件。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-03-23 12:20:45
updated: 2020-03-24 02:10:10
---

## 前言

在之前介紹 Webpack 的各種 loader 時，最後都得手動生成 HTML 文件並引入相關的靜態檔案，這樣不是很矛盾嗎？Webpack 可是自動化工具阿！怎會有這麼個缺陷？不用擔心，那是因為我們還沒使用 html-webpack-plugin 這一個插件，html-webpack-plugin 可以幫助我們指定本地的模板文件，並透過傳遞選項方式，生成對應的 HTML 文件，同時也會將 entry 內的所有靜態文件做引入動作，解決手動引入的困擾。此篇將介紹如何透過 html-webpack-plugin 生成自動引入靜態檔案的 HTML 文件。

## 筆記重點

- html-webpack-plugin 安裝
- html-webpack-plugin 基本使用
- html-webpack-plugin 可傳遞選項

## html-webpack-plugin 安裝

> 套件連結：[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

html-webpack-plugin：

```bash
$ npm install html-webpack-plugin -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```

為了模擬一般開發常見的環境，請同時安裝 css-loader 與 mini-css-extract-plugin 用以處理 CSS 檔案，最後我們會使用 html-webpack-plugin 將這些靜態檔案做自動引入的動作，同時生成 `templete` 可傳遞選項指定模板的 HTML 文件。

## html-webpack-plugin 基本使用

初始專案結構：
