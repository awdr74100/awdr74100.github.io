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
- 應盡量避免樣式依賴於結構 (低耦合概念)，嘗試使用 class 替代 htlm tag

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

[SMACSS](http://smacss.com/) 主要由 [Jonathan Snook](https://snook.ca/) 提出