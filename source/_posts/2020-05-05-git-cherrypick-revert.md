---
title: Git 版本控制系統 - cherry-pick 合併提交與 revert 抵銷提交
description:
  [
    跑過前面的文章大概就知道 Git 整個的處理流程了，這次來補充介紹 cherry-pick 與 revert 指令，你可以把 cherry-pick 看做 rebase 底層使用的指令，事實上，rebase 之所以能夠依序的整理提交，過程就是使用 cherry-pick 來執行，而 revert 就更簡單了，以往我們會使用 reset 或 rebase 來重置提交，但僅限於尚未推至遠端的提交，如果重置到了遠端的提交，此時肯定會發生衝突，revert 主要就是被用來解決此問題，以不修改原始提交為原則，新增一個相反的提交以抵銷之前的修改。,
  ]
categories: [Git]
tags: [Git]
date: 2020-05-05 14:14:09
updated: 2020-05-05 14:14:09
---

## 前言

跑過前面的文章大概就知道 Git 整個的處理流程了，這次來補充介紹 cherry-pick 與 revert 指令，你可以把 cherry-pick 看做 rebase 底層使用的指令，事實上，rebase 之所以能夠依序的整理提交，過程就是使用 cherry-pick 來執行，而 revert 就更簡單了，以往我們會使用 reset 或 rebase 來重置提交，但僅限於尚未推至遠端的提交，如果重置到了遠端的提交，此時肯定會發生衝突，revert 主要就是被用來解決此問題，以不修改原始提交為原則，新增一個相反的提交以抵銷之前的修改。

## 筆記重點

- cherry-pick 挑選指定提交並合併

## cherry-pick 挑選指定提交並合併

讓我們先新增一個專案並提交兩次 commit 紀錄：

```bash
mkdir project

cd project

git init

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

此時的線路圖狀態為：

![查看目前 commit 紀錄-1](https://i.imgur.com/2sxQc3U.png)

在此情況下如果要進行合併我們通常會使用 merge 或 rebase 來完成，但如果我們不需要 `feature` 的全部提交呢？比如說我不想要 `ca6fca8` 這一個提交，你可能會打算用 rebase 來做，之後再用互動模式刪掉這一個提交，但這樣實在是太麻煩了，有沒有更簡單點的做法？讓我們先將 `HEAD` 切換回 `master` 分支：

```bash
git checkout master
```

使用 cherry-pick 挑選想要合併的 commit：

```bash
git cherry-pick 057edc1
```

此時會跳出 commit 以提交的提示：

![commit 已提交](https://i.imgur.com/OxR8Tcd.png)

代表 `057edc1` 紀錄已經被我們複製過來囉，就是這麼簡單，讓我們來看目前的線路圖狀態：

![查看目前 commit 紀錄-2](https://i.imgur.com/92hu6rs.png)

cherry-pick 能夠將它分支的 commit 撿過來並進行合併，達到不合併整條分支依然有它分支部分 commit 的效果，讓我們在試一次，回到 `feature` 分支新增幾個 commit：

```bash
... edit index.html

git commit -am 'change index.html'

touch touch all.scss

git add .

git commit -m 'add all.scss'
```

這邊模擬衝突發生的情況，回到 `master` 分支並新增一個 commit：

```bash
... edit index.html

git commit -am 'change index.html'
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-3](https://i.imgur.com/ZXLBvtU.png)

假設我想要 `feature` 分支的 `2841c5b` 與 `26af41f` 紀錄，可以這樣做：

```bash
git cherry-pick 2841c5b 26af41f
```

後面的 commit 是可以無限添加的，但如果 commit 太多，使用 rebase 可能是更好的選擇。

`cherry-pick` 與 `merge` 或 `rebase` 相同，都可能會遇到衝突的情況，如下所示：

![cherry-pick 衝突發生](https://i.imgur.com/ZurA1Hz.png)

一樣先用 `git status` 壓壓驚：

![git status](https://i.imgur.com/8r0IuVu.png)

cherry-pick 與 rebase 處理衝突方式幾乎一模一樣，畢竟 rebase 底層就是使用 cherry-pick 來做，cherry-pick 提示了可以使用以下指令處理衝突：

- 跳過當下 commit，並執行下一個 commit：

```bash
git cherry-pick --skip
```

- 取消 cherry-pick 操作，並回到 cherry-pick 前的狀態：

```bash
git cherry-pick --abort
```

是不是與 rebase 差不多？逃避問題向來不是我們的風格，請將衝突解決並提交至索引區：

```bash
... resolve conflict

git add .
```

與 rebase 解法相同，但要注意關鍵字是 cherry-pick，執行以下命令以進行下一個任務：

```bash
git cherry-pick --continue
```

此時一樣會跳出 commit 以提交至本地數據庫的提示，最後的線路圖狀態為：

![查看目前 commit 紀錄-4](https://i.imgur.com/ENKj3f5.png)

大功告成！這邊補充一點，我們拿 `feature` 分支的 `ca6fca8` 來做示範，執行以下指令：

```bash
git cherry-pick ca6fca8 -n
```

`-n` 全名為 `--no-commit`，可告知 Git 不要自動提交，並將檔案放置在索引區，我們可以使用 `git status` 查看：

![查看檔案狀態-1](https://i.imgur.com/ea8tLcO.png)

有關 `ca6fca8` 的更動就都被放到索引區了，如果當時 cherry-pick 是選取多個 commit 的話，所有更動都會一併被放置在索引區，此時你只要透過 commit 即可將所有提交當做一個 coomit 提交出去，或者你也可以各別提交達到與預設同樣的效果。

這邊在補充一個參數，假設我們 cherry-pick 時不想要使用原先的提交訊息，可以這樣做：

```bash
git cherry-pick ca6fca8 -e
```

`-e` 全名為 `--edit`，可告知 Git 需要編輯提交訊息，此時會跳出預設編輯器讓你輸入提交訊息，最後呈現的結果如下：

![查看目前 commit 紀錄-5](https://i.imgur.com/6EP7uLZ.png)
