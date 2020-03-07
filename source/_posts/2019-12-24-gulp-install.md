---
title: Gulp 前端自動化 - 環境安裝與執行
description:
  [
    相信大多數人多少都有聽過 Gulp 這個工具，但卻沒有實際的去使用過它，Gulp 是一個自動化工具，基於串流(Stream)的方式來完成所設立的任務(Task)，擁有豐富的套件可供使用，可滿足前端開發者大部分的需求。此篇將介紹 Gulp 的環境要如何安裝以及建立第一個 Task，關於套件的部分將會獨立在做介紹。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2019-12-24 19:30:32
updated: 2020-02-11 13:04:31
---

## 前言

相信大多數人多少都有聽過 Gulp 這個工具，但卻沒有實際的去使用過它，Gulp 是一個自動化工具，基於串流(Stream)的方式來完成所設立的任務(Task)，擁有豐富的套件可供使用，可滿足前端開發者大部分的需求。此篇將介紹 Gulp 的環境要如何安裝以及建立第一個 Task，關於套件的部分將會獨立在做介紹。

## 筆記重點

- Gulp 簡介
- Gulp 安裝
- Gulp 初始化專案
- 開發第一個 Gulp Task

## Gulp 簡介

<img src="https://i.imgur.com/h4dIXip.png" alt="Gulp 介紹">

在之前為了加強對於網頁元素的應用，我很常去觀看各大網站的原始碼，但有時會發現某些網站的代碼全部都擠在一起，非常難以閱讀，當時的我以為他們是故意的，到了後來才發現這個應用叫做壓縮代碼，通常在將要正式上線的網站都會有壓縮代碼的步驟，原因很簡單，以網站效能來說，大小的控管是非常重要的，多餘的空間就足以造成整體效能的低落，而壓縮代碼這個服務就是依靠 Gulp、Webpack 等相關工具來完成的，在這邊我們不討論 Webpack，以後有時間再作介紹，Gulp 不只可以幫助我們完成壓縮代碼服務，其中也包含以下功能：

- 編譯 Sass、Pug、CoffeeScript 等預處理器
- 壓縮 HTML、CSS、JavaScript 代碼以及各類圖檔
- 建立具有 Livereload 的 Web Server
- 一鍵將專案部屬到 GitHub Page
- other...

事實上，前面所提到的功能都是依靠 Gulp 的套件來完成，Gulp 更像是一個水管，當水龍頭打開時也就代表任務開始，而水管中流的水就是我們的原始檔，在水流經過管道的節點處，我們可以截獲水源並利用套件做一些處理，當水源從出口流出，同時也代表任務結束，如同上圖所示，讓我們先從安裝開始說起。

## Gulp 安裝

<div class="note warning">本篇教學都是採用 Gulp 4，關於 Gulp 4 與 Gulp 3 的差異，之後將會再做介紹</div>

Gulp 依賴 Node.js 環境，需先進行安裝。推薦使用 LTS 版本：

- LTS：長期維護版(較穩定)
- Current：目前最新版(較為不穩定)

安裝過程就不加以贅述，可使用以下指令查看是否正確安裝：

```bash
$ node -v
```

<img src="https://i.imgur.com/gVhAOaV.jpg" alt="node.js 查看是否正確安裝">

在 Gulp 3 版，需要再全域與區域環境分別安裝 Gulp，關於全域與區域環境的差別，可參考下面：

- Window：代表全域環境或是本機環境
- Local：代表區域環境或是專案環境

通常需要再全域環境連同安裝的套件，都是打算使用套件在全域環境內的相關指令，如 Gulp、Vue、ESLint 等等。

在 Gulp 4 版，一樣都需要分別在全域與區域環境安裝 Gulp，不同的地方在於，Gulp 4 版的全域套件名稱為 `gulp-cli`，相關指令如下：

Gulp 3 版本，全域安裝指令：

```bash
$ npm install gulp -g
```

Gulp 4 版本，全域安裝指令：

```bash
$ npm install gulp-cli -g
```

在這邊我們使用 Gulp 4 為主要開發版本，當 Gulp 在全域環境安裝完成時，可以使用以下指令來檢查：

```bash
$ gulp -v
```

<img src="https://i.imgur.com/zG66E9x.jpg" alt="Gulp 查看是否正確安裝">

從上面可以發現，我們全域環境的 CLI 工具已經安裝完成，版本為 2.2.0，但專案環境的 Gulp 卻是顯示 Unknown，因為我們尚未在專案環境安裝 Gulp，關於專案環境的安裝步驟，我們從初始化專案段落開始做介紹。

## Gulp 初始化專案

接下來我們進行初始化專案的動作，使用以下指令生成 `package.json`：

```bash
$ npm init
```

剛剛有提到專案環境尚未安裝 Gulp，使用以下指令安裝：

```bash
$ npm install gulp
```

在 npm 5 版本 `--save` 已成為預設指令，這也代表上面這道指令等同於下面這道指令：

```bash
$ npm install gulp --save
```

使用前面所提到的 `gulp -v` 檢查 Gulp 是否正確安裝，此時專案結構如下：

<img src="https://i.imgur.com/7q8lF8h.jpg" alt="Gulp 目前狀態">

觀察專案環境下是否成功安裝 Gulp，如果有版本號的顯示，就代表成功安裝囉(當前版本為 4.0.2)。接下來開始編寫第一個 Gulp Task 吧！

## 開發第一個 Gulp Task

接續上面範例，請先新增 `index.html` 與 `gulpfile.js` 這兩個檔案，此時專案結構如下：

```plain
gulp-demo/
│
└─── node_modules/
└─── index.html           # HTML 主檔案(複製用)
└─── gulpfile.js          # Gulp 配置檔案
└─── package-lock.json
└─── package.json         # 安裝 gulp
```

`gulpfile.js` 是 Gulp 專屬的配置檔案，所有的 Task 任務都是在這邊編寫完成，我們可以嘗試輸入以下內容到 `gulpfile.js` 檔案內：

```js
// gulpDemo/gulpfile.js

const gulp = require('gulp');

gulp.task('copyFile', () => {
  // 'copyFile' 是任務名稱，可自行定義
  return gulp.src('./index.html').pipe(gulp.dest('./public'));
});
```

在前面我們有講解到關於 Gulp 運行的概念，如果以上面程式做為參考，可做出以下統整：

- `gulp.task()`：創建名為 copyFile 的任務(水管名稱)
- `gulp.src()`：導入 index.html 這一個檔案(水的來源)
- `.pipe()`：以 `gulp.src()` 導入的檔案需做的處理(截獲水源所做的處理)
- `gulp.dest()`：檔案輸出的目錄(水該從何處流出)

此時輸入以下指令：

```bash
$ gulp copyFile
```

你會發現 Gulp 複製了 index.html 這一個檔案到新創建的 public 目錄裏頭，此時專案結構如下：

```plain
gulp-demo/
│
└─── node_modules/
└─── public/
│   │
│   └─── index.html       # HTML 副本 (完成編譯)
│
└─── index.html           # HTML 主檔案(等待編譯)
└─── gulpfile.js          # Gulp 配置檔案
└─── package-lock.json
└─── package.json         # 安裝 gulp
```

相信你們已經猜到上面這道指令的功能，在任何的 Gulp 任務名稱下，我們都可以使用 `gulp + 任務名稱` 執行指定的任務，就像剛剛這一個 copyFile 任務，我們使用 `gulp copyFile` 執行這一個任務，而這一個任務內容為，從`./index.html` 載入原始檔，當我們遇到第一個 `pipe()` 建構的節點，需要針對內容作處裡，剛好處理內容為使用 `gulp.dest()` 輸出到目錄，這也是 public/index.html 被創建得原因。

恭喜你已經開發了第一個 Gulp Task，同時也學會開發 Gulp 大部分應用的能力，剩下的應用我們等到載入套件章節再做說明，基本上整個 Gulp 的流程差不多就是這個樣子，後面的教學都會以結合套件的方式作介紹，如果你等不及了，可以直接觀看下一篇文章。
