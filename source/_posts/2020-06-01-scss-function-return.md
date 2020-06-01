---
title: Sass / SCSS 預處理器 - @function 建立函式與 @return 返回結果
description:
  [
    之前介紹 @mixin 時是以一般語言的函式做為參考進行操作，事實上 SCSS 有更符合函式定義的語法名為 @function，與 @mixin 不同的地方在於 @function 無法直接將 CSS 樣式加載至當前所在的 CSS 塊內，反而是透過 @return 將函式內處理的結果返回給呼叫的對象後續再進行相關處理，簡單來講就是 @mixin 負責包裝 CSS 樣式，而 @function 則是包裝需透過處理使之形成的有效對象，該如何透過 @function 進一步提升開發效率也就是本篇的重點。,
  ]
categories: [SCSS]
tags: [SCSS, w3HexSchool]
date: 2020-06-01 12:30:43
updated: 2020-06-01 12:30:43
---

## 前言

之前介紹 @mixin 時是以一般語言的函式做為參考進行操作，事實上 SCSS 有更符合函式定義的語法名為 @function，與 @mixin 不同的地方在於 @function 無法直接將 CSS 樣式加載至當前所在的 CSS 塊內，反而是透過 @return 將函式內處理的結果返回給呼叫的對象後續再進行相關處理，簡單來講就是 @mixin 負責包裝 CSS 樣式，而 @function 則是包裝需透過處理使之形成的有效對象，該如何透過 @function 進一步提升開發效率也就是本篇的重點。

## 筆記重點

- 建立函式與返回結果
- 添加並傳入其餘參數
- 添加並傳入可選參數

## 建立函式與返回結果

目前都是推薦使用 LibSass 做為 Sass 實現的對象，關於 LibSass 與 Dart Sass 的差別可參考我之前寫過的 [文章](https://awdr74100.github.io/2020-03-04-webpack-sassloader/#%E8%A3%9C%E5%85%85%EF%BC%9ADart-Sass-%E8%88%87-Node-Sass)，而 LibSass 本身並沒有 `math.pow` 方法，此方法只能在 Dart Sass 的環境下使用，不如我們利用函式手刻出效果不就得了？直接來看範例：

```scss
@function pow($base, $exponent) {
  $result: 1;
  @for $var from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.section {
  z-index: pow(2, 10) * 1px;
}
```

在 SCSS 宣告函式可使用 `@function` 關鍵字，當產生結果時可使用 `@return` 將其返回給呼叫的對象，其實與一般語言的函式沒啥兩樣，讓我們再來看個例子：

```scss
// _variables.scss
$theme-colors: map-merge(
  (
    'primary': #007bff,
    'secondary': #6c757d,
    'success': #28a745,
  ),
  ()
);

// _functions.scss
@function theme-color($key) {
  @return map-get($theme-colors, $key);
}

.text-primary {
  color: theme-color(primary);
}
```

在 Bootstrap 的 SCSS 檔案中，你會多次看到上面這種寫法，起初我本來以為 `theme-color` 是 SCSS 內建的方法，後來才發現原來是 `_functions.scss` 這隻檔案宣告的函式阿，這時你可能會想，這樣不是多此一舉嗎？我直接使用 `map-get` 不就能取得對應的顏色了嗎？幹嘛還要使用函式方式做取得？老實講我也不太能理解這樣的處理手段，我認為這也是 `@function` 使用頻率較低的原因，畢竟 SCSS 的撰寫是以樣式為主，在這種情況下 `@mixin` 往往來的比 `@function` 更好用，且在 SCSS 不需要處理一般語言中這麼複雜的對象，`@function` 的存在也就越來越模糊。

## 添加並傳入其餘參數

與 `@mixin` 處理手法相同，`@function` 同樣也可添加類似於 JavaScript 中的 [Rest parameter](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/rest_parameters)，直接來看範例：

```scss
@function sum($numbers...) {
  $sum: 0;
  @each $number in $numbers {
    $sum: $sum + $number;
  }
  @return $sum;
}

.micro {
  width: sum(50, 30, 100) * 1px;
}
```

所謂的其餘參數就是指將未明確定義其接收變數的參數通通放在 `$...` 變數裡頭，這一個 `$...` 變數會以 List 的形式存在，接下來就看要用迴圈還是相關方法進行取用動作。

## 添加並傳入可選參數

