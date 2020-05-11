---
title: Git 版本控制系統 - GitHub Flow 工作流程與實際演練
description:
  [
    隨著專案越來越大，協作人員越來越多，衝突發生的機率也越來越高，訂定良好的團隊規範就顯得更為重要，Workflow 因此而誕生，常見的對象有 Git Flow、GitHub Flow 或 GitLab flow 等，主要都是被用來解決團隊間無規範可遵循造成衝突的問題，透過共同遵循的處理流程，達到有條理的進行團隊協作開發。此篇將介紹目前主流的 GitHub Flow 工作流程是如何運作，並透過實際演練說明它所能帶給團隊的好處。,
  ]
categories: [Git]
tags: [Git, GitHub, GitHub Flow, w3HexSchool, Heroku]
date: 2020-05-11 00:36:48
updated: 2020-05-12 00:12:37
---

## 前言

隨著專案越來越大，協作人員越來越多，衝突發生的機率也越來越高，訂定良好的團隊規範就顯得更為重要，Workflow 因此而誕生，常見的對象有 Git Flow、GitHub Flow 或 GitLab flow 等，主要都是被用來解決團隊間無規範可遵循造成衝突的問題，透過共同遵循的處理流程，達到有條理的進行團隊協作開發。此篇將介紹目前主流的 GitHub Flow 工作流程是如何運作，並透過實際演練說明它所能帶給團隊的好處。

## 筆記重點

- GitHub Flow 介紹
- 建立 Organization 組織
- GitHub Flow 實際演練
- Heroku 自動部屬

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

![查看目前 commit 紀錄-1](https://i.imgur.com/WScL3cV.png)

目前初始環境已經建立完成，你總不可能要求成員使用 USB 來 copy 你的檔案吧？如同新增帳號底下的遠端數據庫一般，在組織新增一個遠端數據庫：

![在組織新增遠端數據庫](https://i.imgur.com/o8xQyJ0.png)

我們選擇將組織的遠端數據庫設為公開狀態，當然你也可以設為私有的，但要注意，以預設來說，成員是無法 Fork 私有遠端數據庫的，你必須到組織的設定將其選項打開，成員才可以進行 Fork，組織的遠端數據庫與帳號底下的遠端數據庫基本上沒啥差別，一個是掛在組織底下，一個是掛在帳號底下而已：

![遠端數據庫成功建立](https://i.imgur.com/blOjpEv.png)

添加組織的遠端數據庫位址：

```bash
git remote add origin https://github.com/roxog/express-project.git
```

將專案推至遠端：

```bash
git push -u origin master
```

專案已成功推至遠端：

![成功推至遠端數據庫](https://i.imgur.com/wcd7EAH.png)

到這邊負責人的操作就先告一段落了，接下來換成員建立 `feature` 分支並開發新功能的部分，我們採用 GitHub Flow 來運作，登入 awdr74100 帳號並 Fork 組織的專案：

![fork 組織的專案](https://i.imgur.com/kEOSyF1.png)

此時會跳出選擇 Fork 至哪一個帳號的提示，選擇成員 (awdr74100)，之後就會 Fork 至帳號底下：

![成功 fork 專案](https://i.imgur.com/7SJKkug.png)

在來的操作就如同帳號底下的遠端數據庫一般，由於我們本地還未有這個資料，這邊先克隆回本地：

```bash
git clone https://github.com/awdr74100/express-project.git project

cd project
```

查看線路圖狀態：

![查看目前 commit 紀錄-2](https://i.imgur.com/6U2F8t3.png)

本文重點來了，GitHub Flow 的第一步是在 `master` 分支建立 `feature` 的分支，假設我今天要開發的功能是修改路由，可以這樣做：

```bash
git checkout -b feature/edit_router

... edit /routes/index.js

git commit -am '修改 router 標題'
```

分支的名稱是可隨意命名的，但必須具備其描述性，目前我們已經完成 GitHub Flow 的第一與第二個步驟了，線路圖狀態為：

![查看目前 commit 紀錄-3](https://i.imgur.com/q76yMKN.png)

假設新功能已經開發完成了，先將新提交推至帳號底下的遠端數據庫：

```bash
git push -u origin --all
```

接著進行 GitHub Flow 的第三步驟，開啟 PR (Pull Request)：

![開啟 PR](https://i.imgur.com/ZFiRooC.png)

這邊要注意來源與目的的選擇，你是將 `feature/edit_router` 推到專案的 `master` 分支，並不是 `master` 推 `master`，如果確認沒問題，就發送 RP 吧，此時 GitHub Flow 的第三步驟也就完成了。

這邊做一個補充，其實也不算補充，如果你有看過上一篇文章的人應該都知道該怎麼做了，如果未來要同步組織的遠端資料庫時，必須添加數據庫的位址：

```bash
git remote add source https://github.com/roxog/express-project.git
```

這樣之後就可以使用 `fetch` 或 `pull` 將負責人合併後的資料給拉下來，達到同步更新的作用，接下來切換到負責人的帳號 (lanroya) 來處理 PR 吧：

![處理 PR](https://i.imgur.com/gro36Go.png)

目前來到了 GitHub Flow 的第四個步驟，也就是代碼審核的部分，這邊介紹一個蠻有趣的功能，切換到 `Files changed` 選項：

![files changed 功能](https://i.imgur.com/e2vijFv.png)

你可以點擊更動代碼旁邊的 `+` 按鈕，或是直接將更動代碼整個選起來以進行討論，看起來會像這樣個樣子：

![代碼審核](https://i.imgur.com/sFVSx2r.png)

點擊 `Add single comment` 即可添加討論，此時有關的人員都會收到此次的評論通知，現在的 `Conversation` 看起來會像這樣：

![add single comment](https://i.imgur.com/P1KQp2O.png)

假設此次的討論已經完成，可以點擊 `Resolve conversation` 關閉對話，最後確認沒問題的話，點擊 `Merge pull request` 合併 PR：

![合併 PR](https://i.imgur.com/rJg3ywT.png)

到這邊我們就跑完 GitHub Flow 的全部步驟了，此時你可能會想，第五個步驟怎麼沒有說明呢？在前面我們有一直強調 `master` 分支的每個版本都是可以直接部屬至伺服器的，這也就代表說當我們合併這一個 PR 時，進而生成的提交就等於 production 的版本，在這邊你先理解大概的概念就好，下面我們會介紹如何使用 heroku 自動完成部署動作。

現在你已經會使用 GitHub Flow 運作整個提交流程了，其實就是一直圍繞在 `master` 開 `feature` 分支，將 `feature` 分支推上 fork 的遠端數據庫，之後開啟 PR 發送 `feature` 分支合併 `master` 分支的請求，之後又有新功能要開發時，先將本地數據庫與組織數據庫做同步：

```bash
git pull source master

git push origin master
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-4](https://i.imgur.com/OtLgsKR.png)

要開發新功能就在開一個 `feature` 分支，之後再重跑一次 GitHub Flow 的流程，這邊要養成一個好習慣先 `pull` 在 `push`，也就是先拉在推，你沒辦法保證在過程中是否會有其他成員提交 PR 並審核通過，如同我們之前所說，歷史紀錄不同，肯定會發生衝突，這邊要特別注意。

## Heroku 自動部屬

這邊我們來補充何謂 `master` 分支上的每個版本都是可部屬狀態的，通常這個動作會在初始化專案時進行，但為了避免大家混淆，剛剛沒有操作到這一部分，回到 lanroya 帳號操作 Git：

```bash
heroku login

heroku create
```

上面操作主要用來在 heroku 開一個伺服器，這邊我們並不會強調 heroku 的使用方式，在之後的 express 章節會再做說明，目前主要用來示範何謂自動部屬，此時的專案會新增 heroku 的遠端位址：

![查看所有遠端數據庫](https://i.imgur.com/E57QN7r.png)

將專案推至 heroku 並查看：

```bash
git push heroku origin master

heroku open
```

此時會跳出以下畫面：

![查看 heroku 部屬畫面-5](https://i.imgur.com/lWGK47s.png)

我們的 express 專案已成功部屬在 heroku，你可以把它想像成 GitHub Page 的感覺，目前的線路圖狀態為：

![查看目前 commit 紀錄](https://i.imgur.com/2qH9EL3.png)

`master` 分支新增了 `heroku/master` 的參考，接著到剛剛新增的 heroku 伺服器設定介面：

![heroku 啟用自動部屬功能](https://i.imgur.com/7bcH581.png)

點擊 `Enable Automatic Deploys` 啟用自動部屬功能，這樣就完成了，此後組織專案中的 `master` 分支只要有變動，heroku 都會自動幫你完成部屬的動作，讓我們來測試一次：

> 當前為成員 (awdr74100) 的操作

```bash
git checkout -b feature/change_router_title

... edit router title

git commit -am '再次修改標題'

git push origin --all
```

開啟 PR：

![再次開啟 PR](https://i.imgur.com/MLB56GZ.png)

負責人通過 PR：

![通過 PR](https://i.imgur.com/O4nJ1yJ.png)

當你按下 `Merge pull request` 合併 PR 時，因為 `master` 分支移動了，heroku 就會開始自動部屬的動作：

![heroku 自動部屬](https://i.imgur.com/iRXVQ03.png)

結果頁面：

![結果頁面](https://i.imgur.com/QPrM9cr.png)

是不是很酷？我們就再也不需要手動 Push 至 heroku 了，事實上，類似的 PaaS 都有這個功能，比如說我自己非常喜歡的 [ZEIT Now](https://vercel.com/) 也有這個功能，之後有機會再做示範。

到這邊我們的 Git 學習路程就告一段落囉。
