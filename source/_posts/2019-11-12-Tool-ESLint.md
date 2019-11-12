---
title: ESLint 程式碼品質控管工具
date: 2019-11-12 13:35:53
description:
categories:
  - Tools
tags:
  - ESlint
  - JavaScript
---

## 前言

初期在寫 JavaScript 代碼時，都是以學習心態去完成目標，程式碼的品質較為不穩定，但到了業界，通常需要配合團隊開發專案規範，其中也包含了代碼規範，ESLint 就是 JavaScript 的代碼規範工具，他可以讓你維持一定的程式碼品質，敲代碼的同時也可以進行觀念的修正。

<!-- more -->

## 筆記重點

- ESLint 簡介
- ESLint 如何幫助我開發？
- ESLint 安裝與配置
- ESLint 常見錯誤提示

## ESLint 簡介

<img src="https://miro.medium.com/max/888/1*adPg-Z859DytSea5oLARGg.png" alt="ESLint" width="70%">

事實上，ESLint 只是眾多 JavaScript Linter 中的其中一個，但其優秀的支援度以及可完全自訂規則等特點，使他漸漸成為市場主流；初期導入 ESLint 時，保證會有滿滿的挫折感，整個專案都是錯誤提示， ESLint 從開始到放棄...

<img src="https://i.imgur.com/Cos4N4q.gif" alt='ESLint error message' width="90%">

## ESLint 如何幫助我開發？

在這邊我要強調，**ESLint 並不是以約束為出發點，他是以改善為出發點**，利用**靜態**語法分析，代表說不需執行相關的 Script 操作，即可針對程式碼做改善提示，常見的提示為：






