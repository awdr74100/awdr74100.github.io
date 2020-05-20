---
title: Sass / SCSS 預處理器 - Nesting 巢狀結構
description:
  [
    上一次我們已經將 SCSS 的編譯環境給建立好了，接下來讓我們正式進入到 SCSS 語法的章節，第一個介紹的是 nesting 巢狀結構，這也是 Sass / SCSS 最強大的功能之一，上一次我們有提到傳統 CSS 可能會發生樣式名稱大量重複的問題，明明就只是要指定子元素，我們卻要寫一堆 CSS 選擇器，寫到最後心都累了，如果改使用 Sass / SCSS 中的巢狀結構語法，即可解決此類的問題。,
  ]
categories: [SCSS]
tags: [SCSS]
date: 2020-05-21 00:29:18
updated: 2020-05-21 00:29:18
---

## 前言

上一次我們已經將 SCSS 的編譯環境給建立好了，接下來讓我們正式進入到 SCSS 語法的章節，第一個介紹的是 nesting 巢狀結構，這也是 Sass / SCSS 最強大的功能之一，上一次我們有提到傳統 CSS 可能會發生樣式名稱大量重複的問題，明明就只是要指定子元素，我們卻要寫一堆 CSS 選擇器，寫到最後心都累了，如果改使用 Sass / SCSS 中的巢狀結構語法，即可解決此類的問題。

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

你不覺得這樣子很累嗎？不寫父元素又怕會汙染到其他樣式，且也不符合近年來推崇的 **DRY (Don’t Repeat Your CSS)** 與 **KISS (Keep It Simple Stupid)** 原則，何不我們嘗試使用 SCSS 來撰寫？改寫為如下：

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

是不是很酷？最後的結果與之前相同，但可讀性提高了不少，我們可以很明確的知道元素之間的依賴關係，日後如果更換了父元素的名稱，也不需要 `Ctrl + D` 累得半死，直接更改父元素的名稱，之後再做編譯即可，讓我們在試一次：

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

撰寫的關鍵就在於元素之間是否存有依賴關係，如果有，即把子樣式撰寫在父樣式內，就等同於子對象選擇器的撰寫目的，包含全部的 CSS 選擇器，都可以去做使用，你不用把它想得太複雜，就只是把子對象改成巢狀結構而已，這邊在做個補充，假設 `a` 元素內還有 `span` 元素的樣式：

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

這樣的寫法也可以達到同樣的選染效果，前提是 `a` 元素的同層元素中並沒有 `span` 元素，在每次撰寫樣式時，盡量去思考撰寫對象真的存在必要的依賴關係嗎，避免樣式表存在不必要的優化及效能問題。
