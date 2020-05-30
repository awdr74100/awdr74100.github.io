---
title: Sass / SCSS 預處理器 - @mixin 建立混入與 @include 載入混入
description:
  [
    傳統在撰寫樣式表上很常發生重工的現象，雖然說作用的對象是不同的，這指 CSS 選擇器作用的目標，但無法否認確實降低了我們的開發效率，最理想的做法應該是將會重用的樣式包裝成一個物件，每當有相同樣式的撰寫需求時，只需要取用這一個物件即可達到目的，而 Sass / SCSS 正好有提供像是 @mixin 的語句，用法就類似於 Vue.js 的 mixin，只不過將其撰寫內容更改為樣式而已，最後使用 @include 載入 mixin 即可完成取用動作，藉此達到減少重工發生可能的目的。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-05-30 13:11:11
updated: 2020-05-30 13:11:11
---

## 前言

傳統在撰寫樣式表上很常發生重工的現象，雖然說作用的對象是不同的，這指 CSS 選擇器作用的目標，但無法否認確實降低了我們的開發效率，最理想的做法應該是將會重用的樣式包裝成一個物件，每當有相同樣式的撰寫需求時，只需要取用這一個物件即可達到目的，而 Sass / SCSS 正好有提供像是 @mixin 的語句，用法就類似於 Vue.js 的 mixin，只不過將其撰寫內容更改為樣式而已，最後使用 @include 載入 mixin 即可完成取用動作，藉此達到減少重工發生可能的目的。

## 筆記重點

- 建立混入與載入混入
- 建立混入並添加指定參數
- 建立混入並添加其餘參數
- 建立混入並設置參數預設值

## 建立混入與載入混入

要在 SCSS 使用 mixin 相當簡單，先使用 `@mixin` 指令將其建立，如下範例：

```scss
@mixin size {
  width: 100px;
  height: 100px;
}
```

這樣就建立好屬於我們自己的 mixin 了，接著要載入 mixin 可使用 `@include` 指令：

```scss
.box {
  @include size;
  background-color: red;
}
```

此時的編譯結果為：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
```

是不是相當容易？其實就只是單純把可能會重用的樣式利用 `@mixin` 將其包裝成 mixin，每當要取用時就使用 `@include` 將 mixin 的樣式附加在當前的區塊內，讓我們來看更實際的案例：

```scss
@mixin clearfix {
  &::after {
    display: block;
    clear: both;
    content: '';
  }
}

.list {
  @include clearfix;

  &__item {
    float: left;
  }
}
```

此時的編譯結果為：

```css
.list::after {
  display: block;
  clear: both;
  content: '';
}

.list__item {
  float: left;
}
```

以往我們都得在各別的 float 父元素添加 clearfix 樣式，現在使用 SCSS 中的 mixin 即可快速的產生目標樣式，你說方不方便？這邊在做個補充，`@mixin` 不只可以包裝 CSS 樣式，嚴格來講可以包裝 CSS 和 SCSS 中的任何有效內容

```scss
@mixin font-reset {
  font-family: Arial, Helvetica, sans-serif;
}

@mixin horizontal-center {
  margin-left: auto;
  margin-right: auto;
  @include font-reset;
}

.nav {
  @include horizontal-center;
}
```

此時的編譯結果為：

```css
.nav {
  margin-left: auto;
  margin-right: auto;
  font-family: Arial, Helvetica, sans-serif;
}
```

目前我們所建立的 mixin 都是屬於無參數 mixin，這樣可能會造成缺少靈活度的問題，下面介紹 mixin 加入參數的寫法。

## 建立混入時添加參數

事實上 `@mixin` 與 `@include` 的完整語法為：

```scss
@mixin size() {
  width: 100px;
  height: 100px;
}

.box {
  @include size();
}
```

與一般語言中的函式類似，函式名稱旁都有個小括號可帶入參數，這邊你可以直接把 mixin 理解為函式的宣告手法，但實際上 SCSS 有更為貼近的 `@function` 語法，這點之後再做討論，以下為 mixin 添加參數的範例：

```scss
@mixin size($num1, $num2) {
  width: $num1;
  height: $num2;
}

.box {
  @include size(200px, 200px);
}
```

此時的編譯結果為：

```css
.box {
  width: 200px;
  height: 200px;
}
```

這應該蠻好理解的，就只是將 mixin 內宣告的參數進行使用，最後 `@include(num1, num2)` 的結果就會是相對應處理後的結果，如同一般語言中函式的處理方式。

## 建立混入時設置參數預設值

如同 JavaScript 中的函式預設參數，SCSS 在 mixin 的建立中也可以設置預設值，如下範例：

```scss
@mixin size($num1: 150px, $num2: 150px) {
  width: $num1;
  height: $num2;
}

.box {
  @include size(120px);
}
```

這邊要注意 SCSS 預設參數的寫法，就如同變數宣告般是使用 `:` 賦予變數的預設值，並不是使用 `=` 符號，此時的編譯結果為：

```css
.box {
  width: 120px;
  height: 150px;
}
```

因為 `$num2` 參數未傳入故使用預設值，而 `$num1` 參數有傳入故覆蓋預設值，就如同 JavaScript 處理一般，這邊再補充一點：

```scss
@mixin size($num1: 150px, $num2: 150px) {
  width: $num1;
  height: $num2;
}

.box {
  @include size($num2: 300px);
}
```

此時的編譯結果為：

```css
.box {
  width: 150px;
  height: 300px;
}
```

是不是蠻新奇的？以往在 JavaScript 只能依照順序傳入對應的參數值，在 SCSS 可透過參數名稱傳入對應的參數值，這樣就不受順序的局限了，我自己是不常用此方法傳入參數，可能會照成可讀性降低的問題，各位可以再自行試試看。
