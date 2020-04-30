---
title: Git 版本控制系統 - Rebase 進階合併方法與互動模式
description:
  [
    之前我們已經介紹過如何使用 merge 合併分支，這次來介紹更為進階的 rebase 方法合併分支。一般的 merge 方法就只是單純的將兩個分支進行合併，而 rebase 方法可以在合併的同時整理你的 commit 紀錄，達到最佳化的目的，且還提供了互動模式，針對時不時 commit 的人特別有用，能夠將零碎的 commit 紀錄依造自己需求做修改，以保證最後分享給夥伴的內容是有邏輯的。此篇將介紹如何使用 rebase 合併分支，過程也會提到衝突的解決辦法，最後說明何謂 rebase 互動模式。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-30 20:03:11
updated: 2020-04-30 20:03:11
---

## 前言

之前我們已經介紹過如何使用 merge 合併分支，這次來介紹更為進階的 rebase 方法合併分支。一般的 merge 方法就只是單純的將兩個分支進行合併，而 rebase 方法可以在合併的同時整理你的 commit 紀錄，達到最佳化的目的，且還提供了互動模式，針對時不時 commit 的人特別有用，能夠將零碎的 commit 紀錄依造自己需求做修改，以保證最後分享給夥伴的內容是有邏輯的。此篇將介紹如何使用 rebase 合併分支，過程也會提到衝突的解決辦法，最後說明何謂 rebase 互動模式。

## 筆記重點

- rebase 合併分支
- rebase 衝突解決

## rebase 合併分支

讓我們先新增一個專案資料夾並提交數次 commit 紀錄：

```bash
mkdir project

cd project

git init
Initialized empty Git repository in C:/Users/a7894/Desktop/project/.git/

touch index.html

git add .

git commit -m 'add index.html'

touch all.css

git add .

git commit -m 'add all.css'
```

新增 `develop` 分支並提交數次 commit 紀錄：

```bash
git checkout -b develop

touch all.js

git add .

git commit -m 'add all.js'

touch db.json

git add .

git commit -m 'add db.json'
```

回到 `master` 開一個分支並提交一個 commit：

```bash
git checkout master

git checkout -b feature

touch App.vue

git add .

git commit -m 'add App.vue'
```

讓我們來看目前日誌：

![查看目前 commit 紀錄-1](https://i.imgur.com/Emq8Uxe.png)

此時如果使用 `git merge` 合併 `develop` 分支，預設會採用非快轉處理並形成一個全新的 commit 節點，這是我們之前在分支的章節討論到的，這次讓我們換使用 rebase 合併看看：

```bash
git rebase develop
```

再次查看日誌：

![查看目前 commit 紀錄-2](https://i.imgur.com/WPF0Sob.png)

你現在一定很困惑為什麼是這樣的結果，合併後怎麼沒有產生任何 commit 節點呢？這也就是 rebase 特別的地方，它能夠重新定義分支的參考基準，以上面為例，`feature` 分支 rebase 了 `develop` 分支，也就代表 `develop` 分支為新的參考基準，`feature` 的每個節點都會被一個一個剪下來依序貼到 `develop` 分支的最新節點上，也就是 `c5d1c73` 這個節點，且對於 Git 來說，剪下並貼上的這個過程屬於新的提交，這也才導致原有的 `c22ac5f` 被丟棄 (隱藏) 了，進而生成了一個全新的節點 `8d8b1f0`。

簡單來講呢，rebase 會將合併別人分支的那個分支依序剪下並貼到新參考基準的最新 commit 節點上，如果你還是不太能夠理解，不如讓我們再試一次：

```bash
git reset ORIG_HEAD --hard
```

你可以使用 `git reflog` 查找 rebase 前的狀態並加以還原，但這邊我們不使用此方法，rebase 對 Git 來說屬危險操作，為什麼危險呢？結果你也看到了，它會改變原有的 commit 紀錄，Git 會將此種行為特別紀錄在 `/.git/ORIG_HEAD` 檔案內，只要使用 `git reset ORIG_HEAD` 即可還原狀態，此時狀態還原為：

![查看目前 commit 紀錄](https://i.imgur.com/Emq8Uxe.png)

這次我們換測試 `develop` 分支 rebase `feature` 分支看看：

```bash
git checkout develop

git rebase feature
```

在每次 rebase 時，都會跳出 `Applying` 的提示，告訴我們目前正在處理哪一個 commit，這也間接證明 rebase 並不是作用在整條分支，而是依序作用在每一個 commit 身上：

![查看目前 commit 紀錄](https://i.imgur.com/7Y6T7Wa.png)

讓我們來看結果如何：

![查看目前 commit 紀錄](https://i.imgur.com/HUVnWTc.png)

這一次換 `develop` 分支中的 `cfd1c73` 與 `7cd874d` 節點被丟棄 (隱藏) 了，進而生成了 `c8d2aaa` 與 `c763bcb` 節點，你可能會問，這樣有什麼好處嗎？
