---
title: Sass / SCSS 預處理器 - Variables 變數宣告與 !global、!default 標誌定義
description:
  [
    先前我們就有提到 Sass / SCSS 真正意義上的將樣式表變為了一門程式語言，即 SassScript，而身為程式語言，想當然就會有所謂的變數可以使用，這也是我跳坑的其中一個原因，你能想像樣式表居然能夠使用變數做撰寫嗎？這指的變數與其他語言差不多，同樣有分為字串、陣列、物件等型態可做使用，大幅提高了代碼的重用性，以後如有更改的需求，也只需針對變數做處理即可，改善傳統樣式表不易維護問題。,
  ]
categories: [SCSS]
tags: [SCSS, w3HexSchool]
date: 2020-05-25 00:32:34
updated: 2020-05-26 19:38:49
---

## 前言

先前我們就有提到 Sass / SCSS 真正意義上的將樣式表變為了一門程式語言，即 SassScript，而身為程式語言，想當然就會有所謂的變數可以使用，這也是我跳坑的其中一個原因，你能想像樣式表居然能夠使用變數做撰寫嗎？這指的變數與其他語言差不多，同樣有分為字串、陣列、物件等型態可做使用，大幅提高了代碼的重用性，以後如有更改的需求，也只需針對變數做處理即可，改善傳統樣式表不易維護問題。

## 筆記重點

- 變數的宣告與取用
- !global、!default 標誌定義
- Sass 的計算功能
- Sass 的內建函式

## 變數的宣告與取用

Sass / SCSS 變數的宣告主要依靠 `$` 關鍵字，並且依造屬性聲明來做撰寫，其中的資料型態有：

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
- `length($list)`：計算 List 長度並返回

這邊只列出幾個比較常用到的函式，其它函式可在至官方的 [Built-In Modules](https://sass-lang.com/documentation/modules/list) 文檔進行查看，接著讓我們來看 Maps 型態：

```scss
$theme-colors: (
  primary: blue,
  danger: red,
);

.bg-primary {
  background-color: $theme-colors;
}
```

Maps 就如同 JavaScript 的 Object，只不過須將其 `{}` 更改為 `()`，且 Maps 無法直接進行取用，像是上面這樣子的寫法就是錯誤的，沒有任何一個 CSS 屬性有這樣子的格式，故編譯時即會跳錯，如果你想讓編譯器堅持輸出 Maps 的內容，可使用 `inspect` 函式：

```scss
$theme-colors: (
  primary: blue,
  danger: red,
);

.bg-primary {
  background-color: inspect($theme-colors);
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
$theme-colors: (
  primary: blue,
  danger: red,
);

.bg-primary {
  background-color: map-get($theme-colors, primary);
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
$theme-colors: (
  primary: blue,
  danger: red,
);

@each $key, $value in $theme-colors {
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

## !global、!default 標誌定義

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

這次我們加入了 `!default` 標誌，此標誌可針對變數設定預設值，如變數前或後都沒有重新賦值的發生，即使用此預設值，此時的編譯結果為：

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

變數不只可以宣告在全域環境 (不在任何大括號內宣告之變數)，也可以宣告在區域環境 (大括號內所宣告之變數)，以上面範例來說，`.bg-primary` 是存取不到 `$primary` 這個區域變數的，此時會跳 `Undefined` 的提示，如果堅持要存取這個變數，可使用 `!global` 標誌：

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

## Sass 的計算功能

傳統的 CSS 需要依靠其 `calc()` 函式才能完成數值加減乘除的目的，在 Sass / SCSS 中，一切似乎變得更容易了，讓我們直接來看範例：

```scss
$gutter-width: 30px;
$grid-sum: 12;

.col-4 {
  position: relative;
  padding-left: $gutter-width / 2;
  padding-right: $gutter-width / 2;
  max-width: 100% * (4 / $grid-sum);
  flex: 0 0 (100% * (4 / $grid-sum));
}
```

如同我們之前所強調，Sass / SCSS 讓 CSS 真正意義上的成為了一門程式語言，而程式語言理所當然就會有數值計算的功能，不管是哪種運算方式都難不倒它，你不需要特別使用函式，如同一般語言撰寫其算式即可，此時的編譯結果為：

```scss
.col-4 {
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
  max-width: 33.33333%;
  flex: 0 0 33.33333%;
}
```

除了基本的加減乘除外，取餘數也難不倒它，最扯的是連顏色都可以計算：

```scss
$base: 16px;

.content {
  letter-spacing: $base % 6;
  background-color: #ff0000 + #002fff;
}
```

此時的編譯結果為：

```css
.content {
  letter-spacing: 4px;
  background-color: #ff2fff;
}
```

一般的程式語言數值並不會像 SCSS 有 `px`、`em`、`%` 之分，此時如果進行運算，可能就會跳出錯誤：

```scss
.section {
  height: 100% - 100px;
}
```

像這樣不同單位間的計算就會跳出 `Incompatible units` 的提示，導致編譯失敗，Sass / SCSS 是屬於 CSS 的預處理器，它無法像 `calc()` 函式作用在 Browser 可得知當下的數值並加以計算，盡量在撰寫時都是以同單位做計算，`px` 就對 `px`，`em` 就對 `em`，如果真的有不同單位間的計算需求，就使用 CSS3 的 `calc()` 函式：

```scss
.section {
  height: calc(100% - 100px);
}
```

並沒有說使用 Sass / SCSS 就無法撰寫 CSS 的函式，畢竟底層就是 CSS，也就不存在兼容的問題，這邊再做個非常重要的補充：

```scss
$base: 100%;

.section {
  height: calc($base - 100px);
}
```

你可能會想，這不就是個基本的變數取用嗎？還需要特別介紹？這你就錯了，讓我們先來看編譯結果：

```css
.section {
  height: calc($base - 100px);
}
```

雖然編譯是成功了，但其變數並沒有成功被解析出來，此時就會導致 CSS 無法辨認其值進而產生錯誤的問題，這也是我特別要提的點，**在某些情況下，SCSS 無法辨認其值是屬於需解析的變數還是預設的屬性值**，這是很麻煩的一件事，但其實不用太過擔心，這問題發生的機率非常低，通常都是在某些較為特殊的情況下才會發生，解決方式也很簡單，只需利用 SCSS 提供的 [Interpolation](https://sass-lang.com/documentation/interpolation) 方法：

```scss
$base: 100%;

.section {
  height: calc(#{$base} - 100px);
}
```

使用 `#{}` 將變數給帶入，用以告知編譯器此段需進行編譯，此時的結果為：

```css
.section {
  height: calc(100% - 100px);
}
```

最後的編譯結果就會如同預期，這時你可能會問，那是否所有屬性有帶入變數的地方都使用 `#{}` 比較安全？答案是否定的，這樣會顯得代碼很雜亂，有需要再使用就好了，畢竟此問題發生的機率真的非常低。

## Sass 的內建函式

Sass 提供了許多內建函式，這些函式可以更快速的讓我們達到某些目的，其中包含的種類有：

- [sass:math](https://sass-lang.com/documentation/modules/math)：提供對數值進行運算的功能
- [sass:string](https://sass-lang.com/documentation/modules/string)：使組合、搜索或拆分變的更加容易
- [sass:color](https://sass-lang.com/documentation/modules/color)：根據現有顏色生成新顏色，從而輕鬆構建主題顏色
- [sass:list](https://sass-lang.com/documentation/modules/list)：使你可以訪問和修改列表中的值
- [sass:map](https://sass-lang.com/documentation/modules/map)：可以查找、編輯地圖中指定鍵匹配的值
- [sass:selector](https://sass-lang.com/documentation/modules/selector)：提供對 Sass 強大選擇器引擎的訪問
- [sass:meta](https://sass-lang.com/documentation/modules/meta)：公開了 Sass 內部工作的細節

像是之前介紹的 `nth`、`append` 這些就屬於 list 的內建函式，這邊補充關於顏色的內建函式：

- `darken($color, $amount)`：暗化指定顏色並返回
- `lighten($color, $amount)`：亮化指定顏色並返回
- `invert($color)`：反轉指定顏色並返回
- `fade-in($color, $amount)`：使指定顏色更加不透明並返回 (限 0 到 1 的 Alpha 值)
- `fade_out($color, $amount)`：使指定顏色更加透明並返回 (限 0 到 1 的 Alpha 值)

以下為範例：

```scss
$primary: #0084ff;

.btn-primary {
  color: #fff;
  background-color: $primary;
  border-color: $primary;

  &:hover {
    background-color: darken($primary, 10%);
    border-color: darken($primary, 10%);
  }

  &:active {
    background-color: lighten($primary, 10%);
    border: lighten($primary, 10%);
  }
}
```

此時的編譯結果為：

```css
.btn-primary {
  color: #fff;
  background-color: #0084ff;
  border-color: #0084ff;
}

.btn-primary:hover {
  background-color: #006acc;
  border-color: #006acc;
}

.btn-primary:active {
  background-color: #339dff;
  border: #339dff;
}
```

是不是挺方便的？我們就不需要自己慢慢的調整，通通透過內建函式即可自動判斷其目標的顏色，相關的函式還有很多，由於篇幅問題，這邊就不做一一介紹，相關連結可參考上面。
