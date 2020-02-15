---
title: 在 Windows 環境下使用 nvm 管控 NodeJS
description:
  [
    當初在學習 ES6 Modules 相關語法時，主要得依靠 Babel 編譯才能在 Node.js 中運行，原因為 Node.js 預設是使用 CommonJS 模組規範，事實上，大可不必這麼麻煩，Node.js 原生是支援 ES6 Modules 模組規範的，只不過得透過一些設定才能使之切換，且不同版本有各自的切換方法。本篇將結合 nvm (Node Version Manager) 共同介紹，說明該如何使用 nvm 安裝 Node.js，以及透過指令切換不同的 Node.js 版本，在不同版本下透過設定切換當前模組規範。,
  ]
categories: [NodeJS]
tags: [Node.js]
date: 2020-02-15 15:16:09
---

## 前言

當初在學習 ES6 Modules 相關語法時，主要得依靠 Babel 編譯才能在 Node.js 中運行，原因為 Node.js 預設是使用 CommonJS 模組規範，事實上，大可不必這麼麻煩，Node.js 原生是支援 ES6 Modules 模組規範的，只不過得透過一些設定才能使之切換，且不同版本有各自的切換方法。本篇將結合 nvm (Node Version Manager) 共同介紹，說明該如何使用 nvm 安裝 Node.js，以及透過指令切換不同的 Node.js 版本，在不同版本下透過設定切換當前模組規範。

## 筆記重點

- nvm 介紹
- nvm 安裝
- nvm 基本使用
- 切換 Node.js 模組規範環境

## nvm 介紹

nvm 全名為 Node Version Manager，主要用來控管 Node.js 版本，透過輸入指令的方式，即可切換當下的 Node.js 版本，有別於以往透過官方下載造成的版本綁定，使用 nvm 可快速的在本機切換 Node.js 版本，方便進行測試，強烈建議所有開發者放棄使用官方下載，改而使用 nvm 下載 Node.js。

## nvm 安裝

nvm 在不同系統中有對應的安裝工具，分別如下：

- Windows 用戶：[nvm-windows](https://github.com/coreybutler/nvm-windows)
- Mac OS、Linux 用戶：[nvm](https://github.com/nvm-sh/nvm)

如果曾經透過官方下載 Node.js，請先執行以下動作：

- 將 Node.js 完整移除
- 將 `npm` 資料夾徹底移除(預設位置：`C：\users\userName\AppData\Roaming\npm`)

---

由於筆者本身是使用 Windows 系統，下面介紹將會以此環境為主。

首先從 [此處](https://github.com/coreybutler/nvm-windows/releases) 找到「**nvm-setup.zip**」下載並安裝，過程如同安裝一般程式，一路 **Next** 就對了！

<img src="https://i.imgur.com/X994OQW.png" alt="nvm-setup">

安裝完成後，可輸入 `nvm` 查看相關可用指令，如下圖所示：

<img src="https://i.imgur.com/RZfLlGA.png" alt="nvm-order" />
