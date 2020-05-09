---
title: Git 版本控制系統 - Fork 專案與 Pull Request 請求合併
description:
  [
    目前我們都是在自己的遠端數據庫做操作，由於是自己的並不會遇到所謂的權限問題，但假如我們也想操作其他開發者的遠端數據庫呢？比如你正在使用的套件存在 Bug，而你剛好有能力修復，將專案克隆並修復後，你想把最新提交推至原作的遠端數據庫，這時就會遇到權限不足的問題，你可能透過 Email 請作者開權限給你，但你覺得他會理你嗎？通常這個過程我們都會使用 Fork 與 Pull Request 來完成，先將原作的數據庫 Fork 至帳號底下，待我們克隆並修復完成後，再透過 Pull Request 請求作者合併更新。,
  ]
categories: [Git]
tags: [Git, GitHub]
date: 2020-05-07 16:32:16
updated: 2020-05-08 23:06:49
---

## 前言

目前我們都是在自己的遠端數據庫做操作，由於是自己的並不會遇到所謂的權限問題，但假如我們也想操作其他開發者的遠端數據庫呢？比如你正在使用的套件存在 Bug，而你剛好有能力修復，將專案克隆並修復後，你想把最新提交推至原作的遠端數據庫，這時就會遇到權限不足的問題，你可能透過 Email 請作者開權限給你，但你覺得他會理你嗎？通常這個過程我們都會使用 Fork 與 Pull Request 來完成，先將原作的數據庫 Fork 至帳號底下，待我們克隆並修復完成後，再透過 Pull Request 請求作者合併更新。

## 筆記重點

- 推至遠端時所遇權限不足問題
- Fork 其他開發者專案
- 發送 Pull Request 請求合併
- 處理 Pull Request 檢查是否合併
- 同步 Pull Request 後的專案進度
- Pull Request 衝突解決辦法

## 推至遠端時所遇權限不足問題

這邊我們來模擬推至遠端時所遇權限不足問題，假設我們的專案使用了 Vue 進行開發，但發現存在一處 Bug 須修復，我們可能會這樣做：

![Vue.js](https://i.imgur.com/mTLV1iZ.png)

如同處理自己的遠端數據庫一般，可使用 HTTPS 或 SSH 方式克隆回本地：

```bash
git clone -b dev git@github.com:vuejs/vue.git vue

cd vue
```

這邊要注意，並不是說操作其他開發者的遠端數據庫時，都會遇到身分驗證的提示，你想想看，我只是單純克隆別人的數據庫，為什麼需要身分驗證呢？如果你不想把數據庫給公開，你可以設置為 `Private` 屬性，此時陌生人就看不到你的遠端數據庫囉，上面提到的都是屬於克隆操作，那假設我們要進行推至遠端的動作呢？

```bash
touch test123.txt

git add .

git commit -m 'add test123.txt'

git push
```

此時會跳出無訪問權限的提示：

![git push 權限不足](https://i.imgur.com/aV3GRpO.png)

這蠻合理的嗎，克隆並不會影響原作者的數據庫，但 Push 就會了，你敢想像自己的遠端數據庫突然被陌生人 `git push -f` 嗎？一般來說我們只能操作自己的遠端數據庫，並不能操作別人的數據庫，但可透過 Fork 與 PR (為 Pull Request 縮寫) 與原作者做交流，了解了原由，接下來讓我們進入到主要的章節吧！

## Fork 其他開發者專案

為了示範原作者與陌生開發者各自的操作，這邊我開了兩支帳號來示範，角色如下：

- 原作者：[lanroya](https://github.com/lanroya)
- 陌生開發者：[awdr74100](https://github.com/awdr74100)

目前我們登入的帳號是 lanroya，建立一個專案並提交兩次 commit 紀錄：

```bash
mkdir pr-demo

cd pr-demo

touch all.css

git add .

git commit -m 'add all.css'

... edit all.css

git commit -am 'edit all.css > .a'
```

假設初步的操作已經完成，在 GitHub 新增一個遠端數據庫並 Push：

```bash
git remote add origin https://github.com/lanroya/pr-demo.git

git push -u origin master
```

此時 lanroya 帳號底下就會有自己的 pr-demo 專案：

![lanroya 帳號底下的專案](https://i.imgur.com/cm8V25n.png)

接著 awdr74100 開發者發現這個專案蠻有趣的但存在些 Bug，他想要幫忙修復，先執行 Fork：

![fork 專案](https://i.imgur.com/6JPxfh8.png)

這邊要注意，fork 並不屬於 Git 的指令，它是 GitHub 等遠端伺服器相當特別的功能，主要能將指定專案複製一份到你的帳號底下，當你按下了 fork 按鈕，會跳出以下畫面：

![fork 轉場畫面](https://i.imgur.com/CT2AO0V.png)

代表正在 fork 此專案到你的帳號底下，完成後會跳轉到你帳號底下的這個專案：

![fork 完成後跳轉](https://i.imgur.com/uUvMGAc.png)

到這邊就已經完成 fork 的動作了，可以到帳號底下查看是否有這一個目標專案。

你可能會好奇，這樣有什麼作用？還記得上面提到的權限不足問題嗎？當我們去存取帳號底下除外的專案時，會遇到 Push 操作無訪問權限的提示，而 fork 的用意就是將陌生專案拷貝一份到你的帳號底下，之後我們就可以如同帳號底下專案操作一般，針對此專案進行 Fetch、Pull、Push 的操作，接著我們來修復這個 Bug 吧：

```bash
git clone https://github.com/awdr74100/pr-demo.git pr-demo

cd pr-demo

... edit all.css

git commit -am 'edit all.css > b'
```

當我們修復完成後，由於是自己帳號底下的數據庫，並不會造成所謂的 Push 無訪問權限問題：

![-3-(https://i.imgur.com/sbp2WfH.png)1](https://i.imgur.com/T1FnyUf.png)

目前 Bug 就已經被 awdr74100 修復了，但這邊所謂的修復是指在 awdr74100 拷貝的專案下進行修復，原作者的專案是不受任何影響的，如果要告知原作者 Bug 已被修復，可以使用 Pull Request 功能，直接進入下個章節。

## 發送 Pull Request 請求合併

目前 awdr74100 已經把 Bug 給修復完成了，但 lanroya 還不知道，這過程可透過 PR (Pull Request) 來完成：

![New Pull Request](https://i.imgur.com/yyrLP8m.png)

在 awdr74100 拷貝的專案底下有 Pull request 的區塊可做選擇，點擊後的畫面如上圖，接者點擊 `New pull request` 按鈕，此時會跳出以下畫面：

![發送 Pull Request](https://i.imgur.com/Q8QKJUz.png)

畫面跳轉到了 lanroya 的頁面，這邊我們就可選擇剛剛修復完成的分支進行請求合併，在之前的文章我們有說過 GitHub 等遠端伺服器是採用「合併」的方式來更新內容，Pull Request 你可以把它理解為將最新的 commit 提交丟給原作者，讓原作者判斷是否要合併這一個 commit 提交。

這邊還有一個重點是關於 `Able to merge` 字樣，它能夠告訴你這一個 PR 如果作者接受的話是否會發生衝突，畢竟 PR 不太可能只有一個人發，如果你的專案很知名，像 React、Vue 等等，作者接受了第一個 PR，但要接受第二個 PR 時，就有可能發生錯誤，因為提交紀錄被改變了阿，從原本的兩個 commit，變成了三個 commit，假如你的 PR 還是處於兩個 commit 的狀態，就會跳衝突，這我們之後再說，確認 PR 沒問題後，就可以點擊 `Create pull request` 按鈕囉，此時會切換為以下畫面：

![PR 訊息](https://i.imgur.com/Bn1GUbB.png)

預設的標題為當時提交的 commit 訊息，你可以隨意做修改，如果要進行補充，也可以寫在下方的空白區域內，此區域是支援 Markdown 語法的喔，確認沒問題就可以點擊 `Create pull request` 發送 PR 囉，結果畫面為：

![PR 發送成功](https://i.imgur.com/WMvvX3P.png)

到這邊我們的 PR 就已經發送成功，你可以在下方繼續進行補充，接下來就等作者 (lanroya) 檢查並判斷是否接受合併囉。

## 處理 Pull Request 檢查是否合併

接著我們換原作者 (lanroya) 的部分，登入 lanroya 帳號後並切換到指定數據庫會看到以下畫面：

> 當有 PR 請求時，作者也會收到 Email 的通知

![原作者 GitHub 畫面](https://i.imgur.com/Yx7XR6c.png)

有發現不一樣的地方嗎？沒錯，有人發送了 Pull Request 給我們，讓我們點擊進去看看：

![Pull Request 清單](https://i.imgur.com/uQvJqEE.png)

在這邊你可以看到所有的 PR 紀錄，正好第一筆不就是剛剛 awdr74100 發送給我們的 PR 嗎？點擊進入：

![PR 詳細頁面](https://i.imgur.com/6qrEbrY.png)

你可以看到有關這個 PR 的各種資訊，比如說提交幾次 commit 阿，代碼哪裡做了更動阿，這些都看的到，你也可以在下方的互動區塊與提交者 (awdr74100) 做互動，這邊最重要的是檢查此 PR 是否會發生衝突，你可以直接從它的提示去得知，如果確認都沒問題，就直接按下 `Merge pull request` 按鈕吧！

此時會要求你輸入此次提交的 commit 紀錄訊息，就如同 `non-fast-forward` 處理一般，這邊我們採用預設訊息即可，按下 `Confirm merge` 確認合併吧！

![Confirm merge](https://i.imgur.com/6qrEbrY.png)

此時 PR 狀態會從 `Open` 更改為 `Merged`，代表合併成功囉。

那要怎麼確認 PR 是否真的合併成功呢？你可以切換到主頁面並點選 `commits` 查看所有提交紀錄：

![commits 查看所有提交紀錄](https://i.imgur.com/VbpUVlz.png)

或是直接在 lanroya 的 bash 輸入以下指令：

```bash
git fetch

# or

git pull
```

因為遠端數據庫有了新的提交紀錄，我們可以把它 Fetch 回來並查看：

![fetch PR 提交](https://i.imgur.com/Ug6kmvm.png)

看到我們剛剛 merge 的 PR 提交囉，此時一樣使用 merge 即可同步遠端的提交：

```bash
git merge origin/master
```

以上就是整個發送 PR 的流程，是不是很有趣？發送 PR 不只可以應用在開源專案上，企業內部也很常使用此方式來處理夥伴間的提交，達到流程化的效果。

## 同步 Pull Request 後的專案進度

這邊我們做一個補充，原作者要同步遠端數據庫的內容相對簡單，上面就已經有示範，但陌生開發者 (awdr74100) 可能就需要點技巧了，發送的 PR 就算已被原作者合併，fork 過來的專案也不會有任何變化，帳號底下的這個專案看起來雖然是個克隆體，但本質上與原作者的數據庫是完全不一樣的東西，如果想要完成同步，有以下方法可做選擇：

- 把克隆專案改掉，重新 fork 專案
- 新增原作遠端數據庫位址，並手動同步專案

砍掉重練方法相對簡單，你不需要輸入任何指令，每次 fork 的狀態一定就是最新的，各位可自行試試，這邊就不做示範，我自己是比較習慣新增原作的遠端數據庫位址並手動同步專案，以下為示範：

```bash
git remote add lanroya https://github.com/lanroya/pr-demo.git
```

檢查是否成功新增遠端數據庫位址：

![新增遠端數據庫位址](https://i.imgur.com/SEFwBYP.png)

在前面我們有提到使用 clone 或 fetch 等方式是不會跳出無訪問權限提示的，因為又不影響原作者的數據庫，這邊我們就可以用同樣方式來處理 PR 後的提交紀錄，上面新增了原作者的遠端數據庫位址，接下來進行 fetch 動作：

```bash
git fetch lanroya mastr
```

此時的線路圖狀態為：

![-3-(https://i.imgur.com/sbp2WfH.png)2](https://i.imgur.com/W6c7Con.png)

你會發現原作者的遠端數據庫就被我們拉下來了，接著直接合併即可完成同步動作：

```bash
git merge lanroya/master
```

說真的這也沒多複雜，我比較推薦使用此方式來完成同步操作，某方面來講可能會比較簡單。

## Pull Request 衝突解決辦法

在上面我們有提到 PR 也是會發生衝突的，且機率還挺高的，我們來模擬這一狀況：。

假設原作者 (lanroya) 更新的專案進度：

```bash
... edit all.css

git commit -am 'edit all.css > .c'
```

很自然的將它推上遠端數據庫：

```bash
git push
```

此時陌生開發者 (awdr74100) 忘記先同步原作者專案就直接發 PR：

```bash
... edit all.css

git commit -am 'edit all.css .c'

git push
```

在這邊我們刻意模擬同步的衝突以及代碼的衝突，此時 PR 的畫面為：

![PR 發生衝突](https://i.imgur.com/r7gkfAH.png)

你會發現它顯示了 `Can't automatically merge` 字樣，代表此 PR 會發生合併衝突，雖然你還是能把此 PR 發出去，但我建議在未發送前就解決這個衝突，你現在不解決，最後原作者還是得解決，但它合併的意願可能就不大了，解決辦法很簡單，如同我們自己的遠端數據庫合併衝突辦法：

```bash
git fetch lanroya master
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-3](https://i.imgur.com/sbp2WfH.png)

原來是未同步提交紀錄所發生的衝突阿，此時我們可以這樣做：

```bash
git rebase lanroya/master
```

或

```bash
git merge lanroya/master
```

由於我不想要提交額外的 commit 紀錄，這邊我使用 rebase 來合併分支，如果順利的話分支就會被合併，但剛剛我也刻意模仿代碼發生的衝突，此時也就會跳出衝突的錯誤：

![rebase 發生衝突](https://i.imgur.com/mlQvYgH.png)

關於 rebase 如何解決衝突，之前在 [rebase 文章](https://awdr74100.github.io/2020-05-04-git-rebase/) 就有完整的解說，有興趣的可以過去看看，這邊就快速帶過：

```bash
... reslove conflict

git add .

git rebase --continue
```

此時的線路圖狀態為：

![查看目前 commit 紀錄-4](https://i.imgur.com/O3Lcd4S.png)

這邊要注意，如果你是使用 merge 來合併分支，等等 Push 時就不會發生衝突，而如果你是使用 rebase 來合併分支，由於遠端指向的 `38a67a3` 提交已被拋棄 (隱藏)，本地改而指向剛剛 rebase 新生成的 `eddd006` 節點，歷史紀錄不同就會導致衝突，這邊很適合使用以下指令：

```bash
git push -f
```

你可能會想，不是盡量不要使用這個命令嗎？沒錯，但此提交也只有我一個人在運作，何況我們沒有修改到原作者的紀錄阿，這種情況就比較沒關係，讓我們來看目前發 PR 還會不會有衝突：

![PR 衝突以解決](https://i.imgur.com/57BVALN.png)

這一次的 PR 就不會有合併衝突囉，後面的流程就如同前面所介紹，各位可以自己跑一次看看。


