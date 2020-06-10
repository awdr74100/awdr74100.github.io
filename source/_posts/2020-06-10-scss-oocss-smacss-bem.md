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
- BEM
