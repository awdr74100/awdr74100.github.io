---
title: Webpack 前端打包工具 - 使用 SplitChunksPlugin 抽離公用模組
description:
  [
    一般在做各種開發時，我們很常引入一些 npm 套件加快功能的實現，比如說 AJAX 行為就很適合使用 axios 套件來完成，當我們使用 Webpack 進行打包時，相關的 npm 套件也會通通被打包進 bundle.js 內，但這樣的行為對效能來說是較不友善的，原因為 bundle.js 實在是太肥大了，正確的作法應該是將 node_modules 內的模組單獨打包成一個檔案，避免載入時間過長的問題。此篇將介紹如何使用 SplitChunksPlugin 抽離 node_modules 內模組使之成為獨立的檔案，後面也會介紹當我們在開發多頁式應用時，如何以 SplitChunksPlugin 抽離公用模組用以解決重複程式碼的問題。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-04-06 21:04:08
updated: 2020-04-06 21:04:08
---

## 前言

一般在做各種開發時，我們很常引入一些 npm 套件加快功能的實現，比如說 AJAX 行為就很適合使用 axios 套件來完成，當我們使用 Webpack 進行打包時，相關的 npm 套件也會通通被打包進 bundle.js 內，但這樣的行為對效能來說是較不友善的，原因為 bundle.js 實在是太肥大了，正確的作法應該是將 node_modules 內的模組單獨打包成一個檔案，避免載入時間過長的問題。此篇將介紹如何使用 SplitChunksPlugin 抽離 node_modules 內模組使之成為獨立的檔案，後面也會介紹當我們在開發多頁式應用時，如何以 SplitChunksPlugin 抽離公用模組用以解決重複程式碼的問題。

## 筆記重點

- 相關套件安裝
- SplitChunksPlugin 基本使用
- SplitChunksPlugin 可傳遞選項

## 相關套件安裝

過程會使用到的套件：

```bash
npm install html-webpack-plugin clean-webpack-plugin webpack webpack-cli -D ; npm install axios -P
```

package.json：

```json
{
  "devDependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^4.0.4",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  },
  "dependencies": {
    "axios": "^0.19.2"
  }
}
```

在 Webpack 4 中，SplitChunksPlugin 已預設裝載，我們不需要進行任何安裝動作，配置即可使用，事實上，SplitChunksPlugin 本身就已經開啟了，但預設配置是針對較為"特別"的情境才有作用，這才導致我們沒有感覺 SplitChunksPlugin 已經作用在當前還環境，為了保證結果如同預期，請先安裝上面所陳列的相關套件。

## SplitChunksPlugin 基本使用
