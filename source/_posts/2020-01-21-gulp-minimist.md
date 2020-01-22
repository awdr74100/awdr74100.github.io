---
title: Gulp 前端自動化 - Minimist 命令行參數解析工具
description:
  [
    通常在開發項目時，我們會分所謂的 development(開發環境) 與 production(生產環境)；常見的壓縮代碼流程就屬於 production 環境，你不會想再 development 環境壓縮代碼的，全部代碼都擠在一起，除起錯來相當困難。此篇將介紹如何使用 Minimist 命令行參數解析工具區分 Gulp 套件在 development 與 production 環境下的使用。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-21 16:18:32
---

## 前言

通常在開發項目時，我們會分所謂的 development(開發環境) 與 production(生產環境)；常見的壓縮代碼流程就屬於 production 環境，你不會想再 development 環境壓縮代碼的，全部代碼都擠在一起，除起錯來相當困難。此篇將介紹如何使用 Minimist 命令行參數解析工具區分 Gulp 套件在 development 與 production 環境下的使用。

## 筆記重點

- minimist 安裝
- minimist 基本使用

## minimist 安裝

> 套件連結：[minimist](https://www.npmjs.com/package/minimist)、[gulp-if](https://www.npmjs.com/package/gulp-if)

minimist：

```bash
$ npm install minimist
```

gulp-if：

```bash
$ npm install gulp-if
```

minimist 套件為解析命令行傳遞參數用，我們可以使用 gulp-if 套件針對這一個參數做判斷，區分出 development 與 production 環境分別運行那些套件。為使下面範例正常運行，請先將這兩個套件進行安裝。

## minimist 基本使用

初始專案結構：

```plain
gulpDemo/
|
| - node_modules/
|
| - source/
|   | - scss/
|       | - all.scss   # SCSS 主檔案
|
| - gulpfile.js        # Gulp 主檔案
| - test.js            # minimist 範例檔案
| - package-lock.json
| - package.json       # 安裝 gulp、gulp-scss、minimist、gulp-if
```

minimist 範例檔案：

```js
```
