---
title: Sass / SCSS 預處理器 - OOCSS、SMACSS、BEM 模組化方法論
description:
  [
    所謂的 CSS 方法論是指無須任何套件或框架即可達成模組化目的的架構心法，用以讓 CSS 也能有良好的重用性、維護性及延展性，雖然我們前面已經可透過像是 SCSS 預處理器搭配 7-1 Pattern 達到模組化的效果，但 7-1 模式的模組化拆分最小單位為檔案，這代表著檔案內的所有樣式依然還是處於未模組化的狀態，此時我們就可利用知名的 OOCSS、SMACSS、BEM 等 CSS 方法論針對像是 class 這種較小的單位進行模組化，真正意義上的讓樣式表達到模組化目的。,
  ]
categories: [SCSS]
tags: [SCSS, CSS, CSS Methodologies]
date: 2020-06-10 13:45:55
updated: 2020-06-10 13:45:55
---

## 前言

所謂的 CSS 方法論是指無須任何套件或框架即可達成模組化目的的架構心法，用以讓 CSS 也能有良好的重用性、維護性及延展性，雖然我們前面已經可透過像是 SCSS 預處理器搭配 7-1 Pattern 達到模組化的效果，但 7-1 模式的模組化拆分最小單位為檔案，這代表著檔案內的所有樣式依然還是處於未模組化的狀態，此時我們就可利用知名的 OOCSS、SMACSS、BEM 等 CSS 方法論針對像是 class 這種較小的單位進行模組化，真正意義上的讓樣式表達到模組化目的。

## 筆記重點

- OOCSS（Object Oriented CSS）
- SMACSS (Scalable and Moduler Architecture fro CSS)
- BEM (Block Element Modifier)

## OOCSS（Object Oriented CSS）

[OOCSS](http://oocss.org/) 是所有 CSS 方法論最早提出的一個，主要由 [Nicole Sullivan](https://github.com/stubbornella) 提出，你可以參考作者撰寫的 [WiKi](https://github.com/stubbornella/oocss/wiki)，OOCSS 就如同字面上的意思，主要依造 Object Oriented (物件導向) 方式來撰寫目標，這邊你可以把它理解為將 CSS 物件化、模組化，其主要原則有以下兩點：

- Separate structure and skin：結構與樣式分離
  - 例子：`.btn-primary`、`.rounded-top`
- Separate container and content：容器與內容分離
  - 例子：`.container`、`.col-4`

OOCSS 提倡的理念是樣式可重用性，在撰寫時也需符合以下規則：

- 應盡量避免使用後代選擇器 (`.navbar ul`) 或 id 選擇器 (`#list`)
- 應盡量避免樣式依賴於結構 (低耦合概念)，嘗試使用 class 替代 element 選擇器

### 結構與樣式分離

所謂的結構與樣式分離就如同 `.btn` 與 `.btn-primary` 之間的關係，讓我們先從一般在撰寫樣式的習慣開始說起：

```scss
$theme-colors: (
  primary: blue,
  success: green,
);

.btn-primary {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  color: #fff;
  background-color: map-get($theme-colors, primary);
  border: 1px solid map-get($theme-colors, primary);
  border-radius: 0.25rem;
}
```

傳統上我們習慣把全部樣式都寫在同一個 class 對象上，就像上面這個樣子，此時如果我們又要新增色系為 `success` 的按鈕呢？你可能會這樣做：

```scss
.btn-primary {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  color: #fff;
  background-color: map-get($theme-colors, primary);
  border: 1px solid map-get($theme-colors, primary);
  border-radius: 0.25rem;
}

.btn-success {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  color: #fff;
  background-color: map-get($theme-colors, success);
  border: 1px solid map-get($theme-colors, success);
  border-radius: 0.25rem;
}
```

發現問題了嗎？我們又浪費時間在撰寫相同的樣式了，在每次增加一個色系時，我們都必須整組做設定，這樣豈不是很浪費時間嗎？OOCSS 中的結構與樣式分離主要就是在改善這個問題，先將以上針對 OOCSS 的規範做個改寫：

```scss
.btn {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  color: black;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.btn-primary {
  color: #fff;
  background-color: map-get($theme-colors, primary);
  border: 1px solid map-get($theme-colors, primary);
}
```

在 OOCSS 的概念中，表現型的 style 就屬於樣式，封裝型的 style 就屬於結構，可參考以下：

- 樣式 (skin)：`color`、`background-color`、`border-color`
- 結構 (structure)：`display`、`box-sizing`、`padding` (通為樣式，但這控制其結構，故屬結構)

這應該蠻好理解的，凡是顏色、邊框樣式、陰影這些都屬於 OOCSS 中所說的 skin，而像 `display` 這種或封裝對象本身就該擁有的屬性，這指 `padding`，就是所稱的 structure，你可能會問這樣的用意是什麼？直接來看 `<button>` 是如何使用這些樣式的：

```html
<button class="btn btn-primary">Primary</button>
```

是不是直覺很多？我們可以很明確的知道此對象的結構與樣式，往後如果要增加不同色系，這指 skin，也只需要撰寫像是 `.btn-success`、`.btn-danger` 的樣式即可，如果你想要更高效的做法，可以搭配 Sass 中的 `@each` 使結構更具可讀性：

```scss
$theme-colors: (
  primary: blue,
  success: green,
  danger: red,
);

.btn {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  color: black;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

@each $key, $value in $theme-colors {
  .btn-#{$key} {
    color: #fff;
    background-color: $value;
    border: 1px solid $value;
  }
}
```

此時按鈕只需加載對應樣式：

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
```

相信透過上面的範例你就能了解何謂結構與樣式分離了，如果以 OOCSS 中的 OO (Object Oriented) 做描述的話，這邊的結構 (Structure) 就是所指的對象，以上面範例來說，我們封裝了 `<button>` 對象，往後如果要使用 `<button>`的話，只需要撰寫 `.btn` 結構樣式名稱與對應的 skin 即可。

### 容器與內容分離

介紹完了何謂結構與樣式分離，接下來換容器與內容該如何分離，它們之間就如同 `.card` 與 `.btn` 的關係，直接來看範例：

```scss
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
}

.card button {
  display: inline-block;
  padding: 0.375rem 0.75rem;
}
```

通常我們在撰寫 CSS 時，很長根據 HTML 結構來撰寫其樣式，從上面可以看出 `.card` 裏頭似乎有個 `button`，這樣子的寫法毫無靈活度可言，`button` 完全被綁死在了 `.card` 裏頭，OOCSS 中的容器與內容分離主要就是在改善這個問題，先將以上針對 OOCSS 的規範做個改寫：

```scss
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
}

.btn {
  display: inline-block;
  padding: 0.375rem 0.75rem;
}
```

容器與內容分離意旨將兩個不同的父子元素給分離出來，藉此達到父子元素不相互依賴的目的，且父子元素只存在於名稱上的關係，實際上兩者都可單獨存在並使用在不同的區域上，在這邊 `.card` 就屬於容器，`.btn` 就屬於內容，詳細可參考以下：

- 容器 (container)：`.container`、`.col-4`、`.header`
- 內容 (content)：`.btn`、`.input`、`.dropdown`

這邊要注意，並非所有對象都須遵守容器與內容分離的原則，可參考以下範例：

```scss
.col-4 {
  flex: 0 0 100% * (4/12);
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;

  &-body {
    margin: 10px auto;
  }
}
```

一個對象可能同時身兼容器與內容的角色，對於 `.col-4` 對象來說，`.card` 就屬於內容，而對於 `.card-body` 對象來說，`.card` 就屬於容器，你可能會想，怎不把 `.card-body` 做分離呢？不是說容器必須與內容作分離嗎？這邊的 `.card-body` 如果獨立存在本身是沒有任何意義的，需與 `.card` 搭配才會有意義，在這種情況下 `.card-body` 屬於 `.card` 的繼承，就無須將其分離出來，與前面的 `.btn` 不同，`.btn` 獨立存在是可重複使用在其他區塊上的。

跑過一次上面的範例你大概就能了解 OOCSS 該怎麼使用了，是不是其語法結構跟某框架很相似阿？沒錯！Bootstrap 便是根據 OOCSS 規範寫的，我們可以隨便拿個範例來看：

```html
<nav class="navbar navbar-light bg-light">
  <a class="navbar-brand">Navbar</a>
  <form class="form-inline">
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
  </form>
</nav>
```

其中有 `.navbar`、`.navbar-light` 等 class，這些就屬於 OOCSS 中的結構與樣式分離，而 `.form-inline`、`.btn` 等 class，這些就屬於容器與內容分離，如果你想更深入的學習 OOCSS 概念，不妨參考下 Bootstrsp 的原始碼，其處理的細膩度可說是將 OOCSS 發揮的淋漓盡致。

## SMACSS (Scalable and Moduler Architecture fro CSS)

[SMACSS](http://smacss.com/) 主要由 [Jonathan Snook](https://snook.ca/) 提出，從名稱上的 Architecture 字樣可以得知他是以專案整體的結構來做考量，除了擁有與 OOCSS 類似的 HTML 與 CSS 分離概念，還有其最具特色的結構化命名概念，所謂的結構化命名是指將對象做結構分類並將其限制命名，藉此達到容易擴展及模組化目的，SMACSS 相比於 OOCSS 更偏向整個專案結構的分類及模組化你的 CSS，其中結構的分類有：

- Base
- Layout
- Module
- State
- Theme

結構分類的目的在於將 CSS 做有效的區隔，你可以把它想成像 7-1 模式的概念，並且結合了其命名限制概念，這邊你可以先參考就好，關於實際的用途將在下面各項規則做完整介紹：

- Base：不須特別提供前綴，且不會使用到 class、id 選擇器，目的在於設定元素基本樣式
  - 例子：`html`、`*:before`、`img`
- Layout：使用 `l-` 或 `layout-` 為次要佈局樣式提供前綴，目的在於將佈局樣式與其他樣式做區隔
  - 例子：`.l-header`、`.l-sidebar`、`.l-grid`
- Module：使用模組本身命名為子模組樣式提供前綴，目的在於快速了解其相關性
  - 例子：`.card`、`.card-header`、`.card-body`
- State：使用 `is-` 為狀態樣式提供前綴，透過語意化方式了解當前狀態
  - 例子：`.is-active`、`.is-hidden`、`.is-collapsed`
- Theme：不須特別提供前綴，目的在於更改對象原本的主題樣式
  - 例子：`.modal-dark`、`.badge-white`

### Base 規則

Base 主要面相某些對象的基本及預設樣式，比如 [meyerweb](https://meyerweb.com/eric/tools/css/reset/) 或 [normalize](https://necolas.github.io/normalize.css/8.0.1/normalize.css) 版本的重製文件，或者是一些全域型的樣式設定，在撰寫時可參照以下規則：

- 可使用元素選擇器、後代選擇器、子選擇器以及任何偽類將基本樣式應用於元素
- 不應該使用 class、id 選擇器設置元素預設樣式
- 不應該使用 `@important` 設置元素預設樣式 (權重過高，無法覆蓋)

可參考以下：

<!-- prettier-ignore-start -->
```scss
html, form {
  margin: 0;
  padding: 0;
}

*, *:before, *:after {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}
```
<!-- prettier-ignore-end -->

### Layout 規則

Layout 主要面向一些網站中的大型區塊樣式，你可以把它想像成 7-1 模式中的 Layout，所處理的對象大同小異，較特別的是 SMACSS 中的 Layout 有針對重用性劃分出主要佈局樣式和次要佈局樣式，主要佈局樣式是指畫面不發生重用的對象，而次要佈局樣式自然就是指會發生重用的對象，在撰寫時可參照以下規則：

- 主要佈局樣式通常使用 id 選擇器進行設置
- 次要佈局樣式通常使用 class 選擇器進行設置
- 次要佈局樣式可提供 `l-` 或 `layout-` 前綴用以將佈局樣式與基本樣式做區隔
- **參考 OOCSS 中的容器與內容分離概念**

可參考以下：

<!-- prettier-ignore-start -->
```scss
#header, #article, #footer {
  width: 960px;
  margin: auto;
}

#article {
  border: solid #CCC;
  border-width: 1px 0 0;
}
```
<!-- prettier-ignore-end -->

有違於其他 SMACSS 中的規則，在 Layout 規則中的主要佈局樣式是可以使用 id 將其宣告的，當然這僅限於畫面中不重複的對象，通常為 HTML5 帶有語意化的那些標籤，如果你想要在特定情況更改其佈局樣式，可以與次要佈局樣式搭配做使用，如下所示：

```scss
#article {
  float: left;
}

#sidebar {
  float: right;
}

.l-flipped #article {
  float: right;
}

.l-flipped #sidebar {
  float: left;
}
```

藉由 CSS 疊層的特性，可讓對象應用到更高層的佈局樣式，用以覆蓋其預設樣式，這邊要注意，所謂的主要佈局樣式以及次要佈局樣式就只是名稱上的定義，請不要把思維限制在只能使用主要佈局樣式，也就是通通使用 id 選擇器撰寫其佈局樣式，大部分情況次要佈局樣式要來的比主要佈局樣式有用太多了，你可以參考接下來的這個範例：

```html
<div id="featured">
  <h2>Featured</h2>
  <ul>
    <li><a href="…">…</a></li>
    <li><a href="…">…</a></li>
    …
  </ul>
</div>
```

如果不考慮 SMACSS 中的次要佈局樣式寫法，我們可能會傾向於在 `featured` 周圍的 `div` 添加 id，然後從那裡進行樣式設置：

```scss
div#featured ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

div#featured li {
  float: left;
  height: 100px;
  margin-left: 10px;
}
```

這樣撰寫等同於把對象給完全綁死了，這邊指 `#featured` 只能套用在 `div` 標籤上，且由於使用了 id 選擇器，代表同個頁面中只能存在單個套用對象，是不是有點熟悉？這不就是當時 OOCSS 在解決的問題嗎？在 SMACSS 我們可以使用次要佈局樣式改善這個問題：

```scss
.l-grid {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.l-grid > li {
  display: inline-block;
  margin: 0 0 10px 10px;
}
```

其實 SMACSS 中的次要佈局樣式道理就如同 OOCSS 的容器與內容分離，目的都是將其依賴性降到最低，從上面範例來看，`l-grid` 目前可應用於任何容器以創建浮動樣式的佈局了，同時我們也將選擇器修改為 `>` 子對象選擇器避免有例外的樣式套用到對象，還有將高度給拿掉讓對象能夠自適應，關於次要佈局樣式的實作，你就把它當成在 OOCSS 的基礎下加上其命名限制中的 `-l` 前綴就可以了。

### Module 規則

Module 主要面向一些網站中的可重用元件樣式，與 Layout 不同的地方在於其對象更為準確，你可以把它想像成 7-1 模式中的 Component，所處理的對象大同小異，基於 Module 的對象都應該能以獨立組件方式存在，如果操作正確，則可以輕鬆的將元件移動到 Layout 的不同部分，在撰寫時可參照以下規則：

- 不應該使用元素選擇器、id 選擇器設置元素樣式
- 僅使用 class 選擇器設置元素樣式
- 使用模組本身命名為子模組樣式提供前綴
- **參考 OOCSS 中的結構與樣式分離概念**

可參考以下：

```html
<div class="card">
  <div>Card Header</div>
  <div>Card Footer</div>
</div>
```

如果遇到以上情境，我們通常會選擇偷懶的方式撰寫樣式：

```scss
.card > span {
  padding-left: 20px;
}
```

這樣的問題在於 `.card` 底下第一層 `div` 都被綁死了，如果我們今天要針對不同 `div` 撰寫效果，勢必要做出改變，在 SMACSS 中的 Module 建議通通使用 class 選擇器撰寫樣式：

```scss
.card-header {
  padding-left: 20px;
}

.card-footer {
  padding-left: 20px;
}
```

這樣子的做法解決了 `div` 被綁死的情況，同時也增加了不少可讀性，作者有強調盡量不要使用 `div`、`span` 這種大眾化的元素選擇器，使用 class 選擇器強調語意化及可重用性才是正解，繼續來看下個範例：

```scss
.pod {
  width: 100%;
}
.pod input[type='text'] {
  width: 50%;
}
#sidebar .pod input[type='text'] {
  width: 100%;
}
```

前面我們有提到，基於 Module 的對象應能夠在網頁中的任一位置使用，這時我們撰寫出的樣式可能就會長的像上面這個樣子，若專案越來越複雜，可能會不小心忽略 CSS 的優先權，進而產生樣式互蓋導致跑版的問題，SMACSS 建議更改為下：

```scss
.pod {
  width: 100%;
}

.pod input[type='text'] {
  width: 50%;
}

.pod-constrained input[type='text'] {
  width: 100%;
}
```

此時可以直接套用子模組樣式：

```html
<div class="pod pod-constrained">...</div>
```

其實他的概念就如同 OOCSS 中的結構與樣式分離，只不過在這稱其為子類化模組，透過將基底樣式抽離出來，往後在不同區域使用模組時，只需添加基底樣式名稱與子模組名稱即可達到效果

### State 規則

State 主要面向 Layout 或 Module 在網頁上的種種特效及動作，概念類似於 BEM 中的 Modifier，為了保證樣式作用於對象，允許使用 `@important`，在撰寫時可參照以下規則：

- State 可套用在 Layout 或 Module 上
- 可以使用 JavaScript 改變樣式
- 提供 `is-` 前綴用以辨識此為狀態樣式
- 可以合理的使用 `!important` 覆蓋樣式

可參考以下：

```html
<ul class="nav">
  <li class="nav-item">
    <a class="nav-link is-active" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link is-disabled" href="#">Link</a>
  </li>
</ul>
```

與前面介紹的子模組樣式不同的地方在於狀態樣式不需繼承於任何對象，他就只是單純的將樣式應用於對象，你可以參考 Bootstrap 中的 `.active` 或 `.disabled` 樣式，概念就如同上面的 `is-active` 與 `is-disabled`，為了保證狀態樣式作用於指定對象，在 State 中是允許使用 `@important` 的。

### Theme 規則

Theme 主要面向網站主視覺而定義的 Layout 或 Module 樣式，你可以把它想像成 7-1 模式中的 theme，包含在不同國家 (語系) 中的樣式、字形轉變等。由於一般人的專案未必有如此規模，故此規則在項目不常使用，在撰寫時可參照以下規則：

- 直接使用 Layout 或 Module 定義的 class 覆蓋其樣式

可參考以下：

```scss
// all.css
.mod {
  border: 1px solid;
}

// themeA.css
.mod {
  border-color: blue;
}
```

這邊要注意，你不需要以獨立的 class 去添加主題樣式，在 Theme 的規則中是建議使用與原先 Layout 或 Module 同樣的樣式名稱，而 `themeA.css` 這隻檔案必定是在 `all.css` 之後才載入，這樣就可達到覆蓋樣式的目的，如果網站有很多的主題樣式，也只需要新增像是 `themeB.css` 的檔案並撰寫如下：

```scss
.mod {
  border-color: red;
}
```

之後改載入 `all.css` 與 `themeB.css` 檔案，這樣就能達到更改不同主題顏色的目的。
