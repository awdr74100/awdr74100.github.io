---
title: Sass / SCSS 預處理器 - @import 載入模組與 Partials 建立部分模組
description:
  [
    模組化一直以來都是網頁端一項很重要的處理，有效的模組化可讓程式碼進一步提升其閱讀性，以讓後續維護人員更快速的進入狀況，且利用模組可重用的特性，我們也不需要撰寫這麼多的重複代碼，載入即完成，可說是大幅提高了其開發效率。在 CSS 可使用 @import 來拆分模組，而 SCSS 同樣也是使用 @import 來拆分模組，兩者不同的地方在於 CSS 的 @import 會產生額外的 request，而 SCSS 主要利用其特殊的 partial 檔案形成模組化的效果，再不產生額外 request 下達到模組化目的。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-06-05 14:28:02
updated: 2020-06-08 12:36:37
---

## 前言

模組化一直以來都是網頁端一項很重要的處理，有效的模組化可讓程式碼進一步提升其閱讀性，以讓後續維護人員更快速的進入狀況，且利用模組可重用的特性，我們也不需要撰寫這麼多的重複代碼，載入即完成，可說是大幅提高了其開發效率。在 CSS 可使用 @import 來拆分模組，而 SCSS 同樣也是使用 @import 來拆分模組，兩者不同的地方在於 CSS 的 @import 會產生額外的 request，而 SCSS 主要利用其特殊的 partial 檔案形成模組化的效果，再不產生額外 request 下達到模組化目的。

## 筆記重點

- 建立部分模組
- 載入模組

## 建立部分模組

所謂的部分模組其實就是指不會被編譯出實體檔案的模組，請先新增以下檔案：

```plain
project/
│
├─── scss/
│   │
│   ├─── a.scss
│   └─── b.scss
```

前面我們都是示範在單個 SCSS 檔案進行開發，並透過編譯器生成對應的 CSS 檔案，那如果是兩個 SCSS 檔案呢？此時的編譯結果為：

```diff
 project/
 │
+├─── css/
+│   │
+│   ├─── a.css
+│   └─── b.css
 │
 ├─── scss/
 │   │
 │   ├─── a.scss
 │   └─── b.scss
```

沒錯，這樣就會生成兩個 CSS 檔案，這應該是蠻好理解的，每一個 SCSS 檔案都是獨立的存在，編譯器會針對每個 SCSS 檔案生成對應的 CSS 檔案，如果你不想讓編譯器針對 SCSS 檔案生成實體檔案，可改使用 `_` 為開頭將其建立，如下所示：

```plain
project/
│
├─── scss/
│   │
│   ├─── a.scss
│   └─── _b.scss
```

在這邊我們將 `b.scss` 更改為 `_b.scss`，神奇的事情要發生了，直接進行編譯：

```diff
 project/
 │
+├─── css/
+│   │
+│   └─── a.css
 │
 ├─── scss/
 │   │
 │   └─── a.scss
 │   └─── b.scss
```

你會發現 `_b.scss` 沒有被編譯出實體檔案，在 SCSS 會稱其為 `partial`，以 `_` 開頭的 `.scss` 或 `.sass` 檔案都屬於 `partial` 類型檔案，用以告知編譯器不要嘗試自行編譯這些檔案。

你可能會問，這樣的用意是什麼？你可以把 `partial` 理解為只供予其他檔案 `@import` 的模組，如果單獨存在，本身是沒有任何意義的，通常都是與 `@import` 搭配居多，讓我們繼續看下去。

## 載入模組

前面已經介紹 `partial` 的作用了，接著讓我們正式進入到 SCSS 模組化的章節，先建立以下結構：

```plain
project/
│
├─── scss/
│   │
│   └─── helpers/
│       │
│       ├─── _mixins.scss
│       └─── _variables.scss
│   │
│   └─── all.scss
```

一般來說我們都會把 SCSS 的模組彙整到 `all.scss` 檔案中，而模組的命名必定會以 `_` 為開頭 ，這點在前面已經有解釋過，最後的編譯結果就只會生成 `all.scss` 對應的 `all.css` 檔案，接著在每個模組檔案撰寫其對應內容：

`./scss/helpers/_variables.scss` 檔案內容：

```scss
$theme-color: (
  primary: blue,
  success: green,
);
```

`./scss/helpers/_mixins.scss` 檔案內容：

```scss
@mixin bg-invert($color) {
  background-color: invert($color);
}
```

`./scss/all.scss` 檔案內容：

```scss
@import './helpers/variables';
@import './helpers/mixins';

// 測試輸出
@each $key, $value in $theme-color {
  .text-#{$key} {
    color: $value;
    @include bg-invert($value);
  }
}
```

`@import` 語句可用來載入其他模組，並且不需要撰寫 `_` 與 `.scss` 字樣，SCSS 能夠自動辨認其模組，上面範例就等同於將全部代碼撰寫在 `all.scss` 中，如下所示：

```scss
$theme-color: (
  primary: blue,
  success: green,
);

@mixin bg-invert($color) {
  background-color: invert($color);
}

// 測試輸出
@each $key, $value in $theme-color {
  .text-#{$key} {
    color: $value;
    @include bg-invert($value);
  }
}
```

這邊你應該就能理解何謂 SCSS 模組化了，其實到頭來我們都是在呼叫 `@import` 的對象 `all.scss` 做撰寫，只不過將其撰寫內容拆分到被呼叫的 `@import` 對象而已，這也是與傳統 CSS 模組化最大的不同，SCSS 的模組化是發生在未編譯之前，這時你可以任意的拆分模組，反正不影響編譯生成的 CSS 檔案數量，而 CSS 的模組化是發生在 Browser 讀取到其 `@import` 字樣，進而發送 HTTP Request 時，這也是為什麼一般都推薦使用 SCSS 來完成模組化目的。

這邊還有一點要注意的是，通常 `all.scss` 不應該存在任何 `@import` 以外的代碼，進而影響檔案的可讀性，此時我們可針對以上做個改寫：

新增 `./scss/helpers/_text.scss`：

```scss
@each $key, $value in $theme-color {
  .text-#{$key} {
    color: $value;
    @include bg-invert($value);
  }
}
```

在 `./scss/all.scss` 將其載入：

```scss
@import './helpers/variables';
@import './helpers/mixins';
@import './helpers/text';
```

這樣是不是整潔許多？在 `@import` 時需要注意其依賴性，只需要保持一個原則就是 SCSS 是由上到下進行編譯，你總不可能把 `_variables.scss` 放在 `_text.scss` 下面吧？這樣肯定會發生 `Undefined` 的錯誤。
