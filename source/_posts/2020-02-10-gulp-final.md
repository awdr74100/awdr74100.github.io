---
title: Gulp 前端自動化 - 基於 Gulp 4 的學習總結
description:
  [
    此篇將紀錄從接觸 Gulp 開始到後來能夠獨立開發專案所需 Gulp 環境的學習總結。途中也會把之前所遇到的坑做一個解決辦法補充，比如透過 Babel 編譯後，require 語法無法在 Borwser 運行等問題，以及使用 gulp-rename 套件後，該如何連同 HTML 相關的引用路徑做一個響應變動等等，最後也會提供我最為常用的 Gulp 開發環境，供有興趣的開發者快速導入現有專案。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js, w3HexSchool, 學習總結]
date: 2020-02-10 23:30:55
---

## 前言

此篇將紀錄從接觸 Gulp 開始到後來能夠獨立開發專案所需 Gulp 環境的學習總結。途中也會把之前所遇到的坑做一個解決辦法補充，比如透過 Babel 編譯後，require 語法無法在 Borwser 運行等問題，以及使用 gulp-rename 套件後，該如何連同 HTML 相關的引用路徑做一個響應變動等等，最後也會提供我最為常用的 Gulp 開發環境，供有興趣的開發者快速導入現有專案。

## 筆記重點

- 本系列文章
- 踩坑 - require 語法無法在 Browser 運行
- 踩坑 - HTML 引用路徑該如何做響應變動
- 總結 - Gulp 常用開發環境


## 本系列文章

- [Gulp 前端自動化 - 環境安裝與執行](https://awdr74100.github.io/2019-12-24-gulp-install/)
- [Gulp 前端自動化 - 編譯 Sass/SCSS](https://awdr74100.github.io/2019-12-31-gulp-gulpsass/)
- [Gulp 前端自動化 - 編譯 Pug](https://awdr74100.github.io/2020-01-02-gulp-gulppug/)
- [Gulp 前端自動化 - 使用 Babel 編譯 ES6](https://awdr74100.github.io/2020-01-08-gulp-gulpbabel/)
- [Gulp 前端自動化 - PostCSS 與 Autoprefixer](https://awdr74100.github.io/2020-01-12-gulp-gulppostcss/)
- [Gulp 前端自動化 - 生成 SourceMap 映射文件](https://awdr74100.github.io/2020-01-13-gulp-gulpsourcemaps/)
- [Gulp 前端自動化 - Browsersync 瀏覽器同步測試工具](https://awdr74100.github.io/2020-01-14-gulp-browsersync/)
- [Gulp 前端自動化 - 自動清除檔案與資料夾](https://awdr74100.github.io/2020-01-15-gulp-del/)
- [Gulp 前端自動化 - 壓縮 HTML、CSS、JavaScript 代碼](https://awdr74100.github.io/2020-01-17-gulp-gulphtmlmin-gulpcleancss-gulpuglify/)
- [Gulp 前端自動化 - 壓縮並優化圖片](https://awdr74100.github.io/2020-01-20-gulp-gulpimagemin/)
- [Gulp 前端自動化 - Minimist 命令行參數解析工具](https://awdr74100.github.io/2020-01-21-gulp-minimist/)
- [Gulp 前端自動化 - 替換 Stream 中的檔案名稱](https://awdr74100.github.io/2020-01-22-gulp-gulprename/)
- [Gulp 前端自動化 - 導入 Bootstrap 客製並編譯它](https://awdr74100.github.io/2020-01-24-gulp-includebootstrap/)
- [Gulp 前端自動化 - CommonJS 模組化設計](https://awdr74100.github.io/2020-01-26-gulp-modular/)
- [Gulp 前端自動化 - 升級至 Gulp 4 完整說明](https://awdr74100.github.io/2020-01-28-gulp-upgradegulp/)
- [Gulp 前端自動化 - 使用 ES6 Module 撰寫 Gulpfile](https://awdr74100.github.io/2020-02-03-gulp-gulpfilebabel/)
