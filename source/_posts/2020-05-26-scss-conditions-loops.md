---
title: Sass / SCSS 預處理器 - @if、@else if 條件判斷與 @for、@each 迴圈處理
description:
  [
    雖然說撰寫樣式表其複雜性遠遠低於一般的主流程式語言，但無法否認在某些時候我們確實需要更高效的做法來達到目的，迴圈處理就是個很好的例子，傳統 CSS 撰寫樣式必定是透過手動輸入的方式來完成，而 Sass / SCSS 提供了像是 @for、@each、@while 語句，讓我們透過迴圈的方式快速產出樣式，藉此達到高效開發的目的，其中也包含像是 @if、@else if 等條件判斷式，可根據其判斷輸出不同的樣式，讓我們在較複雜的情境依然能夠保持其樣式表的靈活度。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-05-26 20:15:42
updated: 2020-05-28 01:13:58
---

## 前言

雖然說撰寫樣式表其複雜性遠遠低於一般的主流程式語言，但無法否認在某些時候我們確實需要更高效的做法來達到目的，迴圈處理就是個很好的例子，傳統 CSS 撰寫樣式必定是透過手動輸入的方式來完成，而 Sass / SCSS 提供了像是 @for、@each、@while 語句，讓我們透過迴圈的方式快速產出樣式，藉此達到高效開發的目的，其中也包含像是 @if、@else if 等條件判斷式，可根據其判斷輸出不同的樣式，讓我們在較複雜的情境依然能夠保持其樣式表的靈活度。

## 筆記重點

- 條件判斷式與邏輯運算子
- 迴圈處理與實際應用

## 條件判斷式與邏輯運算子

像是 `if`、`else if` 這種條件判斷式有接觸過任一程式語言的人應該都很熟悉了才對，能夠幫助我們依造判斷的結果選用不同的內容，讓我們直接來看範例：

```scss
$device: mobile;

p {
  @if $device == desktop {
    font-size: 1.5rem;
  } @else if $device == pad {
    font-size: 1.25rem;
  } @else {
    font-size: 1rem;
  }
  color: red;
}
```

就如同一般程式語言的條件判斷式寫法，這應該蠻好理解的，但這邊要注意 SCSS 並未提供像是 `switch` 等語句，僅提供以下條件判斷式語句：

- `@if`：如果為 `true`，則該塊被運行
- `@else`：跟隨 `@if` 規則，如果為 `false`，則該塊被運行
- `@else if`：在 `@else` 評估其規則，運作如同 `@if`

與 Python 類似，僅提供以上三種判斷式語句，且比對的方法也幾乎差不多，如果你是 JavaScript 的開發者，應該很常使用像是 `===` 進行比對，在 SCSS 你不必這樣做，也不能這樣做，只需要撰寫傳統的 `==`、`!=`、`>=` 比較其目標即可，這邊針對邏輯運算子做個補充：

- `and`：兩個運算式都是 `true` 時才會回傳 `true`
- `or`：兩個運算式有任一個是 `true` 時就會回傳 `true`
- `not` 反轉運算式結果

一樣與 Python 類似，其邏輯判斷子都變得更為直接，這邊我們再來看個範例：

```scss
$primary: rgb(0, 0, 0);

.text-primary {
  @if ($primary == black and $primary == #000000) {
    color: $primary;
  } @else {
    color: red;
  }
}
```

此時的編譯結果為：

```css
.text-primary {
  color: black;
}
```

一般對於這種邏輯運算子不外乎就是比較字串或數值之間的關係，在 SCSS 定義了像是 `#000000` 顏色的型態，我們可透過相同方式比較顏色之間的關係，當初看到也覺得很新奇，居然連顏色也可以比較，雖然使用頻率可能未必來的比基本型態高，但確實在某些時候可能能夠帶來關鍵性的作用。

## 迴圈處理與實際應用

接下來進入到迴圈處理的環節，在這邊要先強調，SCSS 並未像一般程式語言需處理各種複雜的情境，為了方便開發者的處理流程，進而衍伸出像是 JavaScript 中的 `for in`、`for of` 等方法，這些東西在 SCSS 都不存在，SCSS 就只有提供像 `@for`、`@each`、`@while` 等基本迴圈處理方法，畢竟需求很單純，這點在下面會在做說明，讓我們先從 `@for` 開始介紹：

```scss
@for $var from 1 to 3 {
  .mt-#{$var} {
    margin-top: $var * 10px;
  }
}
```

這邊的 `$var` 就類似於 JavaScript 中用 `let` 宣告的變數，區塊外是讀不到這個變數的，其他字詞的解釋如下：

- `start`：迴圈的起始值，這裡為 `1`
- `end`：迴圈的結束值，這裡為 `3`
- `to`：處理方式為 `start < end`，不包含迴圈的結束值
- `through`：處理方式為 `start <= end`，包含迴圈的結束值

如同上面解釋，使用 `to` 的話迴圈只會跑兩次，我們想要跑三次，故這邊使用 `through` 來進行：

```scss
@for $var from 1 through 3 {
  .mt-#{$var} {
    margin-top: $var * 10px;
  }
}
```

這邊還有一點要注意，在之前我們有提到在某些時候 SCSS 無法辨認其值是屬於需解析的變數還是預設的屬性值，其中的屬性值也有可能是字串，以上面範例來說，當我們把 `$var` 寫在 class 名稱時，就會產生此問題，解決辦法如之前，使用 `#{}` 將變數包裝起來即可，讓我們來看最後的編譯結果：

```css
.mt-1 {
  margin-top: 10px;
}

.mt-2 {
  margin-top: 20px;
}

.mt-3 {
  margin-top: 30px;
}
```

利用迴圈處理，我們就能快速產生需要的樣式，這樣子的結果就如同 Bootstrap 中的 Spacing 處理一般，大幅提高了其開發效率，讓我們在試一次：

```scss
$list: red blue black;

@for $var from 1 through length($list) {
  .text-#{nth($list,$var)} {
    color: nth($list, $var);
  }
}
```

這也是我們在撰寫一般程式語言最常用到的迴圈處理，利用迴圈產生數值進而取出陣列中的值，但在這邊我不太推薦以 `@for` 下去做，從編譯結果就可以得知：

```css
.text-red {
  color: red;
}

.text-blue {
  color: blue;
}

.text-black {
  color: black;
}
```

一般我們不會取作像 `.text-blue` 這樣的 class 名稱，如果其樣式顏色做了更改，這會導致名稱與內容不相符的狀況，搞的很詭異，盡量都是以工具性質去做命名，不要以語意化方式命名，這時就是 `maps` 出場的時候了：

```scss
$theme-colors: (
  primary: #0000ff,
  success: #008000,
  warning: #ffff00,
  danger: #ff0000,
);
```

`maps` 型態就如同一般語言的 Object，關於 `maps` 的介紹可參考上一篇文章，一般語言如果要遍歷 Object 可使用 `for in` 語句，但 SCSS 並沒有 `for in` 語句，取而代之的是 `@each` 語句，如下範例：

```scss
@each $key, $value in $theme-colors {
  .text-#{$key} {
    color: $value;
  }
}
```

這邊的 `@each` 就類似於 Python 的 `for in` 語句，我個人是把它記成 JavaScript 中 `for of` 結合 `Object.entries()` 並搭配解構的處理方式：

```js
for (const [key, value] of Object.entries(obj)) {
  console.log(key); // primary
  console.log(value); // 0000ff
}
```

如果將被賦值的兩個變數更改為一個，此時這一個變數拿到的就是單獨的 List 物件，你可以從 JavaScript 解構的方向去思考，更可以直接拿掉 `$value` 變數，直接讀取 `$key` 變數看看，這個變數就會得到 `iterator` 的結果，讓我們來看最後的編譯結果為何：

```css
.text-primary {
  color: #0000ff;
}

.text-success {
  color: #008000;
}

.text-warning {
  color: #ffff00;
}

.text-danger {
  color: #ff0000;
}
```

有沒有似曾相似的感覺？沒錯，Bootstrap 中的主題顏色就是依靠此方式生成的，可以參考 [官方文檔](https://github.com/twbs/bootstrap/blob/master/scss/_variables.scss)，其中也包含像 `.bg-primary`、`btn-primary` 等樣式，原理都是一模一樣的，相比於傳統 CSS 依靠手動方式撰寫樣式，使用 SCSS 能夠快速並符合結構化方式自動生成樣式，這也是為什麼 SCSS 越來越火紅的原因，這個坑跳了就不想回去了，最後來介紹 `@while` 迴圈處理語句：

```scss
$num: 1;

@while $num <= 3 {
  .pt-#{$num} {
    padding-top: $num * 10px;
  }
  $num: $num + 1;
}
```

就如同一般語言的 `while` 語句，透過 `true` 或 `false` 控制迴圈流程，我比較不建議使用 `@while` 來處理迴圈，就連官方自己也說除非是特別複雜的情境，不然盡量不要使用 `@while` 語句，易造成可讀性低落的問題，更好的選擇應該是 `@for` 或 `@each` 才對。
