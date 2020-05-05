---
title: Git 版本控制系統 - cherry-pick 合併提交與 revert 抵銷提交
description:
  [
    跑過前面的文章大概就知道 Git 整個的處理流程了，這次來補充介紹 cherry-pick 與 revert 指令，你可以把 cherry-pick 看做 rebase 底層使用的指令，事實上，rebase 之所以能夠依序的整理提交，過程就是使用 cherry-pick 來執行，而 revert 就更簡單了，以往我們會使用 reset 或 rebase 來重置提交，但僅限於尚未推至遠端的提交，如果重置到了遠端的提交，此時肯定會發生衝突，revert 主要就是被用來解決此問題，以不修改原始提交為原則，新增一個相反的提交以抵銷之前的修改。,
  ]
categories: [Git]
tags: [Git]
date: 2020-05-05 14:14:09
updated: 2020-05-06 01:40:05
---

## 前言

跑過前面的文章大概就知道 Git 整個的處理流程了，這次來補充介紹 cherry-pick 與 revert 指令，你可以把 cherry-pick 看做 rebase 底層使用的指令，事實上，rebase 之所以能夠依序的整理提交，過程就是使用 cherry-pick 來執行，而 revert 就更簡單了，以往我們會使用 reset 或 rebase 來重置提交，但僅限於尚未推至遠端的提交，如果重置到了遠端的提交，此時肯定會發生衝突，revert 主要就是被用來解決此問題，以不修改原始提交為原則，新增一個相反的提交以抵銷之前的修改。

## 筆記重點

- cherry-pick 合併提交
- revert 抵銷提交
- Git 指令回顧

## cherry-pick 合併提交

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

- 取消 cherry-pick 操作，回到 cherry-pick 前狀態：

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

## revert 抵銷提交

有時我們會遇到以被推至遠端的檔案存在 Bug 的問題，如果這一個檔案還未被推至遠端，你大可放心使用 reset 或 rebase 來重置這一個檔案，反正別人又同步不到你的提交，但如果你已經把檔案推至遠端了呢？且夥伴已經將你的提交同步到他的本地了，此時該怎麼半？如果你用 reset 或 rebase 修復這一個檔案並推至雲端，夥伴要與遠端溝通時，肯定會報錯，此時推薦使用 revert 來修復這個檔案，我們以之前的專案來做範例。

目前線路圖狀態：

![查看目前 commit 紀錄-6](https://i.imgur.com/6EP7uLZ.png)

這是我們之前最後的結果，先將此專案推至遠端：

```bash
git remote add origin git@github.com:awdr74100/revert-demo.git

git push -u origin master
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-7](https://i.imgur.com/hEqJG7m.png)

`master` 已經被同步到遠端數據庫上面了，此時我們發現 `18f9dcc` 這個 commit 存在 Bug 需要被修復，使用 reset 重置提交：

> 這邊模擬錯誤的操作

```bash
git reset HEAD^

... fix bug

git add .

git commit -m 'add db.json'
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-8](https://i.imgur.com/HeGUTU0.png)

如果你將此提交推至遠端肯定會報衝突，就算你透過修復方式成功上傳，夥伴要同步時也會發生衝突，搞得大家都會發生衝突，這就是為什麼之前一直強調 rebase 與 reset 千萬不要用在以推至遠端的 commit 上，他們都會改變歷史紀錄，造成所謂的衝突發生，正確的做法應該是使用 revert 才對，先將提交進行還原：

```bash
git reset 18f9dcc --hard
```

使用 revert 反轉指定 commit 內容：

```bash
git revert 18f9dcc
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-9](https://i.imgur.com/Tq0TYwj.png)

你會發現多了一個 commit 紀錄，這一個 commit 剛好抵銷了 `18f9dcc` 的版本內容，類似 +10 + (-10) 的概念，達到了所謂重置的效果，此時 `c8a1261` 節點的狀態就會正好是 `474b25d` 節點的狀態，這也就是 revert 的功能，他會新增一個 commit 來抵銷指定的 commit 內容，對於 Git 來說，只是新增了一個 commit 紀錄，歷史紀錄並沒有更動到，不管是 Push 或 Fetch 也都不會有問題，讓我們在試一次：

```bash
git revert 474b25d --no-edit
```

`--no-edit` 參數可用來告知 Git 直接使用預設訊息，過程就不會跳出輸入訊息視窗了，此時的線路圖狀態為：

![查看目前 commit 紀錄-10](https://i.imgur.com/Y2zAeky.png)

`474b25d` 也被我們反轉了，此時的版本狀態就會與 `f5315c1` 一樣，這邊要注意，revert 並不像 reset 是把指定節點後的提交全部重置，revert 只會作用在單個提交上，這時你可能會問，我可以 revert 更以前的提交嗎？答案是可以的，但要注意相依性的問題，以上面範例來看，`da58123` 是可以成功被 revert 的，但 `12981b3` 可能就不會 revert 的這麼順利，可以參考以下指令解決衝突的問題：

- 跳過當下 commit，並執行下一個 commit：

```bash
git revert --skip
```

- 取消 revert 操作，回到 revert 前狀態：

```bash
git revert --abort
```

- 直行下一個進程：

```bash
git revert --continue
```

## Git 指令回顧

```bash
# 合併單個指定提交
git cherry-pick <SHA-1>

# 合併多個指定提交
git cherry-pick <SHA-1> <SHA-1>

# 跳過當下 commit，並執行下一個 commit
git cherry-pick --skip

# 取消 cherry-pick 操作，回到 cherry-pick 前狀態：
git cherry-pick --abort

# 進入下一個 cherry-pick 進程
git cherry-pick --continue

# 合併單個指定提交 (取消自動提交，並將檔案放置在索引區)
git cherry-pick <SHA-1> -n

# 合併單個指定提交 (同上)
git cherry-pick <SHA-1> --no-commit

# 合併單個指定提交 (修改提交訊息)
git cherry-pick <SHA-1> -e

# 合併單個指定提交 (同上)
git cherry-pick <SHA-1> --edit

# 反轉指定提交
git revert <SHA-1>

# 反轉指定提交 (使用預設提交訊息)
git revert <SHA-1> --no-edit

# 跳過當下 commit，並執行下一個 commit
git revert --skip

# 取消 revert 操作，回到 revert 前狀態：
git revert --abort

# 進入下一個 revert 進程
git revert --continue
```
