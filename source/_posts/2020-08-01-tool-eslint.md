---
title: 導入 ESLint 控管程式碼品質
description:
  [
    初期在寫 JavaScript 代碼時，都是以學習心態去完成目標，程式碼的品質較為不穩定，但到了業界，通常需要配合團隊開發專案規範，其中也包含了代碼規範，ESLint 就是 JavaScript 的代碼規範工具，他可以讓你維持一定的程式碼品質，敲代碼的同時也可以進行觀念的修正。,
  ]
categories: [Tools]
tags: [JavaScript, ESLint, w3HexSchool]
date: 2020-08-01 12:36:42
updated: 2020-08-02 22:13:03
---

## 前言

初期在寫 JavaScript 代碼時，都是以學習心態去完成目標，程式碼的品質較為不穩定，但到了業界，通常需要配合團隊開發專案規範，其中也包含了代碼規範，ESLint 就是 JavaScript 的代碼規範工具，他可以讓你維持一定的程式碼品質，敲代碼的同時也可以進行觀念的修正。

## 筆記重點

- 什麼是 Linter ？
- ESLint 簡介
- ESLint 安裝及使用
- ESLint 配置規則

## 什麼是 Linter ？

<img src='https://i.imgur.com/exYojAl.jpg'>

每個開發者都有自己的編碼習慣，最常見的操作為：

- 編寫代碼時一行不會超過 80 個字串，簡潔明瞭
- 代碼結尾必須加分號，看起來比較拘謹
- 盡量使用 ES6 宣告變數，以 `let`、`const` 取代 `var`
- tab-width 限制為 2

也因為這種習慣，當進行多人開發時，會造成諸多的不順，所以通常團隊間會規範一個共同標準，每一個開發者都必須遵守，但凡事都有疏忽的時候，且一個專案大小隨便都有上萬行代碼，你難道要一行一行的檢查？**凡是重複性的工作，都因該被製作成工具來節省時間成本**，而這個工具通常需要具備以下兩點：

- 提供編碼規範，可自行訂製規則最好
- 提供自動檢測代碼程序，發現問題時，應提示用戶做處理

Linter 就是負責處理此問題的工具，利用**靜態代碼分析**即可完成檢測，不需要進行任何 Script 動作。

## ESLint 簡介

<img src="https://i.imgur.com/tIU0AEj.png" alt="ESLint" width="70%">

ESLint 是眾多 JavaScript Linter 的其中一個，其優秀的支援性以及可自定義規則等功能，使他漸漸成為市場主流，其他包含 JSLint、JSHint、JSCS 等等，這些也都屬於 JS Linter，通常 Linter 大都具備以下功能：

- 編碼規範：使用單引號還是雙引號、需不需要加分號、縮排使用 space 或 tab
- 變數宣告：禁止未宣告變數直接取用，以塊級作用域而非函式作用域下宣告變數
- 無效程序：已宣告卻未使用的變數、函式，建議刪除
- 代碼測試：`alert`、`console` 行為，建議刪除

## ESLint 安裝及使用

> 安裝環境：[Node.js](https://nodejs.org/en/) >= 6.14、[npm](https://nodejs.org/en/) 3+
> 相關插件：[ESLint](https://github.com/Microsoft/vscode-eslint) for VSCode

使用 npm 全域安裝 ESLint：

```shell
$ npm install eslint -g
```

使用 VSCode 安裝 ESLint 擴展：

- 切換至 Extensions，搜尋並安裝 ESLint

專案目錄建立 package.json：

```shell
$ npm init
```

初始化 ESLint 項目：

```shell
$ eslint --init
```

<img src='https://i.imgur.com/p8jgDqT.gif' alt="eslint初始化" width="100%">

自動檢測代碼並提示：

<img src='https://i.imgur.com/gRwK5AV.jpg' alt='eslint插件'>

根據提示修改代碼：

安裝步驟大致上就到這邊，接下來就是依造他所發現的錯誤，做出修正，在初期錯誤可能會有點多，不過沒關係，大多問題都有提示，不會說太困難。常見提示為：

- `Unary operator '++' used`
  <!-- ：建議使用 i += 1 取代 i++ -->
- `Expected '===' and instead saw '=='`
  <!-- ：建議使用 === 取代 == -->
- `'object' is never reassigned. Use 'const' instead`
  <!-- ：不會更動的變數請用 const 宣告 -->
- `'fun' was used before it was defined`

## ESLint 配置規則

> 配置檔案：/.eslintrc.js
> 可配置規則：[規則列表](https://eslint.org/docs/rules/)

```js
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-alert': 0,
    'no-console': [2, { allow: ['warn'] }],
    'eol-last': 2,
    eqeqeq: [0, 'smart'],
  },
};
```

如果想要自行配置規則，可參考官方規則列表自行定義，主要有三部分須配置：

- 規則名稱：no-alert、eqeqeq、eol-last 等等
- 規則狀態：0 = off、1 = warn、2 = error
- 可配置選項：部分規則可更改預設觸發模式，可經由此選項做更改
