---
title: 解析 CSS Flexbox 佈局模型
description:
  [
    在之前我一直都是使用 float、position 來排版，但當網頁元素越來越多，相對的結構也會越來越複雜，且 float 還需要搭配 clearfix 來解決塌陷等麻煩問題；到了 CSS3 時代，推出了新型的 Flexbox 佈局模式，徹底改善傳統排版繁瑣等問題，就連 Bootstrap4 都引進了，好東西！不學嗎？,
  ]
categories: [CSS]
tags: [CSS]
date: 2019-11-07 16:23:49
updated: 2020-05-08 29:58:01
---

## 前言

在之前我一直都是使用 float、position 來排版，但當網頁元素越來越多，相對的結構也會越來越複雜，且 float 還需要搭配 clearfix 來解決塌陷等麻煩問題；到了 CSS3 時代，推出了新型的 Flexbox 佈局模式，徹底改善傳統排版繁瑣等問題，就連 Bootstrap4 都引進了，好東西！不學嗎？

## 筆記重點

- Flexbox 佈局模型原理
- Flexbox 外容器相關屬性
- Flexbox 內元件相關屬性
- Flexbox 實際應用

## Flexbox 佈局模型原理

<img src="https://i.imgur.com/X1bETh4.png" alt="Flexbox 佈局模型原理">

Flexbox 主要由**外容器**與**內元件**組成，外容器可利用相關屬性**操作軸線以控制內元件位置**，內元件也可利用相關屬性**操作自身對於容器的響應變化**。

## Flexbox 外容器相關屬性

接下來開始使用 Flex 來做排版，在任何元素下將 display 設為 flex 即可包裝成 flex 容器，相對的元素下第一層項目也會包裝成 flex 子元件，而容器可配置的相關屬性如下：

- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

### flex-direction

執行操作：**控制軸線排列方向**
相關可配置屬性：

- row：預設值，從左到右，從上到下
- row-reverse：與 row 相反
- column：從上到下，從左到右
- column-reverse：與 column 相反

```scss
.container {
  display: flex;
  flex-direction: row; // row-reverse 、 column 、 column-reverse
}
```

<img src="https://i.imgur.com/kesyCMp.jpg" alt="flex-direction" >

### flex-wrap

執行操作：**控制元件超出範圍是否換行**
注意事項：**元件總寬度 > 100% = 平均分配寬度 = 不會換行**
相關可配置屬性：

- nowrap：預設值，不換行
- wrap：換行
- wrap-reverse：換行並相反排列

```scss
.container {
  display: flex;
  flex-wrap: nowrap; // wrap 、 wrap-reverse
}
```

<img src="https://i.imgur.com/F4YdUGb.png" alt="flex-wrap" >

### flex-flow

執行操作：**flex-direction 與 flex-wrap 縮寫**
相關可配置屬性：

- flex-direction 配置屬性
- flex-wrap 配置屬性

```scss
.container {
  display: flex;
  flex-flow: row wrap;
}
```

### justify-content

執行操作：**控制內元件在主軸對齊的位置**
相關可配置屬性：

- flex-start：預設值，對齊主軸起始位置
- flex-end：對齊主軸終點位置
- center：水平置中對齊
- space-between：平均分配內元件，左右元件將會與主軸起始和主軸終點貼齊
- space-around：平均分配內元件，間距也是平均分配

```scss
.container {
  display: flex;
  justify-content: flex-start; // flex-end 、 center 、 space-between 、 space-around
}
```

<img src="https://i.imgur.com/2zKnf4Q.png" alt="justify-content" width=90% >

### align-items

執行操作：**控制內元件在交錯軸對齊的位置**
相關可配置屬性：

- flex-start：對齊交錯軸起始位置
- flex-end：對齊交錯軸終點位置
- center：垂直置中對齊
- stretch：預設值，將內元件全部撐開至容器的高度
- baseline：以所有內元件的基線為對齊標準

```scss
.container {
  display: flex;
  align-items: flex-start; // flex-end 、 center 、 stretch 、 baseline
}
```

<img src="https://i.imgur.com/BRBsPMf.png" alt="align-items">

### align-content

執行操作：**控制內元件存在多行時在交錯軸對齊的位置**
注意事項：**與 align-items 有相同功能，align-content 只適用於控制多行的 flex 容器**
相關可配置屬性：

- flex-start：對齊交錯軸起始位置
- flex-end：對齊交錯軸終點位置
- center：垂直置中對齊
- space-between：將第一行與最後一行分別對齊最上方與最下方
- space-around：每行平均分配間距
- stretch：預設值，將內元件全部撐開至容器的高度

```scss
.container {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start; // flex-sne 、 center 、 space-between 、 space-around 、 stretch
}
```

<img src="https://i.imgur.com/H2n2ZpQ.png" alt="align-content">

## Flexbox 內元件相關屬性

在一般開發中，善加利用外容器的相關屬性，差不多就可以解決一般常見的網頁排版問題，如有需要更為細節的處理，就可以利用內元件的相關屬性，進行個別元件調試，內元件可配置的相關屬性如下：

- align-self
- order
- flex

### align-self

執行操作：**控制個別元件在交錯軸對齊的位置**
注意事項：**用法如同 align-items ，可針對個別元件設置交錯軸位置，並覆蓋容器原有設置**
相關可配置屬性：

- flex-start：對齊交錯軸起始位置
- flex-end：對齊交錯軸終點位置
- center：垂直置中對齊
- stretch：預設值，將內元件全部撐開至容器的高度
- baseline：以所有內元件的基線為對齊標準

```scss
.container {
  display: flex;
  align-items: center;

  .item2 {
    align-self: flex-start; // flex-end 、 center 、 stretch 、 baseline
  }
}
```

<img src="https://i.imgur.com/ihCjyki.png" alt="align-self">

### order

執行操作：**指定個別元件排列順序**
注意事項：**數字越小排序越前面，可為負數，元件預設值為 0**
相關可配置屬性：

- number：預設為 0，可為負數

```scss
.order-1 {
  order: -1;
}

.order2 {
  order: 2;
}

.order3 {
  order: 3;
}
```

<img src="https://i.imgur.com/YcVLKhk.jpg" alt="order">

### flex

執行操作：**指定個別元件利用剩餘空間進行收縮放大應用**
注意事項：**flex 是縮寫，主要由 flex-grow、flex-shrink、flex-basis 組成，如果只設定單個屬性，預設為 flex-grow**
相關可配置屬性：

- flex-grow：當外容器將總空間分配給所有內元件後，如果有剩餘空間，則依造比例將原有自身空間加上分配空間，預設值為 0
- flex-shrink：當外容器總空間小於所需分配內元件空間，指定內元件將進行收縮應用，預設值為 1
- flex-basis：元件的基準值，可使用不同的單位值，預設值為 auto

```scss
.container {
  width: 800px;
  display: flex;
}

.item {
  width: 200px;
  &--red {
    flex: 1;
  }
}
```

<img src="https://i.imgur.com/nAB5Ooe.jpg" alt="flex-grow-1">

```scss
.container {
  width: 900px;
  display: flex;
}

.item {
  width: 200px;
  &--red {
    flex: 1;
  }
  &--purple {
    flex: 2;
  }
}
```

<img src="https://i.imgur.com/A9gyBOt.png" alt="flex-grow-2">

## Flexbox 實際應用

開發應用：**navbar 導覽列**
額外說明：

- flex 子元件推擠：可使用 mr-auto 使自身右方元件向軸終點推擠
- flex 子元件換行：可使用 w-100 使元件強迫換行，前提是容器需要有設定 wrap

<iframe height="265" style="width: 100%;" scrolling="no" title="Flex Hamburger Menu" src="https://codepen.io/awdr74100/embed/zVJmqx?height=265&theme-id=dark&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/awdr74100/pen/zVJmqx'>Flex Hamburger Menu</a> by awdr74100
  (<a href='https://codepen.io/awdr74100'>@awdr74100</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
