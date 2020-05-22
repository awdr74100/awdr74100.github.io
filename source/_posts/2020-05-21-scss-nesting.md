---
title: Sass / SCSS 預處理器 - Nesting 巢狀結構與父選擇器
description:
  [
    上一次我們已經將 SCSS 的編譯環境給建立好了，接下來讓我們正式進入到語法的章節，首先介紹的是 nesting 巢狀結構與父選擇器，巢狀結構是 Sass / SCSS 最具特色的功能之一，之前我們有提到傳統 CSS 可能會發生父對象重複撰寫的問題，為了避免汙染到其他樣式，我們必須明確地寫出父子對象的關係，搞到最後才發現浪費了許多時間，如果改使用 Sass / SCSS 中的巢狀結構語法並搭配父選擇器，不僅可解決此類問題，同時也能改善傳統樣式表可讀性低落的問題。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-05-21 00:29:18
updated: 2020-05-22 00:03:28
---

## 前言

上一次我們已經將 SCSS 的編譯環境給建立好了，接下來讓我們正式進入到語法的章節，首先介紹的是 nesting 巢狀結構與父選擇器，巢狀結構是 Sass / SCSS 最具特色的功能之一，之前我們有提到傳統 CSS 可能會發生父對象重複撰寫的問題，為了避免汙染到其他樣式，我們必須明確地寫出父子對象的關係，搞到最後才發現浪費了許多時間，如果改使用 Sass / SCSS 中的巢狀結構語法並搭配父選擇器，不僅可解決此類問題，同時也能改善傳統樣式表可讀性低落的問題。

## 筆記重點

- nesting 巢狀結構
- nesting properties 巢狀屬性
- parent selector 父選擇器

## nesting 巢狀結構

讓我們先來回顧一下先前提到的問題：

```css
.list {
  display: flex;
}

.list li {
  background-color: black;
}

.list li a {
  color: white;
}
```

你不覺得這樣子很累嗎？不寫父元素又怕會汙染到其他樣式，且也不符合近年來推崇的 **DRY (Don’t Repeat Your CSS)** 與 **KISS (Keep It Simple Stupid)** 原則，何不我們嘗試使用 SCSS 來撰寫？改寫如下：

```scss
.list {
  display: flex;

  li {
    background-color: black;

    a {
      color: white;
    }
  }
}
```

此時的編譯結果為：

```css
.list {
  display: flex;
}

.list li {
  background-color: black;
}

.list li a {
  color: white;
}
```

是不是很酷？最後的結果與之前相同，但可讀性提高了不少，我們可以很明確的知道元素之間的依賴關係，日後如果更換了父元素的名稱，也不需要 `Ctrl + D` 累得半死做修改，直接更改父元素的名稱，之後再重新編譯一次即可，讓我們在試一次：

```scss
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > li {
    padding: 20px 0px;

    a {
      color: red;
    }
  }
}
```

此時的編譯結果為：

```css
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list > li {
  padding: 20px 0px;
}

.list > li a {
  color: red;
}
```

撰寫的關鍵就在於元素之間是否存有依賴關係，如果有，即把子樣式撰寫在父樣式內，就等同於子對象選擇器的撰寫目的，包含全部的 CSS 選擇器，都可以去做使用，**你不用把它想得太複雜，就只是把子對象改成巢狀結構而已**，這邊在做個補充，假設 `a` 元素內還有 `span` 元素的樣式：

```scss
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > li {
    padding: 20px 0px;

    a {
      color: red;

      span {
        color: blue;
      }
    }
  }
}
```

此時的編譯結果為：

```css
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list > li {
  padding: 20px 0px;
}

.list > li a {
  color: red;
}

.list > li a span {
  color: blue;
}
```

這邊就存在一個問題了，那就是階層數可能有點太多了，存在可讀性降低、可維護性降低、渲染效率變差等問題，並不是說 3 層結構就是極限，嚴格來講應該是盡量能避免階層數過多就避免，我們可針對上面做改寫：

```scss
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > li {
    padding: 20px 0px;

    a {
      color: red;
    }

    span {
      color: blue;
    }
  }
}
```

這樣的寫法也可以達到同樣的選染效果，前提是 `a` 元素的同層元素中並沒有 `span` 元素，在每次撰寫樣式時，盡量去思考撰寫對象真的存在必要的依賴關係嗎，避免樣式表存在不必要的需優化及效能問題。

## nesting properties 巢狀屬性

在上面我們都是針對 CSS 選擇器做巢狀結構，這邊再補充一點，假如我們正在撰寫關於 `background` 或 `font` 的樣式：

```scss
.bg-cover {
  background-image: url('..');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.font-weight-bold {
  font-size: 1em;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}
```

這樣寫確實挺正常的，但假設你是個極度追求效率的人，懶得寫這麼多的重複字樣，可以改寫如下：

```scss
.bg-cover {
  background: {
    image: url('..');
    position: center center;
    repeat: no-repeat;
    size: cover;
  }
}

.font-weight-bold {
  font: {
    size: 1em;
    weight: bold;
    family: Arial, Helvetica, sans-serif;
  }
}
```

此時的編譯結果為：

```css
.bg-cover {
  background-image: url('..');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.font-weight-bold {
  font-size: 1em;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}
```

是不是很酷？我們就只需要寫一次 `background` 或 `font` 等字樣，後面在撰寫其相關屬性即可，這邊要記得加入冒號，以告知編譯器此為子屬性並不是子對象。

雖然說這樣看似的確更方便了，但我一般不太會這樣寫，巢狀結構確實有其存在的必要，提高了其撰寫樣式表的效率，但巢狀屬性就見仁見智了，我認為可能會發生可閱讀性降低的問題，我自己是不太習慣，各位可以自己評估看看。

## parent selector 父選擇器

最後我們針對巢狀結構在做個補充，前面已經提到巢狀結構所帶來的好處了，主要解決父對象名稱大量重複的問題，但在某些情況下似乎還是無可避免，如下範例：

```scss
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > li {
    padding: 20px 0px;

    a {
      color: red;
    }

    a:hover {
      color: blue;
    }
  }
}
```

發現問題了嗎？`a` 元素還是發生名稱重複的問題了，你可能會想，這一個 `:hover` 偽類為何不寫在 `a` 元素的下個階層呢？這樣即會導致 `:hover` 被當成子對象編譯，形成 `a :hover` 的無意義宣告，我們要的是 `a:hover` 的結果阿！此時我們就可使用 Sass / SCSS 名為父選擇器的 `&` 符號解決此問題，如下範例：

```scss
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > li {
    padding: 20px 0px;

    a {
      color: red;

      &:hover {
        color: blue;
      }
    }
  }
}
```

`&` 符號可把父對象連接在一起，類似字串相加的概念，被連接的對象編譯的階層就會與父對象同層，此時的編譯結果為：

```css
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list > li {
  padding: 20px 0px;
}

.list > li a {
  color: red;
}

.list > li a:hover {
  color: blue;
}
```

大功告成！看起來代碼的簡潔性又提升了不少，讓我們在試一次：

```scss
.list {
  display: flex;

  &__item {
    color: red;

    &--active {
      color: blue;
    }
  }
}
```

這是一個基本的 [BEM](http://getbem.com/) 結構，這邊先不用理解 BEM 是什麼，之後會有單獨的文章做介紹，此時的編譯結果為：

```css
.list {
  display: flex;
}

.list__item {
  color: red;
}

.list__item--active {
  color: blue;
}
```

由於 `&__item` 與 `&--active` 都使用了父選擇器，故最後的編譯結果都與 `.list` 同階層，這應該蠻好理解的，在實務中，我也很常使用此技法來撰寫樣式，可有效提升其閱讀性。
