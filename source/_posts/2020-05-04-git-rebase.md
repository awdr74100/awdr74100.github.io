---
title: Git 版本控制系統 - rebase 合併分支與 pull --rebase 同步提交
description:
  [
    之前我們已經介紹過如何使用 merge 合併分支，這次來介紹更為進階的 rebase 方法合併分支。一般的 merge 方法就只是單純的將兩個分支進行合併，而 rebase 方法可以在不額外生成新 commit 的狀況下進行合併，達到精簡化的目的，且還提供了互動模式，針對時不時 commit 的人特別有用，能夠將零碎的 commit 紀錄依造自己需求做修改，以保證最後分享給夥伴的內容是有條理的。此篇將介紹如何使用 rebase 合併分支，過程也會提到衝突的解決辦法，最後說明何謂 rebase 互動模式。,
  ]
categories: [Git]
tags: [Git, w3HexSchool]
date: 2020-05-04 00:10:32
updated: 2020-05-05 02:06:12
---

## 前言

之前我們已經介紹過如何使用 merge 合併分支，這次來介紹更為進階的 rebase 方法合併分支。一般的 merge 方法就只是單純的將兩個分支進行合併，而 rebase 方法可以在不額外生成新 commit 的狀況下進行合併，達到精簡化的目的，且還提供了互動模式，針對時不時 commit 的人特別有用，能夠將零碎的 commit 紀錄依造自己需求做修改，以保證最後分享給夥伴的內容是有條理的。此篇將介紹如何使用 rebase 合併分支，過程也會提到衝突的解決辦法，最後說明何謂 rebase 互動模式。

## 筆記重點

- rebase 分支合併與處理方式
- rebase 衝突發生並解決
- rebase 互動模式 - 修改歷史訊息
- rebase 互動模式 - 合併或拆分 commit 紀錄
- rebase 互動模式 - 刪除或調整 commit 紀錄
- 使用 git pull <span>-</span><span>-</span>rebase 處理遠端提交
- Git 指令回顧

## rebase 分支合併與處理方式

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

不用緊張，先讓我們用 `git status` 壓壓驚：

![查看檔案狀態-1](https://i.imgur.com/LpHqBoj.png)

你會發現它提示了 `rebase in progress` 代表卡住了，開啟 Sourcetree 可以看得更清楚：

![Sourcetree](https://i.imgur.com/RPB0Mnd.png)

從上面顯示可以得知，`2ca0999` 與 `3cc7339` 已被成功處理，但 `b1d9a97` 節點似乎發生衝突導致卡住，在前面的檔案狀態中，提示了可使用以下指令操作目前的 rebase 狀態：

- 跳過當下 commit，並執行下一個 commit：

```bash
git rebase --skip
```

- 取消 rebase 操作，回到 rebase 前狀態：

```bash
git rebase --abort
```

這幾個指令看來都是逃避用的，都到這一步了，我們怎麼可能半途而廢，遇到問題解決不就得了，解法與 `git merge` 差不多，打開狀態為 `both modified` 的檔案：

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

## rebase 互動模式 - 修改歷史訊息

前面都是介紹 rebase 該如何針對兩個分支進行合併，利用依序剪下貼上的概念達到重整的效果，但你以為重整效果只能在兩個分支合併時才觸發嗎？這你就錯了，它還可以針對舊有紀錄做重整啊！你可以把它理解為自己合併自己導致觸發的概念，主要依靠其互動模式而進行，讓我們直接實際操作一番。

目前的線路圖狀態為：

![查看目前 commit 紀錄-10](https://i.imgur.com/kNrcSRP.png)

假設我們要重整 `b2179fc` 到 `b3c71bc` 間的紀錄，輸入以下指令以啟動互動模式：

```bash
git rebase -i b3c71bc
```

`-i` 這個參數，全名是 `--interactive`，也就是互動模式，此時會跳出預設編輯器視窗：

![git rebase -i 互動模式](https://i.imgur.com/maslzmh.png)

預設的 rebase 模式為 `pick`，意思是「保留這次的 commit，不做任何修改」，你可以嘗試在此情況下直接 `:wq`，你的 commit 紀錄將不會有任何的改變。

還記得之前介紹的 `git commit --amend` 命令嗎？主要可用來修改最後一次提交的 commit 紀錄訊息，但假設我們要修改更以前的 commit 紀錄訊息呢？這時候該怎麼辦？使用 `reword` 模式：

![修改為 reword 選項](https://i.imgur.com/UoQVBkk.png)

這邊補充一點，傳統使用 `git log` 最新紀錄是顯示在最上面，但在互動模式的顯示中是顯示在最下面，你可以把它看做相反的概念；`reword` 模式主要用來修改以提交的紀錄，且不限多久以前的紀錄，操作方法也很簡單，只需要將 `pick` 更改為 `reword` 即可，上面示範了修改 `82c681b` 與 `47701bd` 的紀錄訊息，此時會跳出修改訊息的視窗：

![修改訊息視窗-1](https://i.imgur.com/Fs5MNQF.png)

此為 `82c681b` 的原始紀錄訊息，你可以隨意的更改訊息，接著一樣 `:wq` 儲存後離開，此時又會再跳出 `47701bd` 的修改訊息視窗：

![修改訊息視窗-2](https://i.imgur.com/mINOLTL.png)

一樣修改成你想要訊息 `:wq` 儲存後離開，假設你之後的 commit 紀錄沒有要做任何的修改，最後就會跳出成功修改訊息的提示，讓我們來看目前的線路圖狀態：

![查看目前 commit 紀錄-11](https://i.imgur.com/Ei24Pid.png)

你會發現訊息確實是修改了，但我們不是只有修改 `06380be` (原來的 `82c681b`) 與 `e98f2b8` (原來的 `47701bd`) 而已嗎？怎會連同之後的全部 commit 紀錄也被修改 (生成新 SHA-1 物件)了呢？原理如同之前所說，父子關係改變，導致生成新的 SHA-1 物件，但本質上還是一樣的東西，就這麼簡單。

## rebase 互動模式 - 合併或拆分 commit 紀錄

有時候我們會為了記錄特定的事情而提交多餘的 commit 紀錄，拿前面例子來看：

![查看目前 commit 紀錄-12](https://i.imgur.com/Ei24Pid.png)

像是 `06380be` 與 `e98f2b8` 這兩個節點都是在做新增檔案的行為，又不是什麼多重要的行為，建議以單個節點的方式存在，避免線路圖過於混亂，此時就是 `squash` 模式出馬的時候了，執行以下命令：

```bash
git rebase -i b3c71bc
```

這邊要注意，並不是一定要選擇 `b3c71bc` 這個節點才能夠啟動互動模式，只是我習慣選取大範圍的節點好方便選取罷了，你可以隨意的修改選取的範圍，只要符合你的需求就好，此時一樣會跳出互動模式視窗：

![git rebase -i 互動模式](https://i.imgur.com/hFyoNAW.png)

`squash` 模式主要用來合併 commit 紀錄，你沒有看錯，commit 還真的能合併，請將須合併節點從原本的 `pick` 修改為 `squash` 模式：

![修改為 squash 選項](https://i.imgur.com/3EolJAh.png)

這邊要注意，並不是將 `06380be` 與 `e98f2b8` 都選為 `squash` 模式，這樣會導致一併被合併到 `2d0d29c` 這一個節點，所謂的合併是指合併到前一個節點，代表這邊只需要合併 `e98f2b8` 就可以達成目的了，`:wq` 後會跳出編輯 commit 訊息的視窗：

![合併訊息](https://i.imgur.com/Xsum3Z4.png)

從提示的內容可以得知，所謂的合併紀錄，其實是將指定的 commit 拆掉並將檔案提交至索引區，為什麼會跳出訊息的視窗呢？答案也很明顯了，這一步就是在做提交至本地數據庫的動作，請將被合併的訊息內容註解掉，並修改合併至的訊息內容，此時 `:wq` 即可完成合併動作，讓我們來看目前的線路圖狀態：

![查看目前 commit 紀錄-13](https://i.imgur.com/o46DLNT.png)

原有的 `06380be` 與 `e98f2b8` 以被合併成 `b9fec18`，且由於父子關係改變，後面所有的 commit 都經過重新計算生成了新的 commit 紀錄。

你可能會問，既然 commit 可以合併，是不是也能夠拆分呢？沒錯！還真的可以，執行以下命令已啟動互動模式：

```bash
git rebase -i b3c71bc
```

假設我們要把剛剛合併完成的 `b9fec18` 拆分成原來的兩個 commit，在需拆分的 commit 設置 `edit` 模式：

![修改為 edit 選項](https://i.imgur.com/5I1qfZi.png)

`edit` 模式可讓我們編輯指定的 commit 節點，你不用把它想得太複雜，先讓我們開啟線路圖狀態：

![查看目前 commit 紀錄-14](https://i.imgur.com/hRPVAuq.png)

你會發現 rebase 卡在了 `b9fec18` 節點，這才導致 `HEAD` 指向了這一個節點，拆分 commit 非常的簡單，還記得 `reset` 指令嗎？把檔案丟回工作目錄重新跑一次流程不就達到目的了？執行以下命令：

```bash
git reset HEAD^ --mixed
```

`--mixed` 是 `reset` 的預設模式，可加可不加，這邊千萬不要用 `--hard` 模式啊！你的檔案會被徹底丟掉，讓我們來看目前狀態：

![查看檔案狀態-3](https://i.imgur.com/26fTkBx.png)

原本 `b9fec18` 的檔案都被丟回工作目錄了，接下來就只需要各別提交 commit 即可完成目的：

```bash
git add all.js

git commit -m 'add all.js'

git add db.json

git commit -m 'add db.json'
```

這時候還沒有結束喔！目前我們還是處於 rebase 的狀態，執行以下指令跳到下個進程：

```bash
git rebase --continue
```

大功告成！此時的線路圖狀態為：

![查看目前 commit 紀錄-15](https://i.imgur.com/h3yg00e.png)

`b9fec18` 已被拆分成 `74b2f71` 與 `d54d71d`，跑過一次上面流程，你會發現 `edit` 模式可以做非常多的事情，你可以嘗試在指定的節點新增 commit 紀錄看看，這邊就不做示範了，差別只在於 `HEAD` 狀態下想要做什麼動作而已。

## rebase 互動模式 - 刪除或調整 commit 紀錄

前面介紹了 rebase 各種的操作，應該夠你玩一陣子了，這邊來補充一些基本的操作，使用以下命令啟動互動模式：

```bash
git rebase -i b3c71bc
```

這次來介紹 `drop` 模式，此模式主要可用來刪除指定的 commit 紀錄，假設我們要刪除 `d54d71d` 這個 commit，將 `pick` 改為 `drop`：

![選改為 deop 選項](https://i.imgur.com/EYHYH1z.png)

你如果嫌 `drop` 模式還需要打字，你可以直接把想要刪除的 commit 整行刪除，你沒有看錯，就是整行刪除，這樣 rebase 就不會去處理那一個 commit，也就達到與 `drop` 相同的目的，讓我們來看 `:wq` 後的線路圖狀態：

![查看目前 commit 紀錄-16](https://i.imgur.com/PZnfFOw.png)

`d54d71d` 已經被我們刪除了，相比於上面的模式，`drop` 可能是最單純的一個模式。

假設你覺得現在的 commit 流程有點怪怪的，你也可以任意調整 commit 的順序，老樣子，使用以下指令開啟互動模式：

```bash
git rebase -i b3c71bc
```

在這邊我們將 `74b2f71` 調整到最新的 commit 上，如下所示：

![調整 commit 順序](https://i.imgur.com/TZNYGFB.png)

其實就只要把 commit 移動到想要的位置就可以了，此時一樣 `:wq` 並查看線路圖狀態：

![查看目前 commit 紀錄-17](https://i.imgur.com/pbVFJQd.png)

`74b2f71` 就被我們移動到指定的位置上了，在每次調整 commit 時，千萬要注意相依性的問題！

上面針對 rebase 的操作都是屬於合理的範圍內，何謂合理呢？就是指在不發生衝突的狀態下完成目的，那何謂不合理呢？我們拿上面最後這張流程圖來做說明，假設我們把 `449ff41` 移到 `e91dee5` 之後，此時就會跳出衝突等待我們處理，一般來說不建議這樣做，rebase 雖然可達到重整的作用，但還是必須考慮到相依性的問題，像是剛剛提到的範例，我們都還沒有新增 `all.css` 何來修改 `all.css` 呢？這邊要特別的注意。

## 使用 git pull <span>-</span><span>-</span>rebase 處理遠端提交

事實上，rebase 主要都是被用在尚未提交至遠端的 commit，達到重整的作用，以及多人協作時在同一條分支上的開發，避免產生多餘的 commit 紀錄，在這邊我們來模擬多人協作時的狀況：

> 這邊以資料夾名稱辨認當前的用戶

A 夥伴進行初始化專案動作：

```bash
mkdir a-repository

git init

touch index.html

git add .

git commit -m 'add index.html'

... edit index.html

git commit -am 'change index.html'

git remote add origin git@github.com:awdr74100/pull-rebase-demo.git

git push -u origin master
```

B 夥伴克隆回本地並提交一個 commit：

```bash
git clone git@github.com:awdr74100/pull-rebase-demo.git b-repository

touch all.css

git add .

git commit -m 'add all.css'
```

A 夥伴與 B 夥伴屬共同開發，A 夥伴此時提交了一個 commit：

```bash
touch all.js

git add .

git commit -m 'add all.js'

git push
```

B 夥伴上傳時肯定會跳出衝突：

```bash
git push
```

衝突內容如下：

![git push 發生衝突](https://i.imgur.com/dBeRFmk.png)

理由很簡單，Git 發現遠端分支有新的 commit 尚未同步到本地，導致無法推送，這些在介紹分支的章節都有提到，解決方法如下：

> 這邊也可以使用 git pull，預設是使用 merge 方式合併分支

```bash
git fetch

git merge origin/master

# 此時會跳出輸入 commit 訊息的視窗
```

此時的線路圖狀態如下：

![查看目前 commit 紀錄-18](https://i.imgur.com/bRNHacH.png)

發現問題了嗎？明明 A 夥伴與 B 夥伴都是在 `master` 這條分支進行開發，這樣子的處理方式會導致產生額外的 `9dba8b9` 這個節點，如果頻繁的操作，豈不是會增加一堆類似的節點？整個線路圖變得非常不易閱讀，此時就是 rebase 出馬的時候了，先讓我們回復到尚未 merge 的狀態：

```bash
git reset HEAD^ --hard
```

目前的線路圖狀態為：

![查看目前 commit 紀錄-19](https://i.imgur.com/VeKksd3.png)

改使用 rebase 合併遠端提交：

```bash
git rebase origin/master
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-20](https://i.imgur.com/dTr5OTw.png)

是不是變得乾淨且合理許多？同樣的結果，我們也可以使用 `git pull` 來完成，請先將 B 夥伴內容推至遠端：

```bash
git push
```

A 夥伴與遠端同步：

```bash
git fetch

git merge origin/master
```

A 夥伴提交一個可能發生衝突的 commit 並推至遠端：

```bash
... edit index.html

git commit -am 'change index.html > title'

git push
```

B 夥伴也提交一個可能發生衝突的 commit：

```bash
... edit index.html

git commit -am 'change index.html > title'
```

又回到了剛剛的情境，B 夥伴的數據庫有尚未同步的分支，此時 Push 會發生衝突，剛剛的最完美解法是 `git fetch + git rebase`，這次我們換 `git pull`：

```bash
git pull --rebase
```

git pull 預設是使用 `merge` 來合併分支，我們可透過傳遞 `--rebase` 選項告知改使用 rebase 合併分支，此時就達到與 `git fetch + git rebase` 一樣的效用，不過在上面範例中，我們有刻意加入衝突的行為，此時會跳出需修復衝突的提示：

![git pull --rebase 衝突](https://i.imgur.com/AJAYMnE.png)

解決方法如同之前所介紹，這邊就不再做贅述，最後記得輸入 `git rebase --continue`：

```bash
... fix conflict

git add .

git rebase --continue
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-21](https://i.imgur.com/sZ3QBLe.png)

大功告成！如果硬要說 `git pull --rebase` 相比 `git pull` 有什麼令人困擾的地方，可能就是遇到衝突時會比較麻煩點，這其實也是 rebase 的通病，merge 如果發生衝突，你只需要解決衝突一次，之後 coomit 出去就完事了，而 rebase 的衝突你可能要修復數次，畢竟他是以依序的方式進行處理，有利也有弊，判斷當下情境去做選擇才是上策。

## Git 指令回顧

```bash
# 合併分支 (使用 rebase 方式)
git rebase <branch_name>

# 還原 rebase 操作 (使用 ORIG_HEAD)
git reset ORIG_HEAD --hard

# 還原 rebase 操作 (從 reflog 查詢)
git reset <SHA-1> --hard

# 跳過當下 commit，並執行下一個 commit：
git rebase --skip

# 取消 rebase 操作，回到 rebase 前狀態：
git rebase --abort

# 進入下一個 rebase 進程
git rebase --continue

# 在指定範圍啟動 rebase 互動模式
git rebase -i <SHA-1>

# 在指定範圍啟動 rebase 互動模式 (同上)
git rebase --interactive <SHA-1>

# 互動可選模式：
# pick <commit> = 保留這次 commit，不做任何修改
# reword <commit> = 修改 commit 訊息內容
# squash <commit> = 合併 commit (合併至前一個節點)
# edit <commit> = 編輯 commit (停留在指定 commit，可做新增、修改的操作)
# drop <commit> = 刪除 commit (與移除整行提示同結果)

# 將遠端分支合併至本地 (使用 rebase 合併)
git pull --rebase
```
