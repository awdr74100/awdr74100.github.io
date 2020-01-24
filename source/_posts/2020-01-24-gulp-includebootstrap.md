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

