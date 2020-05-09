---
title: Git 版本控制系統 - GitHub Flow 介紹與實際演練
description:
  [
    隨著專案越來越大，協作人員越來越多，衝突發生的機率也越來越高，訂定良好的團隊規範就顯得更為重要，Workflow 因此而誕生，常見的對象有 Git Flow、GitHub Flow 或 GitLab flow 等，主要都是被用來解決團隊間無規範可遵循造成衝突的問題，透過共同遵循的處理流程，達到有條理的進行團隊協作開發。此篇將介紹目前主流的 GitHub Flow 核心概念，並透過實際演練說明它所能帶給團隊的好處。,
  ]
categories: [Git]
tags: [Git, GitHub]
date: 2020-05-09 19:15:51
updated: 2020-05-09 19:15:51
---

## 前言

隨著專案越來越大，協作人員越來越多，衝突發生的機率也越來越高，訂定良好的團隊規範就顯得更為重要，Workflow 因此而誕生，常見的對象有 Git Flow、GitHub Flow 或 GitLab flow 等，主要都是被用來解決團隊間無規範可遵循造成衝突的問題，透過共同遵循的處理流程，達到有條理的進行團隊協作開發。此篇將介紹目前主流的 GitHub Flow 核心概念，並透過實際演練說明它所能帶給團隊的好處。

## 筆記重點

- GitHub Flow 介紹
- 建立 Organization 組織
- GitHub Flow 實際演練

## GitHub Flow 介紹

讓我們先來看 [官方](https://guides.github.com/introduction/flow/) 的介紹：

> GitHub flow is a lightweight, branch-based workflow that supports teams and projects where deployments are made regularly.

你現在一定很困惑，沒關係，我當時看到也是滿臉問號，簡單來講呢，GitHub Flow 是基於創建分支所運作，最大的特點在於其流程非常簡單，你不需要像 Git Flow 一樣創建多達 5 種的分支，有新功能需求時在創建對應的 `feature` 分支即可，其中的主要流程為：

- 創建分支 (Create a branch)
- 提交修改 (Add commits)
- 開啟 PR (Open a Pull Request)
- 代碼審核 (Discuss and review your code)
- 部屬 (Deploy)
- 合併 (Merge)

剛剛我們提到了創建 `feature` 分支的部分，當你的功能開發完成後，即透過 PR (Pull Request) 與負責人做溝通，如果有看過我上一篇文章的人應該很熟悉了才對，接著負責人收到你的 PR 後會與你討論相關的內容，確認沒問題即合併到 `master` 分支，而 `master` 分支上的每個版本都是可以進行部屬的，這點在我們實際演練時會再做討論，最後即完成了此次的 GitHub Flow 流程，日後有新功能需求時，就只是再重跑一次流程而已。

你可能還是聽得霧煞煞，簡單來講呢，就是我們只會接觸到對應的 `feature` 分支，當我們的 `feature` 分支開發完成後，即發送 PR 給負責人，如果確認沒問題負責人就會將這個 PR (`feature` 分支) 合併到 `master` 分支，在合併完成後即自動部屬至伺服器，因為放在 `master` 分支上的每個版本都是可以直接部屬的。

現在你可能就有點頭緒了，為了加強對 GitHub Flow 的了解，讓我們來實際演練一番吧！

## 建立 Organization 組織

這邊要強調，GitHub Flow 只是一種工作流程，你可以把它用在開源專案或私有專案上，並沒有說一定要用在哪裡，它更像是一種共識，下面我們會以 GitHub 中的組織 (Organization) 為對象做介紹，說明團隊間是如何使用 GitHub Flow 做運作的，讓我們先在 GitHub 建立一個組織：

![建立組織](https://i.imgur.com/xjHMkOR.png)

在 GitHub 建立組織相當簡單，就如同新增遠端數據庫一般，透過點選即可完成，之後會跳出邀請成員的畫面：

![邀請成員](https://i.imgur.com/DPpflYE.png)

這邊我們一樣使用兩支帳號來做示範，被邀請的成員需透過 Email 接收邀請才會正式加入組織，最後的結果為：

![組織畫面](https://i.imgur.com/b8R9FAb.png)

由於是示範用的，其他細項我們就不做討論，到這邊就已經完成創建組織的動作了，接下來讓我們正式進入到 GitHub Flow 的實際演練章節吧！

## GitHub Flow 實際演練

目前我們登入的帳號為 lanroya，也就是組織的管理者，你可以把它當作專案的負責人，他使用了 express-generator 生成專案的初始環境：

```bash
express -e express-project

cd express-project

npm i
```

新增 `.gitignore` 檔案：

```bash
touch .gitignore
```

忽略 `node_modules` 資料夾：

```plain
// .gitignore

node_modules/
```

初始化 Git 環境：

```bash
git init

git add .

git commit -m '建立環境'
```

此時的線路圖狀態為：

![查看目前 commit 紀錄](https://i.imgur.com/WScL3cV.png)

目前初始環境已經建立完成，接著在組織建立一個遠端數據庫：

![在組織新增遠端數據庫](https://i.imgur.com/o8xQyJ0.png)

我們選擇將組織的遠端數據庫設為公開狀態，當然你也可以設為私有的，但要注意，預設來說，成員是無法 Fork 私有的遠端數據庫的，你必須到組織的設定將其選項打開，成員才可以進行 Fork，此時生成數據庫的畫面為：

![遠端數據庫成功建立](https://i.imgur.com/blOjpEv.png)

新增組織的遠端數據庫位址：

```bash
git remote add origin https://github.com/roxog/express-project.git
```

將本地推至遠端：

```bash
git push -u origin master
```

成功推至遠端：

![成功推至遠端數據庫](https://i.imgur.com/wcd7EAH.png)

