---
title: Gulp 前端自動化 - Browsersync 瀏覽器同步測試工具
description:
  [
    在開發 Web 應用時，我們很常針對瀏覽器執行重新整理的指令，以便查看最新修改過後結果，從專案開始到結束，我們可能按了無數次的 F5，造成效率的低落，這時我們就可以使用 BrowserSync 這款工具，BrowserSync 能讓瀏覽器實現、快速響應你的文件修改(HTML、JavaScript、CSS、Sass、Less)並自動刷新頁面，啟動時會在本地端開啟一個虛擬伺服器，這也代表了不同裝置間能夠依靠伺服器位址同步更新並觀看頁面，無論你是前端還是後端工程師，都非常建議使用這款工具。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, SCSS, Pug, Babel]
date: 2020-01-14 23:38:37
---

## 前言

在開發 Web 應用時，我們很常針對瀏覽器執行重新整理的指令，以便查看最新修改過後結果，從專案開始到結束，我們可能按了無數次的 F5，造成效率的低落，這時我們就可以使用 BrowserSync 這款工具，BrowserSync 能讓瀏覽器實現、快速響應你的文件修改(HTML、JavaScript、CSS、Sass、Less)並自動刷新頁面，啟動時會在本地端開啟一個虛擬伺服器，這也代表了不同裝置間能夠依靠伺服器位址同步更新並觀看頁面，無論你是前端還是後端工程師，都非常建議使用這款工具。

## 筆記重點

- BrowserSync 安裝
- BrowserSync 基本使用
- BrowserSync 可傳遞選項

## BrowserSync 安裝

> 套件連結：[browser-sync](https://www.npmjs.com/package/browser-sync)

```bash
$ npm install browser-sync
```

NPM 上有一款名為 browsersync 的套件，這個套件並不是 BrowserSync 官方的套件，正確的套件名稱為 browser-sync，請安裝正確的官方套件，以便後面的範例能夠順利進行。

## BrowserSync 基本使用