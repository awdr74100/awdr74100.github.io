---
title: Git 版本控制系統 - 分支合併衝突與解決辦法
description:
  [
    在之前我們有提到 Git 主要被使用在多人協作開發，每個人各自完成屬於自己的工作，最後透過合併即可完成應用，但想的簡單，實做起來卻有些困難，過程中難免會有意外發生，比如說 A 同事與 B 同事先前在初始檔案各開了一個分支，但 A 同事發現這一份檔案存在 Bug，於是做了修復的動作，而 B 同事正好也發現了這一個 Bug 也做了修復，此時如果進行合併，就會造成所謂的合併衝突，此狀況不只會發生在本地分支，遠端分支也同樣會發生，該如何解決此類的衝突，也就是本篇的主題。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-22 14:47:31
updated: 2020-04-23 18:40:02
---

## 前言

在之前我們有提到 Git 主要被使用在多人協作開發，每個人各自完成屬於自己的工作，最後透過合併即可完成應用，但想的簡單，實做起來卻有些困難，過程中難免會有意外發生，比如說 A 同事與 B 同事先前在初始檔案各開了一個分支，但 A 同事發現這一份檔案存在 Bug，於是做了修復的動作，而 B 同事正好也發現了這一個 Bug 也做了修復，此時如果進行合併，就會造成所謂的合併衝突，此狀況不只會發生在本地分支，遠端分支也同樣會發生，該如何解決此類的衝突，也就是本篇的主題。

## 筆記重點

- 本地分支合併衝突
- 遠端分支合併衝突
- GitHub 保護機制
- Git 指令回顧

## 本地分支合併衝突

讓我們先來模擬衝突發生的情境：

```bash
mkdir project

cd project

git init
Initialized empty Git repository in C:/Users/a7894/Desktop/project/.git/

echo '' > index.html

git add .

git commit -m 'add index.html'
```

修改 `index.html` 檔案：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

再次提交 commit：

```bash
git add .

git commit -m 'update index.html'
```

到這邊已經完成初始化的動作了，假設目前有一位工程人員開了一個分支並提交了一次 commit 紀錄：

```bash
git checkout -b dog

echo '' > all.css

git add .

git commit -m 'add all.css'
```

此時他發現原本的 `index.html` 檔案標題打錯了，進行了修改：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dog</title>
  </head>
  <body></body>
</html>
```

並提交了 commit 紀錄：

```bash
git add .

git commit -m 'edit index.html > title'
```

假設又有一位工程人員開了一個分支並修復 title 這個問題：

```bash
git checkout master

git checkout -b cat

... edit index.html title

git add .

git commit -m 'edit index.html > title'
```

讓我們來看目前的日誌：

![查看目前 commit 紀錄-1](https://i.imgur.com/Qzr8J69.png)

你會發現在 `dog` 分支與 `cat` 分支同時修改了 `index.html` 檔案的標題，這邊要注意，並不是修改同一份檔案就會發生衝突，而是修改同一份檔案的同一行代碼才會發生衝突，基本上 Git 有自己判定的標準，讓我們繼續來看衝突是如何發生的：

```bash
git checkout cat

git merge dog
```

此時會跳出合併發生衝突的警告：

![git 合併衝突](https://i.imgur.com/s66X0qE.png)

此時千萬不要慌張，讓我們先用 `git status` 壓壓驚：

![查看檔案狀態-1](https://i.imgur.com/qHOftjW.png)

從上面可以得知，目前 `all.css` 已經被提交至索引區，代表這一個檔案沒有發生衝突，而 `index.html` 這個檔案就不一樣了，出現了 `Unmerged path` 的狀態，且提示 `both modified` 字樣，代表兩個分支同時修改到了同份檔案的同行代碼，這時候 Git 推薦要不就執行以下命令還原到未合併前的狀態：

```bash
git merge --abort
```

要不就修復這個衝突，我們當然不可能進行還原阿！遇到問題，解決它不就行了？讓我們先打開發生衝突的這一個檔案：

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<<<<<<< HEAD
    <title>cat</title>
=======
    <title>dog</title>
>>>>>>> dog
  </head>
  <body></body>
</html>
```
<!-- prettier-ignore-end -->

神奇的事情發生了！發生衝突的這個檔案居然出現了奇怪的符號，其實這是 Git 用來告訴我們何處發生了衝突，上半部是 `HEAD`，也就是請求合併的 `cat` 分支，中間是分隔線，接下是 `dog` 分支的內容，這時請去與 `dog` 分支的人討論究竟該用誰的修改，假設我們要用 `dog` 分支的人修改好了，請把 `cat` 內容與其餘標記都給它刪除：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dog</title>
  </head>
  <body></body>
</html>
```

在這邊補充一點，如果你的編輯器是 VSCode，它會有選擇的提示喔！挺方便的，效果如下：

![VSCode 衝突提示](https://i.imgur.com/iuVVaA4.png)

修改完後，老樣子，目前這個檔案還是存在於工作目錄，將它提交至索引區吧：

```bash
git add .
```

這時我們來看狀態長什麼樣子：

![查看檔案狀態-2](https://i.imgur.com/j2bzdhV.png)

你會發現提示改變了，告訴我們所有衝突都已被修復，但還處於合併中，因為我們還沒有提交至數據庫阿！輸入以下命令：

```bash
git commit
```

這時你可能會想，為什麼沒有加 `-m` 參數呢？事實上，在這種情況下，我習慣使用預設的訊息，如果你跟我一樣單純使用 `git commit`，此時會跳出 Vim 請你輸入訊息內容，而分支衝突本身就有預設的訊息內容了，也就代表直接關閉視窗即可，但如果你想要自訂訊息內容，那就照往常的加入 `-m ''` 即可，這時候讓我們來看究竟合併成功了沒：

![查看檔案狀態-3](https://i.imgur.com/CtrV3OY.png)

大功告成！分支已被成功合併，事實上，本地分支發生衝突的機率確實是挺高的，但只要跑過一次流程，就沒什麼好害怕的了，接下來進入到遠端分支合併衝突的部分。

## 遠端分支合併衝突

在這邊我們需要先釐清遠端數據庫是怎麼處理我們的上傳檔案的，你可能會認為遠端是以 "更新" 的方式進行處理，但這個觀念是錯的，事實上遠端與本地端同樣都是使用合併的方式處理檔案，這也就導致可能發生與本地端相同的合併衝突問題。

請先在 GitHub 隨便開一個遠端數據庫，並將本地端內容推上去：

```bash
git remote add origin git@github.com:awdr74100/conflict-demo.git

git push -u origin --all
```

此時的日誌應該為：

![查看目前 commit 紀錄-2](https://i.imgur.com/OO9EQwX.png)

在這邊補充一個指令：

```bash
git commit --amend -m 'merge dog branch'
```

這個指令主要可用來修改最後一次提交的 commit 訊息，假設你不小心在提交 commit 時打錯字，這個指令就很用好，但不建議使用在以推至遠端數據庫的 commit 節點，必定會發生衝突：

![查看目前 commit 紀錄-3](https://i.imgur.com/lQLCEcW.png)

你會發現原本的 `6aa88f4` 節點目前只剩遠端的 `cat` 分支指著，本地的 `cat` 分支反而指向了一個全新的 commit 節點，這邊你可能會有所誤會，修改訊息對於 Git 來說也算是一次全新的 commit 紀錄，但假設你是使用在本地尚未推至遠端的 commit 節點，原有的 `6aa88f4` 應該是會被 "隱藏" 才對，使用 `git log` 是看不到這一個節點的，上面為什麼看的到是因為遠端的 `cat` 分支指著，才導致這個節點被顯示出來。

此時如果將本地推至遠端，就會產生所謂的遠端合併分支衝突：

![遠端分支合併衝突](https://i.imgur.com/iB6eRgq.png)

對於遠端分支來說，應該是存在 `6aa88f4` 這一個節點的，但我們透過修改形成了一個全新的節點，原有的 `6aa88f4` 就被隱藏了，只要合併前的舊有紀錄有被更改的情形，就有可能發生衝突，因為版本對不上阿！

有沒有發現 `non-fast-forward` 字樣？這不就是之前介紹的取消快轉合併嗎？這也證實了遠端是以合併的方式處理推上來的檔案，讓我們先來看目前的檔案狀態：

![查看檔案狀態-4](https://i.imgur.com/OIxmorf.png)

Git 也直接跟你表明目前有衝突發生，請將遠端內容下載到本地端並進行合併，我們可以依造它指示的來做：

```bash
git pull
```

此時會跳出請你輸入此次合併提交的訊息：

![合併分支](https://i.imgur.com/1dHjcvI.png)

再次執行 `git push`：

![push 成功](https://i.imgur.com/rzfkuKE.png)

這一次 Push 就成功了，之前我們有說過 `git pull` 主要會將 `git fetch` 的內容直接執行 `git merge`，這也才導致直接跳出合併的訊息視窗，這樣子看起來是不是使用 `commit --amend` 挺麻煩的？我建議只要有曾 Push 出去的這個動作，都盡量不要使用這個指令，以免造成所有人的困擾。

跑過一次上面的流程你大概就知道怎麼修復遠端分支的衝突了，在怎麼樣還是必須將遠端的內容 Pull 下來，之後再看要怎麼修復，最後才能執行 Push。

## GitHub 保護機制

如果你是乖乖依照上面方法去修復衝突，倒是不必動用到 GitHub 的保護機制，但如果你是使用以下指令可就麻煩了：

```bash
git push -f
```

這個 `-f` 等同於 `--force`，表示強制的意思，這個指令主要用在遠端分支發生衝突時，可以強迫上傳，並且覆蓋掉遠端的分支，你可以把它想像成最高權限的覆蓋動作，如果以我們剛才的例子來講，遠端發生衝突時，就可以直接使用這個指令，免去修復的困擾，但建議這個指令只用在自己身上，你可以想像，團隊裡有人沒有先知會大家就突然使用這個指令，此時會發生什麼事？回家吃自己吧！

也因為這個指令帶來的後果太過於可怕，像是 GitHub 網站就有提供所謂的保護機制，可以避免某個分支被 Force Push，以下為示範：

路徑：Settings > Branches > Branch protection

![保護機制-1](https://i.imgur.com/bkOJpIs.png)

點擊 `Add rule` 並挑選適合的選項：

![保護機制-2](https://i.imgur.com/C7lYl3p.png)

`master` 分支已被保護：

![保護機制-3](https://i.imgur.com/E9tVpfv.png)

這樣就完成囉，根據你挑選的保護選項，在每次推送前都會觸發，避免可能發生的可怕後果。

## Git 指令回顧

```bash
# 還原至合併前狀態
git merge --abort

# 修改最後一次 commit 訊息
git commit --amend -m 'message'

# 強制推送遠端分之
git push -f
```
