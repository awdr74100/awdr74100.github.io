---
title: Gulp 前端自動化 - 從 Gulp 3 升級至 Gulp 4 完整文檔
description:
  [
    Gulp 4 已經推出有一段時間了，有礙於網上文章大多都是使用 Gulp 3 版本，對於學習 Gulp 4 的開發者來說較為不友善，此篇將完整解說 Gulp 3 與 Gulp 4 的差異，同時也會介紹 Gulp 4 新增的幾個好用語法，包含 gulp.series()、gulp.parallel() 等等，最後也會替這段時間介紹的 Gulp 套件做一個總整理，幫助讀者快速導入現有開發。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-28 20:29:52
---

## 前言

Gulp 4 已經推出有一段時間了，有礙於網上文章大多都是使用 Gulp 3 版本，對於學習 Gulp 4 的開發者來說較為不友善，此篇將完整解說 Gulp 3 與 Gulp 4 的差異，同時也會介紹 Gulp 4 新增的幾個好用語法，包含 gulp.series()、gulp.parallel() 等等，最後也會替這段時間介紹的 Gulp 套件做一個總整理，幫助讀者快速導入現有開發。

## 筆記重點

- 註冊 Task 任務的新方法

## 註冊 Task 任務的新方法

在 Gulp 3 版本，我們都是使用 `gulp.tsak()` API 去註冊任務，之後再使用 CLI 指令去執行任務，這個流程在 Gulp 4 版本一樣可以使用，但官方已不再推薦使用 `gulp.task()` API，在 Gulp 4 版本，取而代之的是使用 `function` 來建立任務，以及 `exports` 來導出任務，範例如下：

Gulp 3：

```js
const gulp = require('gulp');

gulp.task('build', (cb) => {
  // 任務內容
  cb();
});
```

Gulp 4：

```js
function compile_Sass(cb) {
  // 任務內容
  cb();
}

/* --- export.任務名稱 = 工作內容相關函式名稱 --- */
exports.build = compile_Sass;
```

使用 `function 工作內容相關函式名稱() {}` 即可建立任務，此時任務狀態為 Private，不會被 CLI 給偵測到，只能供內部使用，此時可以使用 `exports.工作名稱 = 工作內容相關函式名稱` 將任務導出，CLI 即可偵測到任務，狀態為 Public，最後執行 `gulp build` 指令執行任務，結果會與 Gulp 3 相同，讓我們來看其他例子：

**多任務執行**：

Gulp 3：

```js
const gulp = require('gulp');

gulp.task('scss', (cb) => {
  // 任務內容
  cb();
});

gulp.task('pug', (cb) => {
  // 任務內容
  cb();
});

gulp.task('build', gulp.series('scss', 'pug'));
```

Gulp 4：

```js
const gulp = require('gulp');

function scss(cb) {
  // 任務內容
  cb();
  console.log(4);
}

function pug(cb) {
  // 任務內容
  cb();
  console.log(4);
}

exports.build = gulp.series(scss, pug);
```

在 Gulp 3 我們都是使用字串形式的 `taskname` 作為參數執行任務，但在 Gulp 4 新增接受 `function` 作為參數執行任務，這也是之前文章提到可使用 CommonJS 模組化的關鍵，彈性與上個版本相比提高了不少，這確實是件好事，接著我們來說明之前提到的 Private Task 與 Public Task 究竟是什麼，請先使用 `gulp --tasks` 檢視所有任務：

Gulp 3：

<img src="https://i.imgur.com/DwSH0cc.jpg" alt="Gulp 3 所有任務">

Gulp 4：

<img src="https://i.imgur.com/8hnbIk4.jpg" alt="Gulp 4 所有任務">

在 Gulp 3 中，所有宣告的任務都屬於 Public Task，這樣子的界定方式容易造成結構混亂，而在 Gulp 4 中，分為 Private Task 和 Public Task 兩種狀態任務：

- 公開任務 (Public Task)：從 `gulpfile.js` 被導出 (exports)，可以通過 CLI 命令直接調用。例如：`exports.build = build`

- 私有任務 (Private Task)：被設計在內部使用，通常做為 series() 或 parallel() 組合的參數部分。例如：`exports.build = gulp.series(scss, pug)`

雖然與 Gulp 3 相比可能較為麻煩，但這樣子的界定方式能夠有效的避免結構混亂導致維護困難等問題。
