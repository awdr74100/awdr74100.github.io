---
title: Gulp 前端自動化 - 導入 Bootstrap 並客製它
description:
  [
    Bootstrap 目前已經算是前端必備的技能了，相信大部分人在使用時都是以 CDN 的方式進行載入，但這樣子的作法等同於將整個官方預編譯好的 Bootstrap 進行載入，當我們需要客製化 Bootstrap 樣式時，必定得採取其他方法。此篇將介紹如何使用 npm 方式載入 Bootstrap，並透過 Gulp 編譯屬於我們自己的客製化樣式。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, Bootstrap, CSS]
date: 2020-01-24 15:46:07
---

## 前言

Bootstrap 目前已經算是前端必備的技能了，相信大部分人在使用時都是以 CDN 的方式進行載入，但這樣子的作法等同於將整個官方預編譯好的 Bootstrap 進行載入，當我們需要客製化 Bootstrap 樣式時，必定得採取其他方法。此篇將介紹如何使用 npm 方式載入 Bootstrap，並透過 Gulp 編譯屬於我們自己的客製化樣式。

## 筆記重點

- 相關套件安裝
- 客製並編譯 Bootstrap 預設變數

## 相關套件安裝

> 套件連結：[gulp-sass](https://www.npmjs.com/package/gulp-sass)、[gulp-postcss](https://www.npmjs.com/package/gulp-postcss)、[autoprefixer](https://www.npmjs.com/package/autoprefixer)、[bootstrap](https://getbootstrap.com/)

gulp-sass：

```bash
$ npm install gulp-sass
```

gulp-postcss：

```bash
$ npm install gulp-postcss
```

autoprefixer：

```bash
$ npm install autoprefixer
```

bootstrap：

```bash
$ npm install bootstrap
```

Bootstrap 4 主要由 SCSS 建構而成，當你使用 npm 方式進行安裝時，在下載下來的 package 內即包含未編譯的 SCSS 原始檔案，我們可以針對這一個原始檔案進行客製化並編譯它，在這邊使用 gulp-sass 套件進行編譯，由於 Bootstrap 官方的預編譯版本有使用到 autoprefixer 插件以便自動在構建時向某些 CSS 屬性增加前輟詞，我們在處理編譯後檔案時，也必須參照此作法，所以同時安裝了 gulp-postcss 與 autoprefixer 套件。

## 客製並編譯 Bootstrap 預設變數

初始專案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - scss/
|       | - helpers/
|           | - _variables.scss   # 複製 ~bootstrap/scss/_variables.scss
|
|       | - all.scss   # SCSS 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-sass、gulp-postcss、autoprefixer、bootstrap
```

