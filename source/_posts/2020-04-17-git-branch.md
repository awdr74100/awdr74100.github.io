---
title: Git 版本控制系統 - 分支的建立與合併分支中的快轉機制
description:
  [
    上次介紹了 Git 基本的工作流程，這一次來介紹 Git 另一個強大的功能也就是分支 (branch) 的部分。你如果曾上網搜尋 Git 的圖片，你會發現別人的 Git 怎看起來都好複雜，一堆各種顏色的線，這些線就是屬於分支，通常在多人開發時，我們不太可能像之前所操作的，只在 master 這一條主線進行開發，我們會開一條分支專門處理專案的特定部分，最後當我們要做實際呈現時，才會將此分支合併到主線上面，而合併分支在 Git 又有所謂的快轉機制，即 fast-forward，該如何正確的建立分支與合併分支，本篇都會講到。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-17 20:45:54
updated: 2020-04-18 22:51:20
---

## 前言

上次介紹了 Git 基本的工作流程，這一次來介紹 Git 另一個強大的功能也就是分支 (branch) 的部分。你如果曾上網搜尋 Git 的圖片，你會發現別人的 Git 怎看起來都好複雜，一堆各種顏色的線，這些線就是屬於分支，通常在多人開發時，我們不太可能像之前所操作的，只在 master 這一條主線進行開發，我們會開一條分支專門處理專案的特定部分，最後當我們要做實際呈現時，才會將此分支合併到主線上面，而合併分支在 Git 又有所謂的快轉機制，即 fast-forward，該如何正確的建立分支與合併分支，本篇都會講到。

## 筆記重點

- 分支的建立與合併
- fast-forward 與 non-fast-forward 合併差異
- 重命名指定分支
- 刪除指定分支
- HEAD 作用以及何謂 detached HEAD
- Git 指令回顧

## 分支的建立與合併

讓我們先新增一個專案並提交兩次 commit 紀錄：

```bash
mkdir project

cd project

git init
Initialized empty Git repository in C:/Users/a7894/Desktop/project/.git/

touch index.html

git add .

git commit -m '新增 index.html'

touch all.css

git add .

git commit -m '新增 all.css'
```

使用 `git log` 查看目前 commit 紀錄：

![git log](https://i.imgur.com/Bv2uj5G.png)

如果有看過上一篇文章的人，應該對上面流程很熟悉了才對，接下來進入重頭戲的部分，讓我們先來看目前本地存在那些分支：

```bash
git branch
```

此時會顯示：

![git branch](https://i.imgur.com/E5h8awt.png)

此道命令主要用於查看所有的分支，你就只會看到 `master` 這條分支，因為我們還尚未建立其他的分支，而 `master` 分支是初始化 Git 時，同時就被建立出來的，這也是為什麼目前線路圖都只有一條線的原因，接下來使用以下命令建立 `dev` 分支：

```bash
git branch dev
```

此時使用 `git log --oneline --graph` 查看目前 commit 紀錄：

![查看 commit 紀錄-1](https://i.imgur.com/gsKEHvq.png)

你會發現在我們第二個 commit 紀錄的中，新增了綠色字的 `dev` 分支，因為我們剛剛是在 `master` 分支的最新狀態下建立此分支，所以此分支的內容就會是與 `master` 一模一樣，這點要注意，你可以把它想像成一個當前狀態下的複製品，接下來我們要切換到 `dev` 進行某些操作，執行以下命令：

```bash
git checkout dev
```

此時會發現右邊的分支名稱改變了：

![git checkout dev](https://i.imgur.com/8pqcys4.png)

假設我們要在 `dev` 分支做某些事情：

```bash
touch db.json

git add .

git commit -m '新增 db.json'
```

使用 `git log --oneline --graph` 查看：

![查看 commit 紀錄-2](https://i.imgur.com/Gly684g.png)

你會發現新提交的 commit 紀錄上，只存在 `dev` 這一個分支，且 `HEAD` 也指向這一個紀錄上，關於 `HEAD` 的解釋，下面會再做說明，在來看到 `master` 分支的部分，它落後了 `dev` 一個 commit 紀錄，因為我們剛剛是在 `dev` 分支進行開發，才會導致這樣的結果，接下來我們切回到 `master` 分支看看，執行以下命令：

```bash
git checkout master
```

![切回到 master 分支](https://i.imgur.com/OUqK2x4.png)

有沒有發現到一個很神奇的事情？我們的 `db.json` 檔案不見了！因為 `master` 分支是不存在這一個 commit 的，如果此時你切換到 `dev` 分支，`db.json` 檔案就又會出現了，在這邊補充一個指令：

```bash
git checkout -b dev
```

這道指令同時完成了 `git branch dev` 與 `git checkout dev` 的動作，就不用這麼麻煩需要先建立分支後在切換分支。我們繼續上面的進度，接下來進行合併的動作，執行以下命令：

```bash
git merge dev
```

請注意，我們目前所在的分支是 `master`，利用 `master` 分支合併 `dev` 分支，結果如下：

![git merge dev](https://i.imgur.com/HzNb46g.png)

使用 `git log --oneline --graph` 查看：

![查看 commit 紀錄-3](https://i.imgur.com/rrg34x6.png)

你現在一定很困惑，這樣子的結果跟直接在 `master` 分支提交 commit 紀錄有何差別？確實是沒有差別的，因為我們採用的是 `fast-forward` 方式合併分支，在線路圖是看不到 `db.json` 是由 `dev` 所開發而成的，關於 `fast-forward` 機制，將在下面做介紹，在這邊我們只需要知道如何建立分支與合併分支就可以了。

## fast-forward 與 non-fast-forward 合併差異

讓我們在次使用 `dev` 分支並提交兩次 commit 紀錄：

```bash
git checkout dev
Switched to branch 'dev'

touch bugfix.txt

git add .

git commit -m '修復 bug'

touch edit.txt

git add .

git commit -m '編輯文本'
```

使用 `git log --oneline --graph` 查看：

![查看 commit 紀錄-4](https://i.imgur.com/0vvhbbb.png)

剛剛提到的問題是，當我們在此情況下切換到 `master` 分支並使用 `git merge dev` 合併 `dev` 分支，會導致無法紀錄 `dev` 分支做了什麼事情，這一次我們改使用以下指令試試看：

```bash
git merge dev --no-ff
```

此時會跳出提交 commit 才需輸入的訊息欄位：

![commit 提交訊息](https://i.imgur.com/EYriIpE.png)

由於我已更改預設編輯器，你看到的可能是 Vim 的視窗，不過這都沒差，我們可以採用預設的訊息即可，接著儲存後關閉檔案，此時會跳出提交 commit 的訊息，如下所示：

![git merge dev --no-ff](https://i.imgur.com/kluzaio.png)

你一定覺得很神奇，為什麼會跳出 commit 提交的訊息呢？不用緊張，先用 `git log` 壓壓驚：

![取消快轉機制](https://i.imgur.com/QsawRvA.png)

神奇的事情發生了，線路圖多了一條分支的線路，也就是 `dev` 分支的線路圖，且在最新的 commit 紀錄上，新增了一個合併分支的 commit 紀錄，這樣子的結果才能夠清楚辨別哪些 commit 是由那些分支提交而成的，讓我們回過頭來說明何謂 `fast-forward` 快轉機制：

- `fast-forward`：將被合併分支紀錄合併至請求合併分支內，意被合併分支紀錄將被刪除，不會有獨立線路可參照
- `non-fast-forward`：保留被合併分支的紀錄，意被合併分支紀錄不會被刪除，會有獨立線路可參照

以實際層面來講呢，就是 `dev` 分支提交了許多次 commit 紀錄，但 `master` 分支沒有任何的變化，此時如果直接在 `master` 分支合併 `dev` 分支，預設就會採用 `fast-forward` 快轉合併，即會造成最初的結果，而使用 `--no-ff` 則是取消快轉機制，保留被合併分支的全部記錄，這樣就會產生剛剛實驗的結果。

你可能會想，那假設我在 `dev` 分支提交 commit 紀錄後，又回到 `master` 分支提交 commit 呢？我們直接來模擬這一個狀況：

```bash
git checkout dev

touch all.js

git add .

git commit -m '新增 all.js'

git checkout master

touch all.scss

git add .

git commit -m '新增 all.scss'
```

這邊必須使用 `git log --oneline --graph --all` 檢查所有分支狀況：

![查看 commit 紀錄-5](https://i.imgur.com/nT54FUb.png)

可能用內建的線路圖不是這麼好懂，推薦大家去下載 [Sourcetree](https://www.sourcetreeapp.com/) 工具，以下為 Sourcetree 顯示的效果：

![Sourcetree 線路圖](https://i.imgur.com/wj4q9T8.png)

這樣看起來比較好懂，`master` 與 `dev` 都各提交了一次 commit，像在這種情況下，我們就不需要添加 `--no-ff` 選項，預設就以使用 `non-fast-forward`，直接執行 `git merge dev`：

![查看 commit 紀錄-6](https://i.imgur.com/14gyq8r.png)

此時的線路圖就會是如同前面使用 `--no-ff` 一樣，這也就是 Git 內建的 fast-forward 快轉機制的各種變化，主要就是看你想呈現怎樣的線路圖，假設 `master` 分支在建立 `dev` 分支後沒有做任何動作，反而是 `dev` 提交了多次 commit，這時候如果你想要使用 `fast-forward` 快轉合併，直接下 `git merge dev` 就可以了，假設你想要保留分支的 commit 紀錄，就下 `git merge dev --no-ff` 取消快轉，此時就會呈現各分支的 commit 紀錄。另外一種情況是，在 `master` 建立了 `dev` 分支，且 `dev` 分支也提交了多次 commit 紀錄，但你發現了 Bug，回過頭來修復 `master` 分支，同時提交了 commit 紀錄，這時 `dev` 與 `master` 分支都有較新的 commit 紀錄，此時就不需要使用 `--no-ff`，因為兩個分支本身已擁有獨自的線路，直接下 `git merge dev` 就可以了。

## 重命名指定分支

先來看一下目前有哪些分支：

![查看目前有那些分支](https://i.imgur.com/4QmXvpN.png)

有時候當我們專案進行到一半會想要更改分支的名稱，此時可以使用以下指令：

```bash
git branch -m dev development
```

再次使用 `git branch` 查看目前所有分支：

![已修改 dev 分支名稱](https://i.imgur.com/GxiZTVP.png)

此時分支名稱就已經被我們修改了，只需要透過 `-m` 參數即可修改分支名稱，前面為當前的分支名稱，後面為更改的名稱，且這種作法，就只是單純的改名稱而已，實際上是不影響任何 commit 紀錄的喔。

## 刪除指定分支

通常刪除分支有兩種情況，第一種情況是分支尚未被合併至任何分支，如下所示：

![新增 prod 分支](https://i.imgur.com/KS3t5iC.png)

從上面可以發現，我們新增了一個 `prod` 分支並提交一次 commit 紀錄，此時使用以下指令是無法刪除分支的：

```bash
git branch -d prod
```

會跳出以下錯誤：

![need use git branch -D prod](https://i.imgur.com/dCxRdfG.png)

因為我們尚未將 `prod` 合併至任何分支，才會跳出此錯誤，如果你堅持要刪除這一個分支，可以使用以下命令：

```bash
git branch -D prod
```

`-D` 代表的是強制刪除的意思，那可能就有人會問 `-d` 是用在哪種情況呢？其實蠻好理解的，就是用在分支已被合併的強況下，我們可以嘗試刪除 `development` 分支：

![使用 git branch -d development](https://i.imgur.com/5K5ZAMo.png)

此時 `development` 分支就被我們刪除囉，我們可以使用 `git log` 查看目前線路圖長啥樣：

![查看 commit 紀錄-7](https://i.imgur.com/uDXOFMr.png)

你會發現就算分支被刪除了，commit 紀錄點還是在，因為我們所稱的分支只是指向某個 commit 的指標，刪除這個指標並不會造成那些 commit 消失。你可能會問，那我可以恢復剛剛刪除的 `development` 分支嗎？當然可以啊！記得我們剛剛刪除分支時跳出的 SHA-1 值嗎？就是 `2cf5b96` 這個東西，它其實就是告訴你這個分支最後存在哪一個 commit 節點，所以我們可以利用這一個值將分支附加到這一個 commit 節點上，執行以下命令：

```bash
git branch development 2cf5b96
```

這個指令的意思是「請幫我建立一個叫做 development 的分支，並讓它指向 2cf5b96 這個 commit」，就像是將新增的分支貼在這個 commit 紀錄上的意思，此時我們的分支就又回來囉：

![查看 commit 紀錄-8](https://i.imgur.com/UgJmyeI.png)

這時你可能又會問，如果我剛剛沒有記得 `2cf5b96` 這個 SHA-1 的值呢？就不能回復了？答案是可以的，只不過得使用 `git reflog` 查看歷程記錄，找到剛剛這一個 SHA-1 值，關於這點將在以後的文章在做介紹。

## HEAD 作用以及何謂 detached HEAD

在這邊我們補充一下 HEAD 指標是做什麼用的，先來看我們目前的日誌：

![查看 commit 紀錄-9](https://i.imgur.com/UgJmyeI.png)

在我們先前所做的任何嘗試時，你都會看到這一個 `HEAD` 的指標，也就是目前指向 master 的那一段藍色字，其實理解它非常簡單，**HEAD 是主要用來指向我們目前狀態的東西**，因為我們目前在 `master` 分支的最新 commit 紀錄上，所以它才會指向 `master`，假設我們切換到 `development` 分支：

![查看 commit 紀錄-10](https://i.imgur.com/XeaMcOQ.png)

此時它就會指向 `development` 分支，我們剛剛有提到分支這一個概念是由 commit 紀錄所組成的，這也代表我們可以使用 commit 紀錄的 SHA-1 碼，切換到指定的 commit 紀錄點上：

```bash
git checkout 3c28751
```

此時前面所稱的分支名稱就會更改成 commit 紀錄點的 SHA-1 編號：

![切換到指定 commit 紀錄點](https://i.imgur.com/6fi6xLS.png)

再次查看日誌：

![查看 commit 紀錄-11](https://i.imgur.com/ptm111U.png)

有沒有發現 `HEAD` 改成指向 `3c28751` 這個 commit 紀錄上了？當 `HEAD` 沒有指向任何分支時，我們會稱此狀態為斷頭 (detached HEAD)，你不用把它想得太複雜，就只是 HEAD 剛好指向某個沒有分支指著的 commit 罷了，此時你可以查看目前的專案狀態有什麼變化：

![查看專案是否有變化](https://i.imgur.com/MpHyI8r.png)

與切換分支的結果相同，專案進度回復到了當時的 `3c28751` 節點紀錄上，可能會有人問，那我可以在 detached HEAD 狀態下提交 commit 紀錄嗎？嘗試不就知道了：

```bash
touch test.txt

git add .

git commit -m '新增 test.txt'
```

查看日誌：

![查看 commit 紀錄-12](https://i.imgur.com/E51alx5.png)

你會發現 `HEAD` 又長出了一條分支，嚴格來講不能算是分支，頂多就是一個 commit 記錄才對，名為 `070af85`，你可能會好奇這樣有什麼影響，影響就是當我們的 HEAD 回到其他分支之後，這一個 commit 紀錄就會被隱藏掉，輸入以下指令回到 `master` 最新 commit 紀錄上：

```bash
git checkout master
```

此時會跳出警告：

![有一個 commit 被隱藏](https://i.imgur.com/pSJRHOh.png)

這就是剛剛提到的 commit 被隱藏掉了，當然你也可以使用 `git checkout 070af85` 回到這個 commit 紀錄上，但如果你堅持保留這一個 commit 紀錄，更好的最法是建立一個分支：

```bash
git branch ex 070af85
```

前面有提到，分支的生成會複製當下 commit 紀錄，所以假設你在 `070af85` 節點使用以上命令，此時的日誌為：

![new commit branch](https://i.imgur.com/JTjE16S.png)

以成功在 `070af85` 生成分支囉，接下來就看你要合併阿還是怎麼樣。

讓我們做點複習，`HEAD` 主要用來指向我們目前所在的 commit 紀錄上，方便我們四處查看，當我們使用 `checkout` 切換到沒有分支的 commit 紀錄上時，此狀態稱之為斷頭 `detached HEAD`，在此狀態也可以進行 commit 提交，但要注意在將 HEAD 切換為分支時，此 commit 紀錄會被隱藏掉，如果堅持保留這一個 commit 紀錄，可以在這一個 commit 紀錄上開立分支，這樣就不會被隱藏了。

## Git 指令回顧

```bash
# 查看本地所有分支
git branch

# 建立分支
git branch <branch_name>

# 切換至指定分支
git checkout <branch_name>

# 建立並切換到指定分支
git checkout -b <branch_name>

# 合併分支
git merge <branch_name>

# 合併分支 (採用 non-fast-forward)
git merge <branch_name> --no-ff

# 更改分支名稱
git branch -m <old_branch_name> <new_branch_name>

# 刪除分支 (分支以合併)
git branch -d <branch_name>

# 強制刪除分支 (分支未合併)
git branch -D <branch_name>

# 在指定節點添加分支
git branch <branch_name> <SHA-1>

# 切換到指定 commit 節點
git checkout <SHA-1>
```
