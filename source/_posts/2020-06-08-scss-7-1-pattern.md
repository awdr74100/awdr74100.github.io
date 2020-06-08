---
title: Sass / SCSS 預處理器 - 遵循 Sass 7-1 Pattern 構建項目
description:
  [
    前一篇說明了如何利用 @import 將 partial 檔案給載入進來，進而達到模組化的目的，但這邊有一個問題是，我們該針對那些內容來模組化呢？當初這點捆擾了我許久，直到發現有所謂的 Sass 7-1 Pattern 可遵循，7-1 Pattern 是構建 Sass 項目的一種流行且有效的模組化方法，由 7 個資料夾與 1 個檔案所組成，每一個資料夾都有各自實現的對象，我們可把同個實現對象但不同部分的 Sass 模組給放進去，這些模組最後都會被根目錄檔案做為 @import 對象，使之編譯成單獨的 CSS 檔案。,
  ]
categories: [SCSS]
tags: [SCSS, CSS Methodologies, w3HexSchool]
date: 2020-06-08 18:08:59
updated: 2020-06-08 18:08:59
---

## 前言

前一篇說明了如何利用 @import 將 partial 檔案給載入進來，進而達到模組化的目的，但這邊有一個問題是，我們該針對那些內容來模組化呢？當初這點捆擾了我許久，直到發現有所謂的 Sass 7-1 Pattern 可遵循，7-1 Pattern 是構建 Sass 項目的一種流行且有效的模組化方法，由 7 個資料夾與 1 個檔案所組成，每一個資料夾都有各自實現的對象，我們可把同個實現對象但不同部分的 Sass 模組給放進去，這些模組最後都會被根目錄檔案做為 @import 對象，使之編譯成單獨的 CSS 檔案。

## 筆記重點

- Sass 7-1 Pattern 介紹
- Sass 7-1 Pattern 實際案例

## Sass 7-1 Pattern 介紹

Sass 7-1 Pattern 主要由國外開發者 [Hugo Giraudel](https://hugogiraudel.com/) 在廣為流傳的 [Sass Guidelines](https://sass-guidelin.es/) 所提出，其架構主要由 7 個文件夾與 1 個檔案所組成，他看起來像這個樣子：

```plain
scss/
│
├─── abstracts/
│   │
│   ├─── _variables.scss
│   ├─── _functions.scss
│   ├─── _mixins.scss
│   └─── _placeholders.scss
│
├─── base/
│   │
│   ├─── _reset.scss
│   ├─── _typography.scss
│   └─── ...
│
├─── components/
│   │
│   ├─── _buttons.scss
│   ├─── _carousel.scss
│   ├─── _cover.scss
│   ├─── _dropdown.scss
│   └─── ...
│
├─── layout/
│   │
│   ├─── _navigation.scss
│   ├─── _grid.scss
│   ├─── _header.scss
│   ├─── _footer.scss
│   ├─── _sidebar.scss
│   ├─── _forms.scss
│   └─── ...
│
├─── pages/
│   │
│   ├─── _home.scss
│   ├─── _contact.scss
│   └─── ...
│
├─── themes/
│   │
│   ├─── _theme.scss
│   ├─── _dark.scss
│   └─── ...
│
├─── vendors/
│   │
│   ├─── _bootstrap.scss
│   ├─── _jquery-ui.scss
│   └─── ...
│
└─── all.scss
```

其中每個資料夾代表的意義為：

**Abstracts**

`abstracts/` (有些稱為 `helpers/` 或 `utils/`) 資料夾包含了整個項目中所使用到的 Sass 輔助工具，這裡存放著每一個全局變數、函數、混入與佔位符，只要是編譯後不輸出任何 CSS 的檔案都屬此類，以下參考：

- `_variables.scss`
- `_functions.scss`
- `_mixins.scss`
- `_placeholders.scss`

**Base**

`base/` (有些稱為 `config/`) 資料夾主要放置整個網站大規模使用到的樣式設定，比如 [meyerweb](https://meyerweb.com/eric/tools/css/reset/) 或 [normalize](https://necolas.github.io/normalize.css/8.0.1/normalize.css) 版本的重製文件，又或者是一些全域套用的預設樣式，包含字行字體相關的設定也算在內，以下參考：

- `_reset.scss`
- `_typography.scss`
- `_base.scss`

**Components**

`components/` (有些稱為 `modules/`) 資料夾存放網站某些較小可重複使用的元件，可以把它理解為 [BEM](http://getbem.com/) 中的 Block，以下參考：

- `_buttons.scss`
- `_carousel.scss`
- `_cover.scss`
- `_dropdown.scss`

**Layout**

`layout/` 資料夾存放構建網站或者應用程序使用到的佈局部分，可以把它理解為網站的每一頁都需使用到的大型元件，常見的 `header`、`footer`、`sidebar` 就包含在此類，像是 RWD 必備的 Grid System 也包含在內，以下參考：

- `_navigation.scss`
- `_grid.scss`
- `_header.scss`
- `_footer.scss`
- `_sidebar.scss`
- `_forms.scss`

**Pages**

`pages/` 資料夾存放每一個網頁特定且零碎的樣式檔案，通常 `layout/` 與 `components` 除外的頁面樣式就包含在此類，建議將檔案名稱取做為樣式作用的頁面名稱：

- `_home.scss`
- `_contact.scss`


**Themes**

`themes/` 資料夾存放網站中的主題顏色，如果你有設計像是 Dark Mode 的轉換效果，相關的樣式就是算在此類，以下參考：

- `_theme.scss`
- `_dark.scss`

**Vendors**

`vendors`