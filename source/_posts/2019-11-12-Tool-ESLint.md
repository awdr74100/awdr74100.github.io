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

- Linter 的起源
- ESLint 簡介
- ESLint 安裝與配置
- ESLint 常見錯誤提示

## Linter 的起源

<img src="https://i.imgur.com/iIrYAVy.png" alt="Linter">

每個工程師都有自己的編碼習慣，最常見的操作為：

- 編寫代碼時一行不會超過 80 個字串，簡潔明瞭
- 代碼結尾必須加分號<code>;</code>，看起來比較拘謹
- 盡量使用 ES6 宣告變數，以 <code>let、const</code> 取代 <code>var</code>
- tab-width 限制為 2

仔細想想，如果團隊開發時，每個人都有自己的編碼習慣，當程式碼需要去做溝通時，會造成諸多的不順，所以在團隊通常會規範一個共同標準，每一個開發者都必須遵守，但凡事都有疏忽的時候，且一個專案大小隨便都有上萬行代碼，你難道要一行一行的檢查？凡是重複性的工作，都因該被製作成工具來節省時間成本，而這個工具需要具備以下兩點：

- 提供編碼規範，可自行訂製規則最好
- 提供自動檢測代碼程序，發現問題時，應提示用戶做處理

Linter 因而誕生。

## ESLint 簡介

<img src="https://i.imgur.com/tIU0AEj.png" alt="ESLint" width="70%">

ESLint 是眾多 JavaScript Linter 的其中一個，其優秀的支援性以及可自定義規則等功能，使他漸漸成為市場主流，其他包含 JSLint、JSHint、JSCS 等等，這些也都屬於 JS Linter，通常 Linter 大都具備以下功能：

- 編碼規範：使用單引號還是雙引號、需不需要加分號、縮排使用 space 或 tab
- 變數宣告：禁止未宣告變數直接取用，以塊級作用域而非函式作用域下宣告變數
- 無效程序：已宣告卻未使用的變數、函式，建議刪除
- 代碼測試：常見 <code>console.log</code> 行為，建議刪除

## ESLint 安裝與配置
