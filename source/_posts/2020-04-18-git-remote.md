---
title: Git 版本控制系統 - 遠端數據庫託管與操作
description:
  [
    本地數據庫的操作已經介紹的差不多了，這次來講如何將本地數據庫推至遠端數據庫，這其實也是整個 Git 流程最重要的步驟，當我們成功將本地專案推至像是 GitHub 或 Bitbucket 等平台時，也就代表我們已經可以異地操作這一個專案了，你是否曾遇到過開發到一半的專案需要到另外一台電腦繼續操作的情況？這時你可能會使用像是 USB 等儲存裝置，但你不覺得這樣效率很差嗎？何況如果你忘記帶 USB 呢？只要你的專案已經存在遠端數據庫，且當前操作的電腦有安裝 Git，透過簡單指令即可將專案同步回本地。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-18 23:00:04
updated: 2020-04-19 00:46:56
---

## 前言

本地數據庫的操作已經介紹的差不多了，這次來講如何將本地數據庫推至遠端數據庫，這其實也是整個 Git 流程最重要的步驟，當我們成功將本地專案推至像是 GitHub 或 Bitbucket 等平台時，也就代表我們已經可以異地操作這一個專案了，你是否曾遇到過開發到一半的專案需要到另外一台電腦繼續操作的情況？這時你可能會使用像是 USB 等儲存裝置，但你不覺得這樣效率很差嗎？何況如果你忘記帶 USB 呢？只要你的專案已經存在遠端數據庫，且當前操作的電腦有安裝 Git，透過簡單指令即可將專案同步回本地。

## 筆記重點

- 在 GitHub 開一個遠端數據庫
- 設定 GitHub SSH 金鑰
- 將本地數據庫 Push 至 GitHub
- 將遠端數據庫 Clone 到本地

## 在 GitHub 開一個遠端數據庫

首先我們當然要有一個遠端數據庫託管我們的專案，在這邊示範 GitHub 的流程。

註冊 [GitHub](https://github.com/join?source=header-home) 帳號：

![Register GitHub](https://i.imgur.com/n0pIThT.png)

點擊畫面左邊的 New 按鈕，新增一個 Repository：

![New Repository](https://i.imgur.com/cGtent2.png)

此為 Repository 的各種設定，Name 為必要設定，其他都用預設值就好，反正後面還可以更改：

![Repository First Setting](https://i.imgur.com/q2mQFRg.png)

成功顯示：

![Repository success](https://i.imgur.com/iPyCrV1.png)

當你跑出以上畫面即代表遠端數據庫已成功被建立，你會看到一堆 Git 的指令，這些在下面都會做介紹，接下來進入本地數據庫連接遠端數據庫的部分。

## 設定 GitHub SSH 金鑰

在我們將本地數據庫連結遠端數據庫之前，有一個很重要的觀念是關於 SSH 與 HTTPS 的差異，GitHub 為了保證當前使用者就是此 Repository 的授權用戶，提供了兩種的驗證方式：

- SSH：已經將金鑰設定完成，與遠端數據庫交流時不需輸入帳密 (可針對私鑰使用設定密碼)
- HTTPS：與遠端數據庫交流時需輸入 GitHub 帳密，如果不需要輸入通常是帳密已存在電腦裡

GitHub 本身是推薦使用 HTTPS，使用起來會比較安全，且對於初學者來說較友善，看到登入視窗直接輸入帳密就完成了；但我個人比較推薦使用 SSH 的方式，並針對私鑰設定使用密碼，這樣在每次與遠端數據庫交流時，都會跑出輸入密碼的提示，你可能會想，這樣不是很麻煩嗎？但換個角度去想，假設你在提交的途中後悔了呢？我是不是就可以避免此次的提交？類似 Git 要設立索引區的用意，下面將介紹 SSH 該如何設定並提交至 GitHub 上面。

開啟終端機並輸入以下指令，用以生成 SSH Key：

```bash
ssh-keygen
```

- Created directory：生成路徑 (採預設即可)
- Enter passphrase：私鑰密碼 (可為空值，但建議輸入，原因上面有提到)
- Enter same passphrase again：再次輸入密碼
- ... 金鑰相關資訊

成功生成 SSH Key：

![ssh-keygen created](https://i.imgur.com/5G0gngn.png)

將 `C:\Users\${USER}\.ssh\id_rsa.pub` 公鑰內容提交至 GitHub 上：

位置：GitHub > Setting > SSH and GPG keys

![SSH Key push](https://i.imgur.com/0mX7Tb5.png)

點擊 New SSH Key 並將剛剛複製內容貼到 Key 欄位，最後按 Add SSH key 提交公鑰，完成圖如下：

![SSH Key success](https://i.imgur.com/NoCocJc.png)

到這邊就已經完成 GitHub SSH 金鑰設定的部分，下面我們就可以透過 SSH 方式與遠端數據庫交流囉。

## 將本地數據庫推送至 GitHub

讓我們先開一個專案資料夾並 commit 兩次紀錄：

```bash
$ mkdir project

$ git init
Initialized empty Git repository in C:/Users/a7894/Desktop/project/.git/

$ echo '' > index.html

$ git add .

$ git commit -m '新增 index.html'

$ echo '' > all.css

$ git add .

$ git commit -m '新增 all.css'
```

輸入 `git log` 查看目前 commit 紀錄：

![git log](https://i.imgur.com/2m89i24.png)

如果有看過前面文章的人，應該對這些流程非常熟悉了才對，將下來進入重頭戲的部分，輸入以下指令：

```bash
git remote add origin git@github.com:awdr74100/git-remote-demo.git
```

說明：

- `git remote add`：增加一個遠端數據庫位置
- `origin`：後面那段遠端數據庫位置的名稱 (可隨意設置)
- `git@github.com:xxx`：遠端數據庫位置 (SSH 方式)
- `https://github.com/xxx`：遠端數據庫位置 (HTTPS 方式)

遠端數據庫位置可在 Repository 頁面找到，前面的圖片就有照到。當我們輸入以上指令時，也可以到 `/.git/config` 專案配置檔中檢查是否成功添加遠端數據庫位置：

```plain
[remote "origin"]
    url = git@github.com:awdr74100/git-remote-demo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

簡單來講呢，你可以把它想像成宣告了 `origin` 這一個變數，並且賦予了遠端數據庫的位置，變數名稱可以自由的命名，但一般主要的遠端數據庫我們都會把它命名為 `origin`，其他特殊作用的遠端數據庫才會刻意命名，後面的操作就都會是以這一個變數名稱為主，接下來執行以下命令：

```bash
git push -u origin master
```

說明：

- `git push`：將本地指定分支推送至遠端數據庫
- `-u`：同 `--set-upstream`，設定推送分支的上游
- `origin`：要推向哪個遠端數據庫，寫名稱即可 (就是指前面說的 `origin`)
- `master`：將本地 `master` 分支推送至 Server，如果存在 `master` 分支即合併，不存在即新增

這一段可能會比較不好理解，讓我們將上面這段命令完整的寫出來：

```bash
git push --set-upstream origin master:master
```

首先是 `-u` 的部分，等同於 `--set-upstream`，可以使 `master` 這一個指定的分支開始追蹤遠端的分支，只要做過一次 `git push -u <remote> <branch name>`，並且成功 Push 出去，本地的 `master` 分支就會被設定去追蹤遠端的 `<remote> <branch name>` 分支，往後再 `master` 分支直接使用 `git push` 命令就會推向當時設定的 `<remote> <branch name>` 分支，反之，如果沒有設定 `-u` 就使用 `git push`，就會導致以下錯誤：

![git 尚未設置上游](https://i.imgur.com/OUCX1Hl.png)

可能有人會想，那我是否可以在不設定 `-u` 的情況下使用以下指令呢？

```bash
git push origin master
```

答案是可以的，我們為什麼要設定 `-u` 就是要方便往後在直接使用 `git push` 命令時，Git 能夠知道此命令該推向何處，上面這種寫法明確的定義推向何處，結果與 `git push -u origin master` 一樣，只是我們習慣在第一次推送時，在明確定義該推向何處時，同時也設置往後這個位置就是預設推向的位置，有關 `-u` 的設定一樣可以到 `/.git/config` 尋找：

```plain
[branch "master"]
    remote = origin
    merge = refs/heads/master
```

在這邊補充一點，如果你往後 `master` 這個以設定 `-u` 的分支，想要單純使用 `git push` 就推向其他的分支，你可以解除 `-u` 的設定或直接覆蓋掉 `-u` 的設定：

- 移除 `upstream` 設定 (當前所在分支為 `master` => 設定 `master` 分支)：

```bash
git branch --unset-upstream
```

- 移除 `upstream` 設定 (當前所在分支不是 `master` => 設定 `master` 分支)

```bash
git branch --unset-upstream master
```

- 設定 `upstream` 存在即覆蓋 (當前所在分支為 `master` => 設定 `master` 分支)：

```bash
git branch -u origin/master
```

- 設定 `upstream` 存在即覆蓋 (當前所在分支為 `master` => 設定 `master` 分支)：

```bash
git branch -u origin/master master
```

相信到這邊各位已經了解 `upstream` 的作用了，再來是前面提到的 `master:master` 部分，這個就比較簡單了，前面的 `master` 代表本地端的分支，後面的 `master` 代表遠端的分支，如果你把遠端的 `master` 改為 `develop`，那遠端的分支名稱就會是 `develop`，但內容還是本地端的 `master` 分支，就只是單純的改名子而已，接下來我們來看最初執行 `git push -u origin master` 後的 GitHub 頁面：

![git push 後的頁面](https://i.imgur.com/p7h4b4r.png)

你會發現我們的本地數據庫已成功推至遠端數據庫了，且分支名稱為 `master`，假設你在推送時使用 `master` 單個名稱，遠端分支的名稱就會直接採用這一個本地端分支的名稱，讓我們在練習一次：

```bash
$ git checkout -b develop

$ echo '' > db.json

$ git add .

$ git commit -m '增加 db.json'
```

這一次我們在本地端開了一個名為 `develop` 的分支，執行以下命令進行推送：

```bash
git push origin develop
```

或是

```bash
git push -u origin develop
```

請注意，你沒有必要切換到 `master` 分支才進行推送，你的 Git 命令本身已經添加本地端的哪個分支，除非你要使用 `git push` 方式進行推送，這時就需要切換到要推送的那個分支，**每一個分支都可以設定一個 upstream**，我自己是習慣將每一個分支都設定好 `upstream`，日後就可以直接使用 `git push` 推至指定位置了，工程師就是要少打點字啊！我們來看現在的遠端數據庫有什麼變化：

![push 新分支](https://i.imgur.com/dCYbWTC.png)

記得將頁面預設呈現的 `master` 分支切換到 `develop` 分支，從上面結果可以得知，我們的本地端數據庫已成功同步到遠端數據庫，接下來換本地該如何拉取遠端數據庫的部分：
