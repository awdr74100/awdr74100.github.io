---
title: Sass / SCSS 預處理器 - Variables 變數宣告與取用方法
description:
  [
    先前我們就有提到 Sass / SCSS 真正意義上的將樣式表變為了一門程式語言，即 SassScript，而身為程式語言，想當然就會有所謂的變數可以使用，這也是我跳坑的其中一個原因，你能想像樣式表居然能夠使用變數做撰寫嗎？這指的變數與其他語言差不多，同樣有分為字串、陣列、物件等型態可做使用，大幅提高了代碼的重用性，以後如有更改的需求，也只需針對變數做處理即可，改善傳統樣式表不易維護問題。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-05-22 13:52:34
updated: 2020-05-22 13:52:34
---

## 前言

先前我們就有提到 Sass / SCSS 真正意義上的將樣式表變為了一門程式語言，即 SassScript，而身為程式語言，想當然就會有所謂的變數可以使用，這也是我跳坑的其中一個原因，你能想像樣式表居然能夠使用變數做撰寫嗎？這指的變數與其他語言差不多，同樣有分為字串、陣列、物件等型態可做使用，大幅提高了代碼的重用性，以後如有更改的需求，也只需針對變數做處理即可，改善傳統樣式表不易維護問題。

## 筆記重點

- 變數的宣告與取用

## 變數的宣告與取用

Sass / SCSS 變數的宣告主要依靠 `$` 關鍵字，並且依造屬性聲明來做撰寫，可選的資料型態有：

- 數值 (Number)：`12`、`100px` (可能有或沒有單位)
- 字串 (String)：`Microsoft JhengHei` (可能有或沒有引號)
- 顏色 (Color)：`blue`、`#4cb5fc`、`hsl(204, 97%, 64%)`
- 列表 (List)：`0 0.5rem 1rem #0000ff`、`Helvetica, Arial, sans-serif`
- 地圖 (Maps)：`(primary: blue, danger: red)`
- 布林 (Boolean)：`true`、`false`
- 空值 (Null)：`null`
- 函式參考 (Function references)：可參考 [官方文檔](https://sass-lang.com/documentation/values) 說明

這邊比較特別就是 Maps 這個資料型態，其實它就類似 JavaScript 中的 Object，只不過將其 `{}` 換成 `()` 而已，下面會再做示範，讓我們先來看以下範例：

```scss
$primary: #2050ec;

.text-primary {
  color: $primary;
}
```

有關變數的取用應該是蠻好理解的，就只是將其宣告在上方並在指定位置進行取用而已，這邊要注意的是，SCSS 中的變數就如同 JavaScript 中的 `let` 宣告，這也代表著變數必定要在取用之前進行宣告，不然會跳出 `Undefined` 的錯誤，此時的編譯結果為：

```css
.text-primary {
  color: #2050ec;
}
```

數值、字串、顏色取用過程幾乎差不多，這邊就不再做示範，比較有疑問的可能是 List 這型態，其實它就類似一般所謂的 Array，如下範例：

```scss
$sizes: 10px 20px 10px 20px;

.p-5 {
  padding: $sizes;
}
```

List 是在 SCSS 中用來表達 CSS 樣式的方法，像是 `10px 20px 10px 20px` 或 `Helvetica, Arial` 等，並不像一般 Array 需用逗號隔開以辨識每一個項目，List 可由空格或逗號做區隔，如果要取用其中的項目，可使用內建的 `nth` 函式：

```scss
$sizes: 10px 20px 10px 20px;

.pt-5 {
  padding-top: nth($sizes, 1);
}
```

此時的編譯結果為：

```css
.pt-5 {
  padding-top: 10px;
}
```

`nth` 函式的第一個參數為作用的 List，第二個為取用的位置，這邊比較特殊的是，在 List 中，沒有像傳統 Array 有所謂的 `0` 位置，List 的最初值即為 `1`，以及所有的函式都是作用在 List 的副本，這代表原有的 List 不會受任何更動，除了 `nth`，還有以下函式可使用：

- `set-nth($list, $n, $value)`：修改 List 副本的指定項目並取用
- `append($list, $value)`：在 List 副本最後位置新增項目並取用
- `join($list1, $list2)`：將 List 副本進行合併並取用

這邊只列出幾個比較常用到的函式，其它函式可在至 [Built-In Modules](https://sass-lang.com/documentation/modules/list) 進行查看，
