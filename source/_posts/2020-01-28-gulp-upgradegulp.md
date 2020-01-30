---
title: Gulp 前端自動化 - 升級至 Gulp 4 完整說明
description:
  [
    Gulp 4 已經推出有一段時間了，有礙於網上文章大多都是使用 Gulp 3 版本，對於學習 Gulp 4 的開發者來說較為不友善，此篇將完整解說 Gulp 3 與 Gulp 4 的差異，包含 Gulp 4 新增的幾個好用語法，比如 gulp.series()、gulp.parallel() 等等，以及 task() API 已不被官方推薦使用，取而代之的 function task 究竟如何使用，全部內容都將完整說明。,
  ]
categories: [Gulp]
tags: [Gulp 4, Node.js]
date: 2020-01-28 20:29:52
---

## 前言

Gulp 4 已經推出有一段時間了，有礙於網上文章大多都是使用 Gulp 3 版本，對於學習 Gulp 4 的開發者來說較為不友善，此篇將完整解說 Gulp 3 與 Gulp 4 的差異，包含 Gulp 4 新增的幾個好用語法，比如 gulp.series()、gulp.parallel() 等等，以及 task() API 已不被官方推薦使用，取而代之的 function task 究竟如何使用，全部內容都將完整說明。

## 筆記重點

- 註冊 Task 任務的新方法
- 任務依賴和執行函式
- 非同步完成
- Watch API 可監聽全局事件

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

## 任務依賴和執行函式

以往 Gulp 都是採用任務依賴的方式執行任務，如下範例：

```js
gulp.task('compile', ['jade', 'sass', 'watch'], () => {
  // 任務內容
});
```

此時執行 `gulp compile` 即可非同步執行所有任務，亦即**並行執行** `jade`、`sass`、`watch` 任務，當依賴任務執行完成，最後才會執行自身 `compile` 的任務，這是比較簡單的情況，假設我們在執行 `compile` 任務前，需要清除先前編譯的資料呢？寫法可能如下：

```js
gulp.task('compile', ['clean', 'jade', 'sass', 'watch'], () => {
  // 任務內容
});
```

上面這個寫法是錯的，前面有提到 Gulp 3 的 Array 寫法是以**並行執行**所有任務，也就代表當我們執行 `jade` 或 `sass` 任務時，編譯出來的檔案可能會被 `clean` 任務給直接清除掉，正確的流程應該為執行 `compile` 任務前，必須先執行 `clean` 任務且已執行完成，亦即**串行執行**，這時可使用 [run-sequence](https://www.npmjs.com/package/run-sequence) 套件來改寫任務：

```js
gulp.task('compile', () => {
  runSequence('clean', ['jade', 'sass', 'watch']);
});
```

run-sequence 套件可幫助我們並行或串行執行任務，以上面這個範例來說，當我們執行 `gulp compile` 指令時，會先觸發 `clean` 任務，當任務完成時，才會並行觸發 `jade`、`sass`、`watch` 任務，相同的概念可無限延伸，可能會有人問，會不會有點麻煩？還需要載入套件才可以使用？沒錯！但這是 Gulp 3 的說法，Gulp 4 新增了兩個革命性的 API 以解決此問題，讓我們先來看範例：

<!-- prettier-ignore-start -->
```js
gulp.task(
  "compile",
  gulp.series("clean", gulp.parallel("jade", "sass", "watch"))
);
```
<!-- prettier-ignore-end -->

**Gulp 4 棄用了任務依賴改而使用執行函式來操作任務**，也就代表如果你在 Gulp 4 版本中使用任務依賴的寫法(如同之前範例)，會引發錯誤，取而代之的是使用 `gulp.series()` 與 `gulp.parallel` API 來操作任務，兩者差別如下：

- `gulp.series()`：用於串行(同步)任務執行，可接受 `taskname` 或 `function` 作為任務執行參數。

- `gulp.parallel`：用於並行(非同步)任務執行，可接受 `taskname` 或 `function` 作為任務執行參數。

當初就是因為 Gulp 官方也認為依靠套件來處理串行、並行任務較不方便，進而改寫 Gulp 並推出這兩個 API，實際使用下來，我認為可以完全取代 Gulp 3 的任務依賴寫法，超好用的！舊有開發者也可以無痛上手，你可以幫她想像成 runSequence 套件的另一種寫法，不過不需要載入任何套件，此為 Gulp 4 內建 API，讓我們來看其他範例：

```js
// 只載入 Gulp 相關 API
const { series, parallel } = require('gulp');

const clean = function(cb) {
  // 任務內容
  cb();
};

const css = series(clean, function(cb) {
  // 任務內容
  cb();
});

const javascript = series(clean, function(cb) {
  // 任務內容
  cb();
});

/* --- 導出任務 --- */
exports.build = parallel(css, javascript);
```

上面這個範例存在一個 Bug，那就是 clean 任務在並行執行 `css` 與 `javascript` 任務時，被執行了兩次，這樣子的作法可能會導致無法預期的結果，在 Gulp 4 中，以先前介紹的 `function Task` 來說明，**建議一個 function 只完成自己的任務內容，最後在導出任務**，此時寫法可改為：

```js
// 只載入 Gulp 相關 API
const { series, parallel } = require('gulp');

function clean(cb) {
  // 任務內容
  cb();
}

function css(cb) {
  // 任務內容
  cb();
}

function javascript(cb) {
  // 任務內容
  cb();
}

/* --- 導出任務 --- */
exports.build = series(clean, parallel(css, javascript));
```

現在 `clean` 任務只會被執行一次，結構也變得更加明確，這才是 Gulp 的正確寫法與流程。

## 非同步完成

在 Gulp 4 版本，非同步操作(並行執行)完成後須執行一個 callback 函式用以通知 Gulp 這個任務已經完成，讓我們直接來看範例：

```js
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () => {
  gulp
    .src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});
```

上面是一個基本的編譯 SCSS 範例，此時執行 `gulp sass` 指令，會跳出如下圖錯誤：

<img src="https://i.imgur.com/eiTqPEO.jpg" alt="Gulp 3 所有任務">

這個問題是發生在 Gulp 無法明確知道 `sass` 任務何時結束進而引發的錯誤；在 Gulp 3 版本，此問題將被忽略，但在 Gulp 4 版本，更加的嚴格，你必須明確告知任務已經完成，好讓 Gulp 正常的處理流程，有以下幾種方法可以幫助我們告知任務已經完成：

- 返回一個 Stream：

```js
gulp.task('sass', function() {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});
```

- 兌現 Promise：

```js
gulp.task('sass', function() {
  return Promise.resolve(
    gulp
      .src('./src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css'))
  );
});
```

- 調用 callback：

```js
gulp.task('sass', function(cb) {
  gulp
    .src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
  cb();
});
```

- 返回 RxJS 觀察對象：

```JS
const Observable = require("rx").Observable;

gulp.task("sass", function() {
  return Observable.return(
    gulp
      .src("./src/scss/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest("./dist/css"))
  );
});
```

由上面幾種方法來說，調用 callback 看起來更加容易，這也是我一般開發較常使用的方法。

## Watch API 可監聽全局事件

Gulp 本身內建的監控檔案變動 API 相信大家都有使用過，基本上也算是開發者使用 Gulp 必備的功能，在 Gulp 3 版本，我們可使用 `gulp.watch()` 與 `gulp.watch().on()` 函式監控檔案變動，如下範例：

```js
gulp.task('watch', () => {
  gulp.watch('./src/scss/*.scss', gulp.series('sass')).on('change', (event) => {
    console.log(event);
    console.log(path);
    console.log(stats);
  });
});
```

基本上 Gulp 3 版本的 `gulp.watch()` 已經可滿足大部分需求，一般開發足以應付，硬要挑剔的話，可能只剩無法全局監聽檔案可說嘴，但這的確是個問題，有時候我們需要知道更動檔案的相關資訊，比如說：新增、刪除事件等等，對於 Gulp 3 版本來講，是無法提供新增或刪除檔案等相關資料的，一部分人可能會去使用 `gulp-watch` 套件，這的確也是個辦法，但與之前提到的 `run-sequence` 套件來說，這些基本的功能也需要依靠套件去完成，會不會有點麻煩？到了 Gulp 4 版本，改寫了內部 `gulp.watch()` 的運作邏輯，新增了幾個參數可以使用，讓我們直接看範例：

<!-- prettier-ignore-start -->
```js
gulp.task("watch", () => {
  gulp
    .watch("./src/scss/*.scss", gulp.series("sass"))
    .on("all", (event, path, stats) => {
      console.log(event);
    });
});
```
<!-- prettier-ignore-end -->

使用 function task：

<!-- prettier-ignore-start -->
```js
exports.watch = () => {
  gulp
    .watch("./src/scss/*.scss", gulp.series("sass"))
    .on("all", (event, path, stats) => {
      console.log(event);
      console.log(path);
      console.log(stats);
    });
};
```
<!-- prettier-ignore-end -->

Gulp 4 版本的 `gulp.watch()` API 可使用 `all` 作為事件名稱，代表著任何事件都將被觸發，包含新增、刪除等等，以及新增了 `path` 與 `stats` 參數，訪問參數即可得知更動檔案的相關資訊，簡單來講就是小幅加強了 `gulp.watch()` 函式，也不需要再使用其他套件，內建的 API 足以勝任大部分工作。
