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
- 添加並傳入指定參數
- 添加並傳入其餘參數
- 添加並傳入可選參數
- 添加並傳入關鍵字參數
- 結合 @content 構建 RWD 混入

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

以往我們都得在各別的 float 父元素添加 clearfix 樣式，現在使用 SCSS 中的 mixin 即可快速的產生清除樣式，是不是很方便？這邊在做個補充，**mixin 不只可以包裝 CSS 樣式，嚴格來講可以包裝 CSS 和 SCSS 中的任何有效內容**，可以參考下面範例：

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

目前我們所建立的 mixin 都是屬於無參數 mixin，這樣可能會造成缺乏靈活度的問題，下面介紹 mixin 加入參數的寫法。

## 添加並傳入指定參數

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

## 添加並傳入其餘參數

每當我們要傳入參數時，mixin 就必須要有對應的變數已接收此參數，這樣不是很麻煩嗎？有沒有辦法是直接在 mixin 定義一個能接收全部參數的變數呢？答案是有的，原理如同 JavaScript 中的 [其餘參數](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/rest_parameters)，直接來看範例：

```scss
@mixin size($num1, $num...) {
  width: $num1;
  height: inspect($num);
}

.box {
  @include size(100, 200, 300);
}
```

除了指定參數 `$num1` 所接受到的數值外，其餘都屬於 `$num` 的部分，所得到的資料型態會以 List 表示，結果如下：

```scss
.box {
  width: 100;
  height: 200, 300;
}
```

上面主要為示範才會使用 `inspect` 函式，正確的做法應該是使用 `nth` 取出 List 對應的值才對：

```scss
@mixin size($num1, $num...) {
  width: $num1;
  height: nth($num, 1);
  font-weight: nth($num, 2);
}

.box {
  @include size(100, 200, 300);
}
```

此時你可能會覺得與 JavaScript 將 `...` 放在前面有所出入，SCSS 是將 `...` 放在後面，剛開始我也不太習慣時常打錯，後來習慣後就沒這個問題了，我想可能是要區別兩者的獨特性吧？

## 添加並傳入可選參數

所謂的可選參數其實就是預設參數的意思，代表 `@include` 不傳入參數也不會跳出錯誤，因為 `@mixin` 會將變數的預設值做取用已順利完成操作，直接來看例子：

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

由於我們只有傳入 `$num1` 的參數值，故 `$num2` 就會使用預設的參數值做處理，最後就形成了這樣子的結果。

## 添加並傳入關鍵字參數

如果硬要說 SCSS 的 mixin 與 JavaScript 的函式有什麼差別，可能就只有傳入關鍵字參數的功能了，如下範例：

```scss
@mixin size($num1: 150px, $num2: 150px) {
  width: $num1;
  height: $num2;
}

.box {
  @include size($num2: 300px);
}
```

是不是蠻新奇的？以往參數都必須依照順序傳入以保證接收到預期的參數值，在 SCSS 你可以不必這樣做，直接以關鍵字方式傳入參數值即可，這邊的關鍵字就是指要傳入參數值的參數名稱，此時的編譯結果為：

```css
.box {
  width: 150px;
  height: 300px;
}
```

雖然說方便度提高了不少，但我認為這樣子的寫法可能存在可讀性低落的問題，你沒辦法立即得知那些參數未傳入那些參數已傳入，最後可能就會跳出錯誤。

## 結合 @content 構建 RWD 混入

如果你認為前面的 mixin 不夠吸引你使用它，那我保證接下來的範例一定會讓你愛上它，直接來看範例：
