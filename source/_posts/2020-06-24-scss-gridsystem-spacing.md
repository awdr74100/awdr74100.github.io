---
title: Sass / SCSS 預處理器 - 自建 CSS 框架中的 Grid System 與 Spacing
description:
  [
    Grid System 可說是近年來前端工程師必備的一項技能，傳統上我們都是針對特定對象撰寫 media query 以達到 RWD 的效果，但對於可維護性及結構性來說，似乎這不是個好的做法，現在我們都會直接導入像是 Bootstrap 或 Tailwind 等 CSS 框架，利用內建的 Grid System 更有效率的撰寫出網站基底的 RWD 樣式，但這樣的問題是，在不考慮使用 PurgeCSS 或針對原始碼做刪減的情況下，我們將整個框架導入進來就為了使用 Grid System 會不會有點小題大作？不如我們自己來開發 Grid System 吧！,
  ]
categories: [SCSS]
tags: [SCSS, CSS, w3HexSchool]
date: 2020-06-24 14:19:46
updated: 2020-06-24 14:19:46
---

## 前言

Grid System 可說是近年來前端工程師必備的一項技能，傳統上我們都是針對特定對象撰寫 media query 以達到 RWD 的效果，但對於可維護性及結構性來說，似乎這不是個好的做法，現在我們都會直接導入像是 Bootstrap 或 Tailwind 等 CSS 框架，利用內建的 Grid System 更有效率的撰寫出網站基底的 RWD 樣式，但這樣的問題是，在不考慮使用 PurgeCSS 或針對原始碼做刪減的情況下，我們將整個框架導入進來就為了使用 Grid System 會不會有點小題大作？不如我們自己來開發 Grid System 吧！

## 筆記重點

- Grid System 建立及原理說明
- Spacing 建立及原理說明

## Grid System 建立及原理說明

讓我們先來看 Bootstrap 4 中的 Grid System 是如何運作的：

```html
<div class="container">
  <div class="row">
    <div class="col-md-3 col-6">
      <div class="box"></div>
    </div>
    <div class="col-md-3 col-6">
      <div class="box"></div>
    </div>
    <div class="col-md-3 col-6">
      <div class="box"></div>
    </div>
    <div class="col-md-3 col-6">
      <div class="box"></div>
    </div>
  </div>
  <div class="row no-gutters">
    <div class="col-6">
      <div class="box"></div>
    </div>
    <div class="col-6">
      <div class="box"></div>
    </div>
  </div>
</div>
```

Bootstrap 在 v3 版本是使用 LESS 進行開發，當時的 Grid System 是以 `float` 撰寫而成，有用過 `float` 排版的人應該都知道其中的缺陷有多嚴重，而到了 v4 版本則是使用 Sass 進行開發，並且使用了 `flexbox` 進行排版，這邊 `.row` 其實就是指 `flexbox` 控制子項目的父容器，`.container` 主要用來解決 `.row` 溢出問題及限制容器大小，`.col-*` 就是前面所指的子項目，有玩過 Bootstrap 的人應該都很熟悉了才對，在開發屬於我們自己的 Grid System 之前，請先設置 CSS Reset 及 `box-sizing`：

<!-- prettier-ignore-start -->
```scss
html, body {
  margin: 0;
  padding: 0;
}

*, *:before, *:after {
  box-sizing: border-box;
}
```
<!-- prettier-ignore-end -->

設置 `border-box` 的目的主要是讓我們在計算對象的大小時更為直覺，我想這應該是基本的概念了，就不多加以說明，接著我們來看 Grid System 是如何構建的：

<div class="note warning">以下都是先以 Bootstrap 預設的 12 欄式排版做設計</div>

```scss
.container {
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;
}

.col-6 {
  position: relative;
  max-width: 50%;
  flex: 0 0 50%;
  padding-left: 15px;
  padding-right: 15px;
}
```

製作 Grid System 最重要的就是 Gutter 的概念，所謂的 Gutter 就是指 `.col-*` 對象之間的間距，為了避免最左及做右邊的 Gutter 出現擠壓問題，我們必須在 `.row` 設置 `margin` 負值將容器給往外擴，這時會造成內容大小超出瀏覽器可視大小問題，進而導致 x 軸的產生，這對於 RWD 來說可是大忌，我們必須在 `.container` 設置 `padding` 將這一個負值補回，這就是我前面提到的 `.container` 不只可用來限制容器大小，還可用來將溢出的空間給補回，讓我們來看目前的效果如何：

![格線系統範例 - 1](https://i.imgur.com/amWAcCl.png)

這邊我新增了 `.box` 樣式用以凸顯 Grid System 在畫面中呈現的感覺，你會發現與 Bootstrap 的結果是一模一樣的，目前我們只有撰寫 `.col-6` 樣式，代表只能完成兩欄式的排版，如果有其他欄式的要求，可分別在撰寫對應的對象：

```scss
.col-2 {
  position: relative;
  max-width: 16.66667%;
  flex: 0 0 16.66667%;
  padding-left: 15px;
  padding-right: 15px;
}

.col-3 {
  position: relative;
  max-width: 25%;
  flex: 0 0 25%;
  padding-left: 15px;
  padding-right: 15px;
}
```

上面我們都是基於 CSS 撰寫而成，通常我在建立 Grid System 時都會搭配 CSS 預處理器做開發，原因很簡單，不覺得一個一個撰寫對應的樣式很慢嗎？而且寬度都還要自己計算，想想就累，如果你有看我之前寫的 Sass 系列文章，此時你應該知道怎麼做了才對，參考以下範例：

```scss
$gutter-width: 30px;
$grid-sum: 12;

.container {
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: $gutter-width / 2;
  padding-right: $gutter-width / 2;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -($gutter-width / 2);
  margin-right: -($gutter-width / 2);
}

@for $var from 1 through $grid-sum {
  .col-#{$var} {
    position: relative;
    max-width: 100% * ($var / $grid-sum);
    flex: 0 0 (100% * ($var / $grid-sum));
    padding-left: $gutter-width / 2;
    padding-right: $gutter-width / 2;
  }
}
```

這邊我們順便把 Gutter 的寬度及 Grid 的總數設置成一個變數方便日後做更改，不覺得這樣快很多嗎？寬度我們也不需要自己計算，對應的 `.col-*` 對象全靠 `@for` 迴圈來生成就好了，到這邊我們的 Grid System 就完成一半了，結果如下：

![格線系統範例 - 1](https://i.imgur.com/Kopi695.png)
