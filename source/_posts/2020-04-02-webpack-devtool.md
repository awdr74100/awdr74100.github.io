---
title: Webpack 前端打包工具 - 切換 devtool 選項用以生成各式 SourceMap
description:
  [
    相比於 Gulp 需使用套件才能生成 SourceMap，Webpack 只需簡單的開啟 devtool 選項即可生成 SourceMap，且提供了多達 10 種以上的類型供開發者使用，簡直太強大。此篇將介紹如何在 Webpack 開啟 devtool 選項用以生成 SourceMap，並說明在各式 SourceMap 類型下，該如何針對 development (開發環境) 與 production (生產環境) 做最合適的挑選。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-04-02 14:26:09
updated: 2020-04-02 14:26:09
---

## 前言

相比於 Gulp 需使用套件才能生成 SourceMap，Webpack 只需簡單的開啟 devtool 選項即可生成 SourceMap，且提供了多達 10 種以上的類型供開發者使用，簡直太強大。此篇將介紹如何在 Webpack 開啟 devtool 選項用以生成 SourceMap，並說明在各式 SourceMap 類型下，該如何針對 development (開發環境) 與 production (生產環境) 做最合適的挑選。

## 筆記重點

- 相關套件安裝
- sourcemap 類型差異
- sass-loader 開啟 sourcemap 支援
- postcss-loader 開啟 sourcemap 支持
