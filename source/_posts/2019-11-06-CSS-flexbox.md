---
title: 解析 CSS Flexbox 佈局模型
date: 2019-11-06 16:23:49
description:
categories:
  - CSS
tags:
  - CSS
---

## 前言

在之前我一直都是使用 float、position 來排版，但當網頁元素越來越多，相對的結構也會越來越複雜，且 float 還需要搭配 clearfix 來解決塌陷等麻煩問題；到了 CSS3 時代，推出了新型的 Flexbox 佈局模式，徹底改善傳統排版繁瑣等問題，就連 Bootstrap4 都引進了，好東西！不學嗎？

<!-- more -->

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
  flex-direction: row; // row 、 row-reverse 、 column 、 column-reverse
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
  flex-wrap: nowrap; // nowrap 、 wrap 、 wrap-reverse
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
  justify-content: flex-start; // flex-start 、 flex-end 、 center 、 space-between 、 space-around
}
```

<img src="https://i.imgur.com/2zKnf4Q.png" alt="flex-wrap" width=90% >

### align-items

執行操作：**控制內元件在交錯軸對齊的位置**
相關可配置屬性：

- flex-start：預設值，對齊交錯軸起始位置
- flex-end：對齊交錯軸終點位置
- center：垂直置中對齊
- stretch：預設值，將內元件全部撐開至容器的高度
- baseline：以所有內元件的基線為對齊標準
