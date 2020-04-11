---
title: Webpack 前端打包工具 - 使用 vue-loader 手動建置出 Vue CLI 環境
description:
  [
    從 Vue CLI v3 開始引入了 webpack-chain 套件，同時針對配置進行了高度抽象化，我們不能以先前配置 Webpack 的方式進行撰寫，而是必須閱讀官方文件配置在專屬的 vue.config.js 檔案內才能起作用，是不是覺得這樣太麻煩了？不如我們依照自己習慣手動建置一個 Vue CLI 環境吧！此篇將介紹如何使用 vue-loader 並搭配先前所介紹的 loader 與 plugin 手動建置出 Vue CLI 的環境。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Vue.js, w3HexSchool]
date: 2020-04-13 00:01:10
updated: 2020-04-13 00:01:10
---

## 前言

從 Vue CLI v3 開始引入了 webpack-chain 套件，同時針對配置進行了高度抽象化，我們不能以先前配置 Webpack 的方式進行撰寫，而是必須閱讀官方文件配置在專屬的 vue.config.js 檔案內才能起作用，是不是覺得這樣太麻煩了？不如我們依照自己習慣手動建置一個 Vue CLI 環境吧！此篇將介紹如何使用 vue-loader 並搭配先前所介紹的 loader 與 plugin 手動建置出 Vue CLI 的環境。

## 筆記重點

- vue-loader 安裝
- vue-loader 基本使用

## vue-loader 安裝
