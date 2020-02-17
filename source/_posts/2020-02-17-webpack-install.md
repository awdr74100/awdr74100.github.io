---
title: Webpack 前端模組化 - 環境安裝與執行
description:
  [
    前端的世界日新月異，各種妖魔鬼怪接踵而出，Webpack 就屬於當前時代的產物，在許多現代框架也都看的到它的身影，有別於 Gulp、Grunt 任務流程執行工具，Webpack 是以模組打包方式去來完成任務，提供更為強大的功能，包含現正熱門的 SPA (單頁式應用) 也能輕鬆應付，可說是前端開發者必學的工具。本篇將從 Webpack 運作原理開始做介紹，接著說明 Webpack 該如何進行安裝，最後透過打包方式產出我們的第一個 bundle.js 檔案。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-17 17:29:46
updated: 2020-02-17 17:29:46
---

## 前言

前端的世界日新月異，各種妖魔鬼怪接踵而出，Webpack 就屬於當前時代的產物，在許多現代框架也都看的到它的身影，有別於 Gulp、Grunt 任務流程執行工具，Webpack 是以模組打包方式去來完成任務，提供更為強大的功能，包含現正熱門的 SPA (單頁式應用) 也能輕鬆應付，可說是前端開發者必學的工具。本篇將從 Webpack 運作原理開始做介紹，接著說明 Webpack 該如何進行安裝，最後透過打包方式產出我們的第一個 bundle.js 檔案。

## 筆記重點

- Webpack 簡介
- Webpack 安裝

## Webpack 簡介

![Webpack 介紹](https://img.magiclen.org/albums/webpack/shot-01.png)

在一般的前端開發中，我們很常使用 Sass/SCSS、Pug、CoffeeScript 等預處理器加速開發，
