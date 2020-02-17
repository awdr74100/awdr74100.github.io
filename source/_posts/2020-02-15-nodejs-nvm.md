---
title: 在 Windows 環境下使用 nvm 管控 NodeJS
description:
  [
    nvm 全名為 Node Version Manager，是一套用來管理 Node.js 版本的工具，在現代開發中，我們很常導入現有的 npm 套件幫助開發，像是 Webpack、Gulp、Browserify 等等，而這些套件都得依靠 Node.js 環境才能運行，且由於版本的差異，可能會造成無法運行的錯誤，開發者須同時擁有多個 Node.js 版本才方便進行測試，有別於以往 Node.js 下載安裝檔造成版本的綁定，使用 nvm 可同時存在多個 Node.js 版本，使用簡單的指令即可切換版本，推薦給所有的 Node.js 開發者。,
  ]
categories: [Node.js]
tags: [Node.js]
date: 2020-02-15 15:16:09
updated: 2020-02-16 23:56:24
---

## 前言

nvm 全名為 Node Version Manager，是一套用來管理 Node.js 版本的工具，在現代開發中，我們很常導入現有的 npm 套件幫助開發，像是 Webpack、Gulp、Browserify 等等，而這些套件都得依靠 Node.js 環境才能運行，且由於版本的差異，可能會造成無法運行的錯誤，開發者須同時擁有多個 Node.js 版本才方便進行測試，有別於以往 Node.js 下載安裝檔造成版本的綁定，使用 nvm 可同時存在多個 Node.js 版本，使用簡單的指令即可切換版本，推薦給所有的 Node.js 開發者。

## 筆記重點

- nvm 安裝
- nvm 基本使用

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

nvm 常見指令如下：

- `nvm list`
  - 列出本機已安裝的 Node.js 清單
- `nvm list available`
  - 列出所有官方可安裝的 Node.js 清單
- `nvm install latest`
  - 安裝最新版本的 Node.js
- `nvm install <版本號>`
  - 安裝特定版本號的 Node.js
- `nvm uninstall <版本號>`
  - 移除特定版本號的 Node.js
- `nvm use <版本號>`
  - 切換成指定 Node.js 版本

## nvm 基本使用

輸入 `nvm list available` 確認官方可安裝 Node.js 清單：

![nvm-list-available](https://i.imgur.com/AwM3CEo.png)

輸入 `nvm install 12.16.0` 安裝特定版本的 Node.js：

![nvm-install](https://i.imgur.com/fMnbj4Q.png)

輸入 `nvm use 12.16.0` 切換成指定 Node.js 版本：

![nvm-use](https://i.imgur.com/yQzLzJd.png)

以上為基本的 nvm 使用方式，這邊要注意的是，每一個 Node.js 版本，都隨附 npm 工具，而 npm 工具互相是獨立的全域環境，比如說 13.7.0 版本的全域 npm 套件是無法在 12.16.0 版本使用的。
