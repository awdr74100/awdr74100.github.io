---
title: Git 版本控制系統 - Rebase 進階合併方法與互動模式
description:
  [
    之前我們已經介紹過如何使用 merge 合併分支，這次來介紹更為進階的 rebase 方法合併分支。一般的 merge 方法就只是單純的將兩個分支進行合併，而 rebase 方法可以在合併的同時整理你的 commit 紀錄，達到最佳化的目的，且還提供了互動模式，針對時不時 commit 的人特別有用，能夠將零碎的 commit 紀錄依造自己需求做修改，以保證最後分享給夥伴的內容是有條理的。此篇將介紹如何使用 rebase 合併分支，過程也會提到衝突的解決辦法，最後說明何謂 rebase 互動模式。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-30 20:03:11
updated: 2020-04-30 20:03:11
---

## 前言

之前我們已經介紹過如何使用 merge 合併分支，這次來介紹更為進階的 rebase 方法合併分支。一般的 merge 方法就只是單純的將兩個分支進行合併，而 rebase 方法可以在合併的同時整理你的 commit 紀錄，達到最佳化的目的，且還提供了互動模式，針對時不時 commit 的人特別有用，能夠將零碎的 commit 紀錄依造自己需求做修改，以保證最後分享給夥伴的內容是有條理的。此篇將介紹如何使用 rebase 合併分支，過程也會提到衝突的解決辦法，最後說明何謂 rebase 互動模式。

## 筆記重點

- rebase 分支合併與處理方式
- rebase 衝突發生並解決

## rebase 分支合併與處理方式

讓我們先新增一個專案並提交兩次 commit 紀錄：

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

建立 `feature` 分支並提交兩次 commit 紀錄：

```bash
git checkout -b feature

touch all.js

git add .

git commit -m 'add all.js'

touch db.json

git add .

git commit -m 'add db.json'
```

回到 `master` 分支並提交一個 commit 紀錄：

```bash
git checkout master

... edit index.html

git commit -am 'edit index.html'
```

目前的線路圖應該長這樣：

![查看目前 commit 紀錄-1](https://i.imgur.com/UFes9lD.png)

在這種情況下使用 `git merge` 預設即會採用 non-fast-forward 合併分支，並生成一個全新的 commit 節點，這些在分支的章節都有講過，這一次我們換使用 rebase 的方式合併分支看看：

```bash
git rebase feature
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-2](https://i.imgur.com/ZwyrKue.png)

你會發現 `master` 原來指向的 `eca39f1` 節點更改為了 `b5cd508` 節點，且 `feature` 分支的線路圖不見了，這也就是 rebase 特別的地方，合併的同時重整了我們的 commit 紀錄，從字面上來看，「rebase」是「re」加上「base」，直譯大概是「重新定義分支的參考基準」的意思，以上面範例來說，`master` 分支 rebase `feature` 分支，代表 `feature` 分支為新的參考基準，`master` 分支與 `feature` 分支舊基準點為 `449ff41` 節點，此節點以後的 `master` 分支紀錄都將被剪下貼至新的基準點 `3cc7339` 後面，也就造成了上面的結果。

![rebase 示例](https://i.imgur.com/wcl5WY9.png)

簡單來講就是「剪下」「貼上」的概念，但這邊要注意，所謂的剪下是指一個一個依序剪下，並不是將整條分支直接剪下，等等會在說明，這時你可能又會問，那原有的 `master` 分支指向的 `eca39f1` 怎會變成 `b5cd508` 節點呢？那是因為原有的 `eca39f1` 節點是接在 `449ff41` 之後的，但現在 `eca39f1` 被剪下貼到了 `3cc7339` 之後，兄弟關係已改變，Git 重新計算 SHA-1 使之成為父子關係，也就生成了 `b5cd508` 這個節點，本質上與 `eca39f1` 沒有差異，且屬於被隱藏不是被丟棄。

到這邊你可能還是有點不太能理解 rebase 的處理方式，不如讓我們在試一次，使用以下指令進行回復：

```bash
git reset ORIG_HEAD --hard
```

你可以使用 `git reflog` 查找當時的 SHA-1 並進行還原，但這邊我們不這樣做，rebase 對於 Git 來說屬危險操作，為什麼危險呢？結果你也看到了，它會改變原有的 commit 紀錄，針對危險操作的還原，我們可以使用 `ORIG_HEAD` 這個變數，事實上，它是一個檔案，路徑為 `/.git/ORIG_HEAD`，裡面記載了危險操作前的 SHA-1，這也就是我們可以還原並指向的原因。

此時的路線圖狀態為：

![查看目前 commit 紀錄-3](https://i.imgur.com/UFes9lD.png)

這次我們換使用 `feature` 分支合併 `master` 分支看看：

```bash
git checkout feature

git rebase master
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-4](https://i.imgur.com/8PnOuXx.png)

你會發現 `feature` 分支所屬的 `2ca0999` 與 `3cc7339` 節點被剪下至 `eca39f1` 之後了，我們剛剛有說過 rebase 是依序剪下貼上動作，所以在這邊可以理解為剪下 `2ca0999` 貼到 `eca39f1` 之後，由於父子關係改變，使之重新計算 SHA-1，也就生成了 `e97010a` 物件，接著繼續將 `3cc7339` 剪下並貼到剛剛重新計算的 `e97010a` 之後，一樣父子關係改變，也就生成了 `46c816d` 物件。

你可能會想，這樣有什麼好處嗎？從上面的結果可以發現線路圖變得單純許多，相比於使用 `git merge`，`git rebase` 可以保持線路圖的一致性，說白了，就是當你看不慣傳統 `git merge` 產生的 commit，希望它不要出現在線路圖裡，就用 `git rebase`。

## rebase 衝突發生並解決

跑過了上面使用 rebase 的流程，相信各位大致上已經了解 rebase 的用法，也意識到可能會發生的問題了，沒錯！就是發生衝突時會很麻煩，相比於使用 `git merge` 只要解決一次衝突，`git rebase` 是依序剪下貼上來做處理，如果當前處理的節點有衝突，就必須進行修復，之後再跑到第二個節點，如果又有問題，就在進行修復，讓我們來模擬此情境：

目前的線路圖狀態為：

![查看目前 commit 紀錄-5](https://i.imgur.com/8PnOuXx.png)

回復到 rebase 前狀態：

```bash
git reset 3cc7339 --hard
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-6](https://i.imgur.com/UFes9lD.png)

假設我們在 `feature` 與 `master` 各做了些事情：

```bash
... edit index.html

git commit -am 'edit index.html'

... edit all.css

git commit -am 'edit all.css'

git checkout master

... edit all.css

git commit -am 'edit all.css'
```

目前線路圖狀態：

![查看目前 commit 紀錄-7](https://i.imgur.com/muOg1pA.png)

這次一樣使用 `feature` 合併 `master` 分支：

```bash
git rebase master
```

此時會跳出衝突的提示：

![查看目前 commit 紀錄-8](https://i.imgur.com/rw5yW3d.png)

一樣不用緊張，先用 `git status` 壓壓驚：

![查看檔案狀態-1](https://i.imgur.com/LpHqBoj.png)

你會發現它提示了 `rebase in progress` 代表卡住了，開啟 Sourcetree 可以看得更清楚：

![Sourcetree](https://i.imgur.com/RPB0Mnd.png)

從上面顯示可以得知，`2ca0999` 與 `3cc7339` 已被成功處理，但 `b1d9a97` 節點似乎發生衝突導致卡住，在前面的檔案狀態中，提示了可以使用以下指令回復到 rebase 前的狀態：

```bash
git rebase --abort
```

我們怎麼可能半途而廢，遇到問題解決不就得了，解法與 `git merge` 差不多，打開狀態為 `both modified` 的檔案：

![VSCode 衝突](https://i.imgur.com/KvONbC3.png)

假設我們要 `feature` 的內容，請把 `master` 的內容連同標記一起刪掉，之後再把他加至索引區：

![查看檔案狀態-2](https://i.imgur.com/o8PT39K.png)

在 `git merge` 的狀況下，我們可以使用 `git commit` 提交修改，但在 `git rebase` 的狀況下，必須使用以下指令提交修改：

```bash
git rebase --continue
```

有些人會在這一步使用 `git commit`，但在 rebase 的狀況下，反而是要使用 `--continue` 處理下一個 commit，這也是之前提到的 rebase 是依序處理每一個 commit，此時狀態為：

![git rebase --continue](https://i.imgur.com/pRcifmN.png)

你會發現 `b1d9a97` 已被成功處理，目前 `HEAD` 也就指向 `d40af91` 這個新產生的物件。

你以為結束了嗎？有沒有發現它又跳了一個錯誤？代表 `c952696` 也發生了衝突，解決就不再贅述，過程跟上面一模一樣，當我們全部衝突都被解決了，會跳出以下提示：

![rebase 成功解決衝突](https://i.imgur.com/MjOqSFD.png)

看到這個提示，代表我們的 rebase 終於成功了，此時的線路圖狀態為：

![查看目前 commit 紀錄-9](https://i.imgur.com/kNrcSRP.png)

的確 `feature` 分支原有的 commit 都被接到了 `2d0d29c` 之後，以上就是 rebase 發生衝突的解決辦法。
