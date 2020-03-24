---
title: Webpack 前端打包工具 - 使用 clean-webpack-plugin 清除構建資料夾
description:
  [
    在我們每次編譯 Webpack 時，都必須刪除之前測試所建構的 dist 資料夾，以確保結果為最新狀態，可能有些人並沒有這個困擾，那是因為你並沒有在 filename 屬性加入 hash 值，此時編譯處理為取代其檔案，在一般開發中我們都會在檔案名稱加入 hash 值，避免快取機制發生的問題，此時由於檔案名稱的 hash 值不同，其編譯處理將轉為新增，dist 資料夾也就會遺留之前測試所建構出的檔案。此篇將介紹使用 clean-webpack-plugin 在每次編譯時刪除之前測試所建構出的檔案，接著才生成編譯結果。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-03-25 02:18:29
updated: 2020-03-25 02:18:29
---

## 前言

在我們每次編譯 Webpack 時，都必須刪除之前測試所建構的 dist 資料夾，以確保結果為最新狀態，可能有些人並沒有這個困擾，那是因為你並沒有在 filename 屬性加入 hash 值，此時編譯處理為取代其檔案，在一般開發中我們都會在檔案名稱加入 hash 值，避免快取機制發生的問題，此時由於檔案名稱的 hash 值不同，其編譯處理將轉為新增，dist 資料夾也就會遺留之前測試所建構出的檔案。此篇將介紹使用 clean-webpack-plugin 在每次編譯時刪除之前測試所建構出的檔案，接著才生成編譯結果。

## 筆記重點

- clean-webpack-plugin 安裝
- clean-webpack-plugin 基本使用
- clean-webpack-plugin 可傳遞選項


