---
title: Gulp 前端自動化 - 壓縮圖片
description:
  [
    上一次介紹完了代碼該如何壓縮，這一次我們來介紹該如何壓縮圖片，事實上，影響網頁載入速度最重要的關鍵就在於圖片，無論你的代碼優化的多麼完美，只要一張 size 較大的圖片存在於網頁上，就有可能造成渲染速度的低落，我們所要做的就是將這些圖片進行壓縮，盡可能的減少檔案大小，達到最佳化的目的；此篇將介紹如何使用 gulp-imagemin 套件進行圖片壓縮等應用。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-20 02:01:36
---

## 前言

上一次介紹完了代碼該如何壓縮，這一次我們來介紹該如何壓縮圖片，事實上，影響網頁載入速度最重要的關鍵就在於圖片，無論你的代碼優化的多麼完美，只要一張 size 較大的圖片存在於網頁上，就有可能造成渲染速度的低落，我們所要做的就是將這些圖片進行壓縮，盡可能的減少檔案大小，達到最佳化的目的；此篇將介紹如何使用 gulp-imagemin 套件進行圖片壓縮等應用。

## 筆記重點

- gulp-imagemin 安裝
- gulp-imagemin 基本使用
- gulp-imagemin 可傳遞選項

## gulp-imagemin 安裝

> 套件連結：[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)

```bash
$ npm install gulp-imagemin
```

gulp-imagemin 套件可以幫助我們壓縮 PNG、JPEG、GIF、SVG 等類型圖檔，無任何相依套件需安裝，直接安裝此套件即可。

## gulp-imagemin 基本使用
