---
title: Sass / SCSS 預處理器 - 自建 CSS 框架中的 Grid System 與 Spacing
description:
  [
    Grid System 可說是近年來前端工程師必備的一項技能，傳統上我們都是針對特定對象撰寫 media query 以達到 RWD 的效果，但對於可維護性及結構性來說，似乎這不是個好的做法，現在我們都會直接導入像是 Bootstrap 或 Tailwind 等 CSS 框架，利用內建的 Grid System 更有效率的撰寫出網站基底的 RWD 樣式，但這邊的問題是，在不考慮使用 PurgeCSS 或針對原始碼做刪減的情況下，我們將整個框架導入進來就為了使用 Grid System 會不會有點小題大作？何不我們來開發自己的 Grid System 看看？,
  ]
categories: [SCSS]
tags: [SCSS, CSS, w3HexSchool]
date: 2020-06-24 14:19:46
updated: 2020-06-24 14:19:46
---

## 前言

Grid System 可說是近年來前端工程師必備的一項技能，傳統上我們都是針對特定對象撰寫 media query 以達到 RWD 的效果，但對於可維護性及結構性來說，似乎這不是個好的做法，現在我們都會直接導入像是 Bootstrap 或 Tailwind 等 CSS 框架，利用內建的 Grid System 更有效率的撰寫出網站基底的 RWD 樣式，但這邊的問題是，在不考慮使用 PurgeCSS 或針對原始碼做刪減的情況下，我們將整個框架導入進來就為了使用 Grid System 會不會有點小題大作？何不我們來開發自己的 Grid System 看看？

## 筆記重點

- 自建 Bootstrap 4 中的 Grid System
- 自建 Bootstrap 4 中的 Spacing

## 自建 Bootstrap 4 中的 Grid System

讓我們先來看 Bootstrap 4 中的 Grid System 是怎麼運作的：

```html
<div class="container">
  <div class="row">
    <div class="col-lg-3 col-md-6">
      <div class="box"></div>
    </div>
    <div class="col-lg-3 col-md-6">
      <div class="box"></div>
    </div>
    <div class="col-lg-3 col-md-6">
      <div class="box"></div>
    </div>
    <div class="col-lg-3 col-md-6">
      <div class="box"></div>
    </div>
  </div>
</div>
```
