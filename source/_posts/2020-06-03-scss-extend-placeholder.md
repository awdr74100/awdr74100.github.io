---
title: Sass / SCSS 預處理器 - @entend 繼承樣式與 Placeholder 佔位符選擇器
description:
  [
    在前面我們有提到可使用 @mixin 將發生重用的樣式給包裝起來，進而減少重複撰寫樣式的時間，但在這邊有一個問題是，此做法會造成編譯後的 CSS 發生樣式大量重複的問題，搞得檔案異常肥大，在較為嚴苛的環境下，此問題是不被允許的，建議的作法是使用 @entend 並搭配 placeholder 選擇器將重用樣式給綑綁起來，@extend 就類似於 @mixin，不同的地方在於 @extend 會將目標對象進行合併而不是載入，而 placeholder 選擇器主要用來創建重用對象，在不被編譯的狀態下給予 @extend 繼承用。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-06-03 00:00:55
updated: 2020-06-03 00:00:55
---

## 前言

在前面我們有提到可使用 @mixin 將發生重用的樣式給包裝起來，進而減少重複撰寫樣式的時間，但在這邊有一個問題是，此做法會造成編譯後的 CSS 發生樣式大量重複的問題，搞得檔案異常肥大，在較為嚴苛的環境下，此問題是不被允許的，建議的作法是使用 @entend 並搭配 placeholder 選擇器將重用樣式給綑綁起來，@extend 就類似於 @mixin，不同的地方在於 @extend 會將目標對象進行合併而不是載入，而 placeholder 選擇器主要用來創建重用對象，在不被編譯的狀態下給予 @extend 繼承用。

## 筆記重點

- 繼承樣式
- 佔位符選擇器

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

雖然說編譯後的檔案我們通常不會有太多的關注，但在某些情況下，我們確實需要做些改善以符合當前專案的規範，比如說樣式表的檔案大小，從上面結果你會發現 `@mixin` 形成了許多重複樣式，也因為這些重複樣式造成樣式表異常的肥大，建議的做法是將發生重用的樣式以合併的方式存在，如下所示：

<!-- prettier-ignore-start -->
```scss
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

合併樣式的目的在於保持代碼的精簡性，以不發生重複代碼為原則，依然保持樣式作用於對象，為了滿足合併樣式的目的，此時就是 `@extend` 出馬的時候了，直接來看範例：

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
