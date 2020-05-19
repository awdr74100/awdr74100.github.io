---
title: Sass / SCSS 預處理器 - 基本介紹與編譯環境建立
description:
  [
    在之前介紹的各種前端工具中，都是使用 SCSS 最為樣式表的開發對象，原因很簡單，那就是它大幅加強了 CSS 對各種操作的支持，以往我們會認為 CSS 很單調，也因為太單調，導致存在許多操作上的不便，但現在我們有了 Sass / SCSS 等 CSS 預處理器可以選擇，真正意義上的將樣式表變為一門程式語言，可使用變數、函式、迴圈等程式語言基本就具備的功能達到撰寫樣式表的目的。此篇將從何謂 CSS 預處理器開始做介紹，接著說明 Sass / SCSS 該如何透過相關工具使之編譯成 CSS 跑在瀏覽器上。,
  ]
categories: [SCSS]
tags: [SCSS, w3HexSchool]
date: 2020-05-18 20:56:33
updated: 2020-05-18 20:56:33
---

## 前言

在之前介紹的各種前端工具中，都是使用 SCSS 最為樣式表的開發對象，原因很簡單，那就是它大幅加強了 CSS 對各種操作的支持，以往我們會認為 CSS 很單調，也因為太單調，導致存在許多操作上的不便，但現在我們有了 Sass / SCSS 等 CSS 預處理器可以選擇，真正意義上的將樣式表變為一門程式語言，可使用變數、函式、迴圈等程式語言基本就具備的功能達到撰寫樣式表的目的。此篇將從何謂 CSS 預處理器開始做介紹，接著說明 Sass / SCSS 該如何透過相關工具使之編譯成 CSS 跑在瀏覽器上。

## 筆記重點

- 什麼是 CSS 預處理器？
- Sass 和 SCSS 有什麼區別？
- 編譯環境建立 - 使用官方 sass 套件
- 編譯環境建立 - 使用 VSCode 的 Live Sass Compiler 套件

## 什麼是 CSS 預處理器？

讓我們先來看傳統的 CSS 樣式表：

```css
.menu {
  display: flex;
}

.menu li {
  padding: 0px 20px;
}

.menu li a {
  color: red;
}

.menu li a:hover {
  color: blue;
}
```

是不是都有過類似的經驗？有時候我們確實會遇到以上的情境，受限於單個樣式只能寫在獨立的區塊，造成樣式名稱大量重複的問題，如果能在不修改 CSS 選擇器達到樣式名稱不重複效果該有多好呢？讓我們來看下個例子：

```css
h1 {
  color: #2e2ecf;
}

h2 {
  color: #2e2ecf;
}

h3 {
  color: #2e2ecf;
}
```

這也是很常見的案例，在多個元素中套用了相同的樣式，假入我們今天要修改網站統一的樣式呢？我以前的做法是先選取 `#2e2ecf` 對象，之後 `Ctrl + D` 一路給他按下去，最後統一做修改，但這時會遇到的問題是，有些 `#2e2ecf` 對象我可不想做修改阿！如果不小心修改到，還得使用 `Ctrl + Z` 進行回復，想想就覺得麻煩，如果能像一般程式語言設置一個變數，之後只需要針對這個變數做修改，該有多好呢？讓我們來看下個例子：

```css
.text-primary {
  color: blue;
}

.text-danger {
  color: red;
}

.text-warning {
  color: yellow;
}
```

有時為了符合 [OOCSS](http://oocss.org/) 的概念，我們會撰寫專門用於外觀的樣式，達到結構與樣式分離的效果，但單純用 CSS 來完成的話，真的是挺累人的，結構的名稱你都必須自己手打出來，如果能使用類似迴圈的語法將歸納在陣列的樣式給讀取出來，這該有多好呢？

經過了以上種種的問題，我們可以歸咎出一個結論，那就是 CSS 的撰寫方式實在是太單調了，單調對於初學者來說確實是好事，只需要記住幾個原則，即可快樂的進行開發，但相對的隨著你的程度提升，當你開發較有規模的專案時，就會顯得 CSS 綁手綁腳，永遠都只有那一套規則，缺少了程式語言那靈活的操作，此時 CSS 預處理器因此而誕生。

簡單來講，CSS 預處理器是一個須透過編譯器使之編譯成 CSS 的程式語言，有沒有發現到關鍵字？程式語言！CSS 預處理器就是一門程式語言，我們可以使用程式語言的特性來完成撰寫樣式表的目的，簡直完美，且最後編譯出來的檔案就是 CSS，也不存在所謂 Browser 不支援此語言的問題，

到這邊，你只需要對 CSS 預處理器有一個基本認知就是它是程式語言，這樣就好，讓我們繼續看下去。

## Sass 和 SCSS 有什麼區別？

目前我們已經知道 CSS 預處理器是什麼東西了，但它總該有個對象名稱吧？沒錯，CSS 預處理器只是個統稱，目前常見的 Sass / SCSS、Less、Stylus 等，這些都是所謂的 CSS 預處理器，那這時你可能就會問了，我該選擇哪一個 CSS 預處理器？你可以反問你自己，你看過哪一個 CSS 預處理器？是不是只有 Sass / SCSS 這個選項？目前 Sass / SCSS 也是最紅的，比例非常的懸殊，我也推薦你直接學 Sass / SCSS，那這邊就又有一個問題了，Sass 與 SCSS 是一樣的東西嗎？感覺他們好像常常被混為一談？

Sass / SCSS 本質上是一樣的東西，差別在於其兩者語法結構的不同，讓我們直接來看範例：

- SCSS 語法結構：

```scss
.list {
  display: flex;
}
```

- Sass 語法結構：

```sass
.list
  display: flex
```

SCSS 是較新的版本 (`Sassy CSS`、`Sass 3`、副檔名為 `*.scss`)，Sass 是較舊的版本 (如同 `HTML` 的 `Pug` 預處理器，具備不使用大括弧格式、使用縮排，副檔名為 `*.sass`)，如果你問我要選擇哪個，我會毫不猶豫推薦你 SCSS，原因很簡單，它的學習曲線相對較緩，從上面的範例可以看出，你甚至將原本的 `*.css` 檔案更改為 `*.scss` 也不會有任何問題，兩者的語法是一模一樣的，SCSS 就是在原本的 CSS 增加程式語言的基礎形成的預處理器，故之後的介紹都會是以 SCSS 為主。

目前我們已經了解何謂 CSS 預處理器，也了解 Sass 與 SCSS 的差別，這邊還有一個重點是，所有的 CSS 預處理器都得透過編譯器使之編譯成 CSS 才能供 HTML 引入，不然 Browser 是無法識別這個東西的，接下來我們就來建立預處理器的編譯環境吧！

## 編譯環境建立 - 使用官方 sass 套件

新增基本的專案環境：

```plain
project/
│
├─── scss/
│   │
│   └─── all.scss
│
└─── index.html
```

我們先來測試 SCSS 是否能正確被 HTML 識別：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="scss/all.scss" />
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

此時會跳出：

![HTML 無法解析 .scss 的文件](https://i.imgur.com/qeMvDOK.png)

如同我們之前所說，HTML 是無法解析 `*.scss` 文件的，任何的 CSS 預處理器都得透過編譯器使之編譯成 CSS 才能被正確解析，接著使用以下指令安裝官方的 Sass / SCSS 編譯器：

```bash
npm install sass -g
```

檢查是否成功安裝：

```bash
sass --version
```

此篇文章並不會介紹 SCSS 的相關語法，這會等到之後再做專門的介紹，請先複製以下代碼至 `all.scss` 內：

```scss
$primary: blue;

.text-primary {
  color: $primary;
}
```

使用以下指令編譯 `all.scss` 檔案：

```bash
sass .\scss\all.scss .\css\all.css
```

上面這道指令指的是編譯 `.\scss\all.scss` 檔案到 `.\css\all.css` 內，不存在及建立，此時就會生成編譯好的 `all.css` 檔案：

```diff
 project/
 │
+├─── css/
+│   │
+│   ├─── all.css
+│   └─── all.css.map
 │
 ├─── scss/
 │   │
 │   └─── all.scss
 │
 └─── index.html
```

`all.css` 的檔案內容為：

```css
.text-primary {
  color: blue;
}
```

恭喜你已經完成編譯環境的建立了，就是這麼簡單，我們可在 `all.scss` 任意撰寫 SCSS 的內容，最後透過指令編譯成實體的 CSS 檔案，如果你嫌每次都要輸入指令太麻煩，可以傳遞 `--watch` 參數：

```bash
sass  --watch .\scss\all.scss .\css\all.css
```

這樣它就會監聽指定的檔案，如有任何更動即自動編譯，有些人可能已經注意到 `.map` 檔案的生成了，沒錯，官方套件預設就會幫我們生成 SourceMap，方便除錯用，關於官方套件的說明，差不多就到這邊，你可以自己去玩看看它每個參數的作用，基本上它就只是用來編譯 Sass / SCSS 的工具罷了。
