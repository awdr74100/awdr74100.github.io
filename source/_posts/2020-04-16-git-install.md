---
title: Git 版本控制系統 - 環境安裝與基本指令
description:
  [
    Git 是一個分散式的版本控制系統，可針對專案的不同版本進行操作。當初在學 Git 時是直接買書回來看，大概知道什麼時候該打什麼指令，但我還是認為自己的基礎不夠扎實，還不到業界的標準，如果你是應徵軟體相關的工作，這肯定是必備技能。此系列文章主要紀錄在各種情境下，該如何靈活使用 Git 管控我們的專案版本，到後半段的文章也會提及如何將專案部屬至遠端的 Git 伺服器，如 GitHub、Bitbucket 等，最後會以常見的 Work Flow，如 GitHub Fow 收尾，加深自己對 Git 的印象。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-16 00:31:36
updated: 2020-04-16 00:31:36
---

## 前言

Git 是一個分散式的版本控制系統，可針對專案的不同版本進行操作。當初在學 Git 時是直接買書回來看，大概知道什麼時候該打什麼指令，但我還是認為自己的基礎不夠扎實，還不到業界的標準，如果你是應徵軟體相關的工作，這肯定是必備技能。此系列文章主要紀錄在各種情境下，該如何靈活使用 Git 管控我們的專案版本，到後半段的文章也會提及如何將專案部屬至遠端的 Git 伺服器，如 GitHub、Bitbucket 等，最後會以常見的 Work Flow，如 GitHub Fow 收尾，加深自己對 Git 的印象。

## 筆記重點

- 為什麼需要使用 Git？
- 安裝 Git 至 Windows 環境下
- 使用者設定 / 全域與區域差別
- 初始化 Git Repository
- Git 基本指令

## 為什麼需要使用 Git？

假設你是一位 Web 開發人員，在做專案開發時可能會遇到以下情境：

![傳統版本控制](https://i.imgur.com/2oSCNHQ.png)

為了保證之後可查看過往的開發紀錄，在每次新的開發時，我們都會直接另存新檔並將修改內容直接以標題顯示，老實講，我以前就是這樣幹的，我是一位有點強迫症的人，我喜歡在每次開發時都遍歷過往的紀錄，避免自己陷入曾發生的錯誤，但你不覺得這樣子顯得很不專業嗎？身為一位開發人員，居然用這麼傳統的方式辨別每次開發的過程，何不我們嘗試使用版本控制進行開發呢？

![使用 Git 版本控制](https://i.imgur.com/dIsQMmS.png)

以上為 VSCode 中的 Git History 插件效果，是不是覺得很驚人？在也不需要另存新檔了，你可能會有疑問，這不就只是在每次開發時做一次紀錄嗎？我需要知道的是紀錄的內容阿！

![使用 Git 進行比對](https://i.imgur.com/Oa2A1VI.png)

透過簡單的指令即可比對不同版本的差異，你是不是越來越有興趣了？讓我們再做一個示例：

- 當前狀態 (master)：

![當前最新狀態](https://i.imgur.com/hZOQ3Hx.png)

- 新增內文 (6cb782f)：

![切換到指定狀態](https://i.imgur.com/ZMA2SyS.png)

你沒有看錯，代碼被還原到指定的紀錄上了，但這不代表以後的紀錄被刪除了，你可以自由的切換當前專案的版本。有時候在團隊開發時，可能會有同一份檔案被修改的情況，以往我們都是用口述的方式進行討論，但現在不用這麼麻煩了，來看以下示例：

![版本衝突](https://i.imgur.com/mizZplS.png)

當我們遇到版本衝突時，Git 會提示衝突的地方，我們只需要與夥伴溝通要使用誰的版本即可，是不是很方便？說了這麼多，讓我們直接開始使用 Git 吧！

## 安裝 Git 至 Windows 環境下

由於我本身是 Windows 的環境，故以下教學都是針對此環境進行。

> 官方連結：[Git](https://git-scm.com/)

![Git 下載頁面](https://i.imgur.com/ist48Oz.png)

安裝過程就一路給它按下去就對了，安裝完成後可以在滑鼠右鍵選單內容找到 `Git Bash Here` 與 `Git GUI Here` 選項，在這邊我們可以選擇 `Git Bash Here`，此時會跳出以下視窗：

![Git Bash](https://i.imgur.com/S1hTuvl.png)

這個就是 Git 內建的命令提示字元，嚴格來講應該算是模擬 Linux 系統內的 Bash，我們所有的 Git 指令都會在這邊完成，當然你也可以使用 Windows 底下的 PowerShell 或 CMD，只要 Git 有成功安裝，隨你高興，我們可使用以下指令確認 Git 是否有成功安裝：

```bash
git --version
```

假設出現 Git 的版本號，即代表安裝成功，如下圖：

![git --version](https://i.imgur.com/1jNHeF0.png)

## 使用者設定 / 全域與區域差別

在觀看此文章段落之前，可以先至下一個段落實際把玩 Git 一番，這樣對此段落內容會比較有感覺。當我們在不設定當下使用者是誰的情況下，會跳出以下錯誤：

![使用者未設定](https://i.imgur.com/J6iONlw.png)

就如同字面上的意思，當我們要提交一個 commit 時，必須告訴 Git 當下的使用者是誰，以保證未來可以追蹤此提交的使用者，這時可以輸入它給予的建議設定使用者，如下所示：

```bash
git config --global user.name "Roya"
```

```bash
git config --global user.email 'a78945612385238@gmail.com'
```

上面這兩道指令主要用來設定使用者的姓名與信箱，此時可輸入以下指令檢查是否成功設定：

```bash
git config --list
```

如果出現 `user.name` 與 `user.email` 即代表設定成功。

這邊介紹另一種檢查的方法，至 `C:\Users\xxx\.gitconfig` 查看內容：

```plain
[user]
    name = Roya
    email = a78945612385238@gmail.com
```

這一個檔案是 Git 的全域配置檔，還記得我們上面使用 `--global` 參數進行配置嗎？如果以全域方式設定使用者，在往後進行任何 Git 操作時，預設都會以這一個使用者為主，通常只在第一次使用 Git 時都才要設定，你也可以使用區域方式配置使用者，如下所示：

```bash
git config --local user.name 'Eric'
```

```bash
git config --local user.email 'asdwef@gmail.com'
```

區域配置的設定一樣會有專屬設定檔，專案資料夾內的 `.git/config` 檔案就是了，同樣可檢查是否成功設定：

```plain
[user]
    name = Eric
    email = asdwef@gmail.com
```

當你在專案提交 commit 時，就會是使用區域配置的使用者而非全域配置的使用者，這點要注意！此時就能夠正常提交 commit 囉。

## 初始化 Git Repository

接下來讓我們正式開始使用 Git 吧！首先請先新增一個空的資料夾：

```bash
mkdir project
```

假設這一個資料夾就是我們專案放置的地方，使用 `cd` 移至這個資料夾：

```bash
cd project
```

如果你的資料結構很複雜，也可以直接將專案資料夾拉進 bash 內：

```bash
cd C:\Users\a7894\Desktop\project
```

接下來進行初始化 Git Repository 的動作，請輸入以下指令：

```bash
git init
```

此時會跳出已新增 `.git` 的提示，如下所示：

![git init](https://i.imgur.com/QnJrqHG.png)

這一個 `.git` 檔案就是我們專案資料夾的 Repository，到了這邊已經完成讓 Git 針對此專案進行版控的動作

## Git 基本指令

![git 運作流程](https://i.imgur.com/scWvYQ1.jpg)

讓我們借助[六角學院](https://www.hexschool.com/)所製作的流程圖說明 Git 是如何進行版控的，從上圖可以發現有四大部分需要我們了解，讓我們直接從實際應用操演一番。

新增 `index.html` 檔案：

```diff
 webpack-demo/
 │
+├─── index.html
```

輸入以下指令查看當前目錄狀態：

```bash
git status
```

這一道指令可能是你往後最常使用的指令，主要用來查看當前目錄的狀態，如下所示：

![git status](https://i.imgur.com/7jvZNjc.png)

從 Git 的提示可以看出，我們的 `index.html` 檔案目前狀態是 `Untracked`，關於檔案狀態的部分會再之後的章節做討論，這邊我們只需要記得一個重點就是，**所有剛新增的檔案初始存在區域都是屬於工作目錄**，也就是上圖的第一個地方，請注意，**在工作目錄且狀態為 `Untracked` 的檔案是不受 Git 版控的**，也就是說如果你在這邊做任何的修改，是無法擁有之前展示的復原、切換版本功能的，此時 Git 就沒有任何意義了。我們可以依造提示繼續進行，執行以下指令：

```bash
git add index.html
```

此時一樣可透過 `git status` 查看目前狀態：

![git add index.html](https://i.imgur.com/grzPncJ.png)

