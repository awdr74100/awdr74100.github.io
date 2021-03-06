---
title: Sass / SCSS 預處理器 - @entend 繼承樣式與 Placeholder 佔位符選擇器
description:
  [
    在前面我們有提到可使用 @mixin 將發生重用的樣式給包裝起來，進而減少重複撰寫樣式的時間，但在這邊有一個問題是，此做法會造成編譯後的 CSS 發生樣式大量重複的問題，搞得檔案異常肥大，在較為嚴苛的環境下，此問題是不被允許的，建議的作法是使用 @entend 並搭配 placeholder 選擇器將重用樣式給綑綁起來，@extend 就類似於 @mixin，不同的地方在於 @extend 會將目標對象進行合併而不是載入，而 placeholder 選擇器主要用來創建重用對象，在不被編譯的狀態下給予 @extend 繼承用。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-06-03 00:00:55
updated: 2020-06-04 23:49:09
---

## 前言

在前面我們有提到可使用 @mixin 將發生重用的樣式給包裝起來，進而減少重複撰寫樣式的時間，但在這邊有一個問題是，此做法會造成編譯後的 CSS 發生樣式大量重複的問題，搞得檔案異常肥大，在較為嚴苛的環境下，此問題是不被允許的，建議的作法是使用 @entend 並搭配 placeholder 選擇器將重用樣式給綑綁起來，@extend 就類似於 @mixin，不同的地方在於 @extend 會將目標對象進行合併而不是載入，而 placeholder 選擇器主要用來創建重用對象，在不被編譯的狀態下給予 @extend 繼承用。

## 筆記重點

- 繼承樣式
- 佔位符選擇器
- @extend 與 @mixin 使用時機和差異

## 繼承樣式

讓我們先來回顧 `@mixin` 是怎麼解決樣式重用問題的：

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  @include flex-center;
  background-color: red;
}

.section {
  @include flex-center;
  background-color: blue;
}

.footer {
  @include flex-center;
  background-color: green;
}
```

`@mixin` 是我最常使用的 SCSS 功能，只需要在 `@include` 之前撰寫一次會發生重用的樣式，後續就都利用 `@include` 載入其樣式即可，此時的編譯結果為：

```css
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
}

.section {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: green;
}
```

雖然說編譯後的檔案我們通常不會有太多的關注，但在某些情況下，我們確實需要做些改善以符合當前專案的規範，比如說樣式表的檔案大小，從上面結果你會發現 `@mixin` 形成了許多重複樣式，也因為這些重複樣式造成樣式表異常的肥大，建議的做法是將發生重用的樣式以合併的方式進行處理，如下所示：

<!-- prettier-ignore-start -->
```css
.header, .section, .footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  background-color: red;
}

.section {
  background-color: blue;
}

.footer {
  background-color: green;
}
```
<!-- prettier-ignore-end -->

合併樣式的目的在於保持代碼的精簡性，以不發生重複代碼為原則，依然保持樣式作用於對象，為了滿足合併樣式的目的，我們可改使用 `@extend` 方法，直接來看範例：

```scss
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  @extend .flex-center;
  background-color: red;
}

.section {
  @extend .flex-center;
  background-color: blue;
}

.footer {
  @extend .flex-center;
  background-color: green;
}
```

`@extend` 的目的在於繼承其指定樣式，呼叫 `@extend` 的對象會被合併到指定的對象上，相較於 `@mixin` 的處理方式，此方法既能減少重複樣式的撰寫也能達到編譯後 CSS 精簡化的目的，此時的編譯結果為：

<!-- prettier-ignore-start -->
```css
.flex-center, .header, .section, .footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  background-color: red;
}

.section {
  background-color: blue;
}

.footer {
  background-color: green;
}
```
<!-- prettier-ignore-end -->

這不就是我們要的結果嗎？相關的樣式都被合併到了指定樣式上，讓我們再來看個範例：

```scss
.font-base {
  color: #1d1d1d;
  padding: 15px 0px;
}

.header {
  background-color: red;
  h1 {
    font-size: 1.5em;
    @extend .font-base;
  }
}

.footer {
  background-color: green;
  h1 {
    font-size: 1.25em;
    @extend .font-base;
  }
}
```

如同我們前面所說，呼叫 `@extend` 的對象會被合併到指定對象上，這邊所指的對象為 `.header h1` 與 `.footer h1`，並不是指單純的 `h1` 對象，最後的編譯結果為：

<!-- prettier-ignore-start -->

```css
.font-base, .header h1, .footer h1 {
  color: #1d1d1d;
  padding: 15px 0px;
}

.header {
  background-color: red;
}

.header h1 {
  font-size: 1.5em;
}

.footer {
  background-color: green;
}

.footer h1 {
  font-size: 1.25em;
}
```
<!-- prettier-ignore-end -->

## 佔位符選擇器

在前面範例中，我們必定是要宣告個對象用以讓其他對象 `@extend`，這不就會導致產生無意義的樣式對象了嗎？如之前的 `.flex-center`、`.font-base` 等，如果繼承的對象沒有任何作用，我們可改使用 SCSS 獨特的佔位符選擇器將其宣告，這樣就不會有實體的樣式對象了，如下範例：

```scss
%flex-center {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
```

佔位符選擇器顧名思義就是使用 `%` 符號將其宣告，與傳統 `class`、`id` 選擇器較不同的地方在於它不會產生實體的對象，你可以嘗試編譯上面範例，最後並不會有任何的樣式被編譯出來，利用此特性我們可針對之前範例做個改寫：

```scss
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  @extend %flex-center;
  background-color: red;
}

.section {
  @extend %flex-center;
  background-color: blue;
}

.footer {
  @extend %flex-center;
  background-color: green;
}
```

將原本利用 `class` 選擇器宣告的對象更改為 `%` 宣告，同時 `@extend` 此對象，最後的編譯結果為：

<!-- prettier-ignore-start -->
```css
.header, .section, .footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  background-color: red;
}

.section {
  background-color: blue;
}

.footer {
  background-color: green;
}
```
<!-- prettier-ignore-end -->

大功告成！編譯結果與當初設定目標一模一樣，佔位符選擇器的應用範圍可能也只有供予 `@extend` 繼承用，畢竟它不會被實體編譯出來，在多的延伸也沒有其意義。

## @extend 與 @mixin 使用時機和差異

如果你對 `@extend` 與 `@mixin` 的使用時機和差異感到困惑，可以從以下兩點去做思考：

- 是否需要傳遞參數？
- 是否在意樣式表大小？

傳遞參數這點沒啥好說的，你只能使用 `@mixin` 來完成任務，因為 `@extend` 是無法傳遞任何參數的，而 `@mixin` 與 `@function` 相同，都可傳入任意的參數做使用，可參考以下範例：

```scss
@mixin size($num1, $num2) {
  width: $num1;
  height: $num2;
}

.box {
  @include size(200px, 200px);
}
```

`@extend` 自然是無法完成上面任務的，畢竟它沒辦法傳遞任何參數，還有另外一個判斷的依據為是否在意樣式表大小，可參考以下範例：

```scss
%col {
  position: relative;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}

@for $var from 1 through 12 {
  .col-#{$var} {
    @extend %col;
  }
}
```

上面使用了 `@extend` 來完成任務，將所有相關的樣式進行合併以減少樣式表大小，同樣道理，你也可以使用 `@mixin` 來完成，參考以下範例：

```scss
@mixin col {
  position: relative;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}

@for $var from 1 through 12 {
  .col-#{$var} {
    @include col;
  }
}
```

此時的編譯結果為：

```css
.col-1 {
  position: relative;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}

/* 省略 .col-2 ~ .col-11 */

.col-12 {
  position: relative;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}
```

發現問題了嗎？明明所有對象都是套用相同的樣式，使用 `@mixin` 就硬生生的生成了全部實體樣式，像在這種情況就推薦使用 `@extend` 來完成，其編譯結果為：

<!-- prettier-ignore-start -->
```css
.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12 {
  position: relative;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}
```
<!-- prettier-ignore-end -->

這樣不是好多了嗎？所有對象都被合併到了 `%col` 對象內，如果你並不在意樣式表的大小，大可使用 `@mixin` 來完成任務，但我個人推薦使用 `@extend` 就是了。
