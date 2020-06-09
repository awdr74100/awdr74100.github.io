---
title: Sass / SCSS 預處理器 - 依造 Sass 7-1 Pattern 構建項目
description:
  [
    前一篇說明了如何利用 @import 將 partial 檔案給載入進來，進而達到模組化的目的，但這邊有一個問題是，我們該針對那些內容來模組化呢？當初這點捆擾了我許久，直到發現原來有所謂的 Sass 7-1 Pattern 可參考，7-1 模式是構建 Sass 項目的一種流行且有效的模組化方法，由 7 個資料夾與 1 個檔案所組成，每一個資料夾都有各自實現的對象，我們可把同個實現對象但不同部分的 Sass 模組給放進去，這些模組最後都會被根目錄檔案視為 @import 對象，使之編譯成單獨的 CSS 檔案。,
  ]
categories: [SCSS]
tags: [SCSS, CSS Methodologies, w3HexSchool]
date: 2020-06-08 18:08:59
updated: 2020-06-08 18:08:59
---

## 前言

前一篇說明了如何利用 @import 將 partial 檔案給載入進來，進而達到模組化的目的，但這邊有一個問題是，我們該針對那些內容來模組化呢？當初這點捆擾了我許久，直到發現原來有所謂的 Sass 7-1 Pattern 可參考，7-1 模式是構建 Sass 項目的一種流行且有效的模組化方法，由 7 個資料夾與 1 個檔案所組成，每一個資料夾都有各自實現的對象，我們可把同個實現對象但不同部分的 Sass 模組給放進去，這些模組最後都會被根目錄檔案視為 @import 對象，使之編譯成單獨的 CSS 檔案。

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

**Abstracts 資料夾**

`abstracts/` (有些稱為 `helpers/` 或 `utils/`) 資料夾包含了整個項目中所使用到的 Sass 輔助工具，這裡存放著每一個全局變數、函數、混入與佔位符，只要是編譯後不輸出任何 CSS 的檔案都屬此類，以下參考：

- `_variables.scss`
- `_functions.scss`
- `_mixins.scss`
- `_placeholders.scss`

**Base 資料夾**

`base/` (有些稱為 `config/`) 資料夾主要放置整個網站大規模使用到的樣式設定，比如 [meyerweb](https://meyerweb.com/eric/tools/css/reset/) 或 [normalize](https://necolas.github.io/normalize.css/8.0.1/normalize.css) 版本的重製文件，又或者是一些全域套用的預設樣式，包含字行字體相關的設定也算在內，以下參考：

- `_reset.scss`
- `_typography.scss`
- `_base.scss`

**Components 資料夾**

`components/` (有些稱為 `modules/`) 資料夾存放網站某些較小可重複使用的元件，可以把它理解為 [BEM](http://getbem.com/) 中的 Block，以下參考：

- `_buttons.scss`
- `_carousel.scss`
- `_cover.scss`
- `_dropdown.scss`

**Layout 資料夾**

`layout/` 資料夾存放構建網站或者應用程序使用到的佈局部分，可以把它理解為網站的每一頁都需使用到的大型元件，常見的 `header`、`footer`、`sidebar` 就包含在此類，像是 RWD 必備的 Grid System 也算在內，以下參考：

- `_navigation.scss`
- `_grid.scss`
- `_header.scss`
- `_footer.scss`
- `_sidebar.scss`
- `_forms.scss`

**Pages 資料夾**

`pages/` 資料夾存放每一個網頁特定且零碎的樣式檔案，通常 `layout/` 與 `components` 除外的頁面樣式就包含在此類，建議將檔案名稱取做與頁面同個名稱：

- `_home.scss`
- `_contact.scss`

**Themes 資料夾**

`themes/` 資料夾存放網站中的主題顏色，如果你有設計像是 Dark Mode 的轉換效果，相關的樣式就算在此類，以下參考：

- `_theme.scss`
- `_dark.scss`

**Vendors 資料夾**

`vendors` 資料夾主要放置由外部庫或框架使用的第三方代碼，如果你必須覆蓋任何 `vendors` 的某個樣式，建議另外新增同名的檔案並放入名為 `vendors-extensions/` 的第 8 個資料夾，以下參考：

- `_bootstrap.scss`
- `_jquery-ui`

以上就是各資料夾專門放置的檔案對象，接著就是將這些檔案彙整到 `all.scss` 中，為了保持可讀性，主文件應遵守以下準則：

- 每個 `@import` 引用一個文件
- 每個 `@import` 單獨一行
- 從相同資料夾引入的檔案之間不用空行
- 從不同資料夾引入的檔案之間需用空行分隔
- 忽略文件擴展名與 `_` 前綴

Sass Guidelines 中有建議的 `@import` 順序，你可以依造他的順序，或者是自行排序，只要記住 SCSS 是由上到下進行編譯即可，最後他看起來應該像這個樣子：

```scss
@import './base/reset';
@import './base/typography';

@import './helpers/variables';
@import './helpers/functions';
@import './helpers/mixins';
@import './helpers/placeholders';

@import './layout/grid';
@import './layout/footer';
@import './layout/forms';
@import './layout/header';
@import './layout/navigation';
@import './layout/sidebar';

@import './components/buttons';
@import './components/carousel';
@import './components/cover';
@import './components/dropdown';

@import './pages/home';
@import './pages/contact';

@import './vendors/bootstrap';
@import './vendors/jquery-ui';

@import './themes/theme';
@import './themes/dark';
```

這邊做個補充，官方有提到也可使用以下方式載入元件：

<!-- prettier-ignore-start -->
```scss
@import
    './helpers/variables',
    './helpers/functions',
    './helpers/mixins',
    './helpers/placeholders';
// ...
```
<!-- prettier-ignore-end -->

這邊要強調，所謂的 7-1 模式只是提供參考用，具體上要怎麼搭，最好按項目大小來決定，如果項目規模較小，用 7-1 模式就顯得有點大材小用了，7-1 模式最重要的是它拆分模組的概念，如果了解其概念，往後在處理各種專案的樣式表時，我想應該都沒什麼問題才對。

## Sass 7-1 Pattern 實際案例
