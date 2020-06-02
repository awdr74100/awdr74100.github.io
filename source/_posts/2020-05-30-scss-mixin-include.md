---
title: Sass / SCSS 預處理器 - @mixin 建立混入與 @include 載入混入
description:
  [
    傳統在撰寫樣式表上很常發生重工的現象，雖然說作用的對象是不同的，這指 CSS 選擇器作用的目標，但無法否認確實降低了我們的開發效率，最理想的做法應該是將會重用的樣式包裝成一個物件，每當有相同樣式的撰寫需求時，只需要取用這一個物件即可達到目的，而 Sass / SCSS 正好有提供像是 @mixin 的語句，用法就類似於 Vue.js 的 mixin，只不過將其撰寫內容更改為樣式而已，最後使用 @include 載入 mixin 即可完成取用動作，藉此達到減少重工發生可能的目的。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-05-30 13:11:11
updated: 2020-05-31 16:20:36
---

## 前言

傳統在撰寫樣式表上很常發生重工的現象，雖然說作用的對象是不同的，這指 CSS 選擇器作用的目標，但無法否認確實降低了我們的開發效率，最理想的做法應該是將會重用的樣式包裝成一個物件，每當有相同樣式的撰寫需求時，只需要取用這一個物件即可達到目的，而 Sass / SCSS 正好有提供像是 @mixin 的語句，用法就類似於 Vue.js 的 mixin，只不過將其撰寫內容更改為樣式而已，最後使用 @include 載入 mixin 即可完成取用動作，藉此達到減少重工發生可能的目的。

## 筆記重點

- 建立混入與載入混入
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

以往我們都得在各別的 float 父元素添加 clearfix 樣式，現在使用 SCSS 中的 mixin 即可快速的產生清除樣式，這邊做個強調，**mixin 不只可以包裝 CSS 樣式，嚴格來講可以包裝 CSS 和 SCSS 中的任何有效內容**，比如說 mixin 內使用 `@include` 載入另個 mixin：

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

上面所建立的 `@mixin` 都是屬於無參數型的 mixin，我們可透過大括號將參數傳遞進去使之成為參數型 `@mixin`，先將上面範例做一個改寫：

```scss
@mixin size() {
  width: 100px;
  height: 100px;
}

.box {
  @include size();
}
```

與一般語言中的函式類似，函式名稱旁都有個小括號可帶入參數，這邊你可以先把 mixin 理解為一般語言中的函式，但不要直接把他認知成函式，雖然這樣講有點矛盾，因為 SCSS 確實還有另個 `@function` 方法更貼近於函式，這點以後再做討論，在 `@mixin` 新增接收參數的變數並傳入參數：

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

這應該蠻好理解的，就只是將 mixin 內宣告的變數進行使用，最後 `@include(num1, num2)` 的結果就會是相對應處理後的結果，如同一般語言中函式的處理方式。

## 添加並傳入其餘參數

每當我們要傳入參數時，mixin 就必須要有對應的變數已接收此參數，這樣不是很麻煩嗎？有沒有辦法是直接在 mixin 定義一個能接收全部參數的變數呢？答案是有的，概念類似於 JavaScript 中的 [Rest parameter](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/rest_parameters)，直接來看範例：

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

你可能會覺得與 JavaScript 將 `...` 放在變數前面有所出入，SCSS 是將 `...` 放在變數後面，剛開始我也不太習慣時常打錯，後來習慣後就沒這個問題了，我想可能是要區別兩者的獨特性吧？

## 添加並傳入可選參數

所謂的可選參數其實就是預設參數的意思，代表應該被接收的變數就算不傳入還是可直接向預設參數取值進而避免處理時發生錯誤，直接來看例子：

```scss
@mixin size($num1: 150px, $num2: 150px) {
  width: $num1;
  height: $num2;
}

.box {
  @include size(120px);
}
```

SCSS 預設參數賦值是使用 `:` 關鍵字，就如同宣告變數一般，與一般語言中使用 `=` 關鍵字有所不同，這邊要多加留意，以下為編譯結果：

```css
.box {
  width: 120px;
  height: 150px;
}
```

由於我們只有傳入 `$num1` 參數的內容，故 `$num2` 就會使用預設的參數值做處理，而 `$num1` 則會覆蓋預設值以傳入的數值為目標完成操作。

## 添加並傳入關鍵字參數

除了基本依造順序將參數傳遞進去以外，我們也可透過關鍵字，這指接收參數的變數名稱，將參數傳遞給指定的變數，如下範例：

```scss
@mixin size($num1: 150px, $num2: 150px) {
  width: $num1;
  height: $num2;
}

.box {
  @include size($num2: 300px);
}
```

是不是蠻新奇的？以往參數都必須依照順序傳入以保證對象如預期被接收，在 SCSS 你可以不必這樣做，直接以關鍵字方式傳入參數值即可，此時的編譯結果為：

```css
.box {
  width: 150px;
  height: 300px;
}
```

雖然說方便度提高了不少，但我認為這樣子的寫法可能存在可讀性低落的問題，你沒辦法立即得知那些參數未傳入那些參數已傳入，最後可能就會跳出錯誤。

## 結合 @content 構建 RWD 混入

`@mixin` 最常被用來包裝 RWD (Responsive Web Design) 的 `@media` 以解決 media queries 重複撰寫問題，先來看傳統上我們是怎麼撰寫 RWD 的：

```scss
.col-md-4,
.col-md-6 {
  flex: 0 0 100%;
}

@media screen and (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 (100% * 4/12);
  }
  .col-md-6 {
    flex: 0 0 (100% * 6/12);
  }
}
```

我習慣將 RWD 代碼撰寫在樣式表的尾端以方便做管理，但這有一個問題是，假如我們的代碼量很龐大呢？豈不是要在每次撰寫時都得滑個老半天？且之前就有提到 SCSS 主要解決我們重工的問題，如果其他的 [Partials](https://sass-lang.com/guide#topic-4) 也要使用的話不就又造成重工的問題了嗎？這時我們可利用前面學到的 `@mixin` 將 `@media` 包裝起來：

```scss
@mixin pad($col) {
  @media screen and (min-width: 768px) {
    flex: 0 0 (100% * $col/12);
  }
}

.col-md-4 {
  flex: 0 0 100%;
  @include pad(4);
}

.col-md-6 {
  flex: 0 0 100%;
  @include pad(6);
}
```

此時的編譯結果為：

```css
.col-md-4 {
  flex: 0 0 100%;
}

@media screen and (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 33.33333%;
  }
}

.col-md-6 {
  flex: 0 0 100%;
}

@media screen and (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 50%;
  }
}
```

這邊你可能會對 `@mixin` 與 `@media` 的結合感到困惑，為何 `@media` 會自動跳脫到外層呢？當時的我也感到困惑，後來看到官方的 [CSS At-Rules](https://sass-lang.com/documentation/at-rules/css) 發現這其實是 SCSS 其中一種處理方式，你可以嘗試編譯下面範例看看：

```scss
.print-only {
  display: none;

  @media print {
    display: block;
  }
}
```

**編譯器對 @media 的巢狀結構處理是將其跳脫到外層去**，畢竟沒有人會將 CSS 寫做 `.print-only @media`，這才導致這樣子的結果，這也是前面 RWD 能夠結合 `@mixin` 的關鍵，是不是覺得這樣子清楚許多？但在這邊還有一個小問題是，目前都是依靠參數去做響應變化，參數一多容易造成可讀性低落問題，比較好的做法是使用 `@content` 才對：

```scss
@mixin pad {
  @media screen and (min-width: 768px) {
    @content;
  }
}

.col-md-4 {
  flex: 0 0 100%;
  @include pad {
    flex: 0 0 (100% * 4/12);
  }
}

.col-md-6 {
  flex: 0 0 100%;
  @include pad {
    flex: 0 0 (100% * 6/12);
  }
}
```

此時的編譯結果為：

```css
.col-md-4 {
  flex: 0 0 100%;
}

@media screen and (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 33.33333%;
  }
}

.col-md-6 {
  flex: 0 0 100%;
}

@media screen and (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 50%;
  }
}
```

與前面使用參數傳遞的結果相同，但靈活度卻提高了不少，事實上 `@include` 還可以透過大括號進行傳遞，而 `@mixin` 則是透過 `@content` 接收，我自己是蠻常使用此方式撰寫 RWD，不覺得這樣直覺多了嗎？雖然說編譯後會產生多餘的代碼，但以開發體驗來說，我認為完全是不同等級的，這邊做個最後的補充：

```scss
@mixin hamburger {
  .open & {
    @content;
  }
}

.menu {
  max-height: 0px;
  @include hamburger {
    max-height: 300px;
  }
}
```

還記得之前介紹的 `&` 父選擇器搭配 hamburger menu 範例嗎？我們同樣可把它包裝成 `@mixin` 並搭配 `@content` 使之更具靈活度，可以參考上面範例。
