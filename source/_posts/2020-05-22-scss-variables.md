---
title: Sass / SCSS 預處理器 - Variables 變數宣告與取用方式
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
- 變數的作用範圍

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

有關變數的取用應該是蠻好理解的，就只是將其宣告在上方並在指定位置進行取用而已，這邊要注意的是，**SCSS 中的變數就如同 JavaScript 用 let 宣告的變數**，這也代表著變數必定要在取用之前進行宣告，不然會跳出 `Undefined` 的錯誤，此時的編譯結果為：

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

List 是在 SCSS 中用來表達 CSS 樣式的方法，像是 `10px 20px 10px 20px` 或 `Helvetica, Arial` 等，並不一定要像一般 Array 需用逗號隔開以辨識每一個項目，在 List 你也可以使用空格做區隔，如果要取用其中的項目，可使用內建的 `nth` 函式：

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

List 的初始值即為 1，並不像一般語言中的 Array 初始值為 0

`nth` 函式的第一個參數為作用的 List，第二個為取用的位置，這邊比較特殊的是，**List 的初始值即為 1，並不像一般語言中的 Array 為 0**，以及所有的函式都是作用在 List 的副本，這代表原有的 List 不會受任何更動，除了 `nth` 之外，還有以下函式可使用：

- `set-nth($list, $n, $value)`：修改 List 副本的指定項目並返回
- `append($list, $value)`：在 List 副本最後位置新增項目並返回
- `join($list1, $list2)`：將 List 副本進行合併並返回

這邊只列出幾個比較常用到的函式，其它函式可在至官方的 [Built-In Modules](https://sass-lang.com/documentation/modules/list) 文檔進行查看，接著讓我們來看 Maps 型態：

```scss
$theme-color: (
  primary: blue,
  danger: red,
);

.bg-primary {
  background-color: $theme-color;
}
```

Maps 就如同 JavaScript 的 Object，只不過須將其 `{}` 更改為 `()`，且 Maps 無法直接進行取用，像是上面這樣子的寫法就是錯誤的，沒有任何一個 CSS 屬性有這樣子的格式，故編譯時即會跳錯，如果你想讓編譯器堅持輸出 Maps 的內容，可使用 `inspect` 函式：

```scss
$theme-color: (
  primary: blue,
  danger: red,
);

.bg-primary {
  background-color: inspect($theme-color);
}
```

`inspect` 就類似 JavaScript 中的 `console.log`，主要都是用於輸出指定的對象，方便我們測試用，此時的編譯結果為：

```css
.bg-primary {
  background-color: (primary: blue, danger: red);
}
```

如同我們前面所說，沒有半個 CSS 屬性格式是長這樣，正確的做法應該是讀取其鍵以取用其值才對，此時可使用 `map-get` 函式：

```scss
$theme-color: (
  primary: blue,
  danger: red,
);

.bg-primary {
  background-color: map-get($theme-color, primary);
}
```

`map-get` 主要用來取用 Maps 的內容，第一個參數為作用的 Maps，第二個參數為須取用值的鍵，此時的編譯結果為：

```css
.bg-primary {
  background-color: blue;
}
```

這樣就能完成像是一般語言取用物件的目的，除了 `map-get` 之外，還有以下函式可使用：

- `map-merge($map1, $map2)`：將 map 副本進行合併並返回 (如有重複項，後者將覆蓋前者)
- `map-remove($map, $key1, $key2...)`：刪除 map 副本中的指定項目並返回
- `map-keys($map)`：將 map 中的鍵以 List 型式返回
- `map-values($map)`：將 map 中的值以 List 型式返回

這時你可能會想，List 與 Maps 實用性看起來好像不高？光是取個值就得大費周章，那是因為我們還沒提到迴圈的使用，這兩個型別通常都是與迴圈共同使用才能發揮其強大，在下一篇文章會有詳細的介紹，這邊先寫個簡單的範例：

```scss
$theme-color: (
  primary: blue,
  danger: red,
);

@each $key, $value in $theme-color {
  .text-#{$key} {
    color: $value;
  }
}
```

此時的編譯結果為：

```css
.text-primary {
  color: blue;
}

.text-danger {
  color: red;
}
```

## 變數的作用範圍

SCSS 的變數與一般語言的變數同樣都有作用範圍之分，直接來看範例：

```scss
$primary: blue;
$primary: red;

.text-primary {
  color: $primary;
}
```

前面我們有提到 SCSS 的變數就如同 JavaScript 用 `let` 宣告的變數，與 `const` 宣告的常數不同，`let` 宣告的變數可以被重新賦值，此時的編譯結果為：

```css
.text-primary {
  color: red;
}
```

重複的變數宣告就如同重新賦值，這才導致此結果，只要記住 SCSS 是由上到下進行編譯就很好理解了，讓我們來看下個範例：

```scss
$primary: blue;
$primary: red !default;

.text-primary {
  color: $primary;
}
```

這次我們加入了 `!default` 關鍵字，此關鍵字可針對變數設定預設值，如變數前或後都沒有重新賦值的發生，即使用此預設值，此時的編譯結果為：

<div class="note warning">補充：除非變數前的設定值為 null，不然預設值的權重必定是最小的，任何都能將其覆蓋</div>

```css
.text-primary {
  color: blue;
}
```

由於 `$primary` 發生了重新賦值的操作，故使用預設值除外的設定值，如果同時發生預設值之前之後都有設定值，此時會使用之後的設定值，因為 SCSS 是由上到下進行編譯的，讓我們來看下個範例：

```scss
.text-primary {
  $primary: red;
  color: $primary;
}

.bg-primary {
  color: $primary;
}
```

變數不只可以宣告在全域環境 (不在任何大括號內宣告之變數)，也可以宣告在區域環境 (大括號內所宣告之變數)，以上面範例來說，`.bg-primary` 是存取不到 `$primary` 這個區域變數的，此時會跳 `Undefined` 的提示，如果堅持要存取這個變數，可使用 `!global` 關鍵字：

```scss
.text-primary {
  $primary: red !global;
  color: $primary;
}

.bg-primary {
  color: $primary;
}
```

此時 `$primary` 變數就會被拉升到全域環境內，意即不再任何大括號宣告之變數，`.bg-primary` 自然就能夠取用這個變數，這邊再補充一個範例：

```scss
.list {
  $primary: red;
  color: $primary;

  &__item {
    $primary: blue !global;
    color: $primary;
  }
}
```

如同 JavaScript 的作用域觀念，變數取用會先以當下區域進行尋找，如果找不到再往上層尋找，以上面的範例來說，`list__item` 宣告的 `$primary` 變數被拉升到了全域環境裡，表示區域已經不存在變數，故往上層尋找是否存在此變數，此時找到了值為 `red` 的 `$primary` 變數，最後的編譯結果為：

```css
.list {
  color: red;
}

.list__item {
  color: red;
}
```