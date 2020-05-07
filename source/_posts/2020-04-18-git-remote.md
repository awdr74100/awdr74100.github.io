---
title: Git 版本控制系統 - 遠端數據庫託管與操作
description:
  [
    本地數據庫的操作已經介紹的差不多了，這次來講如何將本地數據庫推至遠端數據庫，這其實也是整個 Git 流程最重要的步驟，當我們成功將本地專案推至像是 GitHub 或 Bitbucket 等平台時，也就代表我們已經可以異地操作這一個專案了，你是否曾遇到過開發到一半的專案需要到另外一台電腦繼續操作的情況？這時你可能會使用像是 USB 等儲存裝置，但你不覺得這樣效率很差嗎？何況如果你忘記帶 USB 呢？只要你的專案已經存在遠端數據庫，且當前操作的電腦有安裝 Git，透過簡單指令即可將專案同步回本地。,
  ]
categories: [Git]
tags: [Git, GitHub]
date: 2020-04-18 23:00:04
updated: 2020-05-08 01:42:47
---

## 前言

本地數據庫的操作已經介紹的差不多了，這次來講如何將本地數據庫推至遠端數據庫，這其實也是整個 Git 流程最重要的步驟，當我們成功將本地專案推至像是 GitHub 或 Bitbucket 等平台時，也就代表我們已經可以異地操作這一個專案了，你是否曾遇到過開發到一半的專案需要到另外一台電腦繼續操作的情況？這時你可能會使用像是 USB 等儲存裝置，但你不覺得這樣效率很差嗎？何況如果你忘記帶 USB 呢？只要你的專案已經存在遠端數據庫，且當前操作的電腦有安裝 Git，透過簡單指令即可將專案同步回本地。

## 筆記重點

- 在 GitHub 開一個遠端數據庫
- 設定 GitHub SSH 金鑰
- 將本地數據庫 Push 至 GitHub
- 將遠端數據庫 Clone 到本地
- 使用 Fetch 獲取遠端數據庫修改內容
- 刪除遠端分支
- Git 指令回顧

## 在 GitHub 開一個遠端數據庫

首先我們當然要有一個遠端數據庫託管我們的專案，在這邊示範 GitHub 的流程。

註冊 [GitHub](https://github.com/join?source=header-home) 帳號：

![Register GitHub](https://i.imgur.com/n0pIThT.png)

點擊畫面左邊的 New 按鈕，新增一個 Repository：

![New Repository](https://i.imgur.com/cGtent2.png)

此為 Repository 的各種設定，Name 為必要設定，其他都用預設值就好，反正後面還可以更改：

![Repository First Setting](https://i.imgur.com/q2mQFRg.png)

成功顯示：

![Repository success](https://i.imgur.com/iPyCrV1.png)

當你跑出以上畫面即代表遠端數據庫已成功被建立，你會看到一堆 Git 的指令，這些在下面都會做介紹，接下來進入本地數據庫連接遠端數據庫的部分。

## 設定 GitHub SSH 金鑰

在我們將本地數據庫連結遠端數據庫之前，有一個很重要的觀念是關於 SSH 與 HTTPS 的差異，GitHub 為了保證當前使用者就是此 Repository 的授權用戶，提供了兩種的驗證方式：

- SSH：已經將金鑰設定完成，與遠端數據庫交流時不需輸入帳密 (可針對私鑰使用設定密碼)
- HTTPS：與遠端數據庫交流時需輸入 GitHub 帳密，如果不需要輸入通常是帳密已存在電腦裡

GitHub 本身是推薦使用 HTTPS，使用起來會比較安全，且對於初學者來說較友善，看到登入視窗直接輸入帳密就完成了；但我個人比較推薦使用 SSH 的方式，並針對私鑰設定使用密碼，這樣在每次與遠端數據庫交流時，都會跑出輸入密碼的提示，你可能會想，這樣不是很麻煩嗎？但換個角度去想，假設你在提交的途中後悔了呢？我是不是就可以避免此次的提交？類似 Git 要設立索引區的用意，下面將介紹 SSH 該如何設定並提交至 GitHub 上面。

開啟終端機並輸入以下指令，用以生成 SSH Key：

```bash
ssh-keygen
```

- Created directory：生成路徑 (採預設即可)
- Enter passphrase：私鑰密碼 (可為空值，但建議輸入，原因上面有提到)
- Enter same passphrase again：再次輸入密碼
- ... 金鑰相關資訊

成功生成 SSH Key：

![ssh-keygen created](https://i.imgur.com/5G0gngn.png)

將 `C:\Users\${USER}\.ssh\id_rsa.pub` 公鑰內容提交至 GitHub 上：

位置：GitHub > Setting > SSH and GPG keys

![SSH Key push](https://i.imgur.com/0mX7Tb5.png)

點擊 New SSH Key 並將剛剛複製內容貼到 Key 欄位，最後按 Add SSH key 提交公鑰，完成圖如下：

![SSH Key success](https://i.imgur.com/NoCocJc.png)

到這邊就已經完成 GitHub SSH 金鑰設定的部分，下面我們就可以透過 SSH 方式與遠端數據庫交流囉。

## 將本地數據庫 Push 至 GitHub

讓我們先開一個專案資料夾並提交兩次 commit 紀錄：

```bash
mkdir project

cd project

git init

touch index.html

git add .

git commit -m '新增 index.html'

touch all.css

git add .

git commit -m '新增 all.css'
```

輸入 `git log` 查看目前 commit 紀錄：

![git log](https://i.imgur.com/2m89i24.png)

如果有看過前面文章的人，應該對這些流程非常熟悉了才對，將下來進入重頭戲的部分，輸入以下指令：

```bash
git remote add origin git@github.com:awdr74100/git-remote-demo.git
```

說明：

- `git remote add`：添加一個遠端數據庫
- `origin`：後面那段遠端數據庫位址的名稱 (可隨意設置)
- `git@github.com:xxx`：遠端數據庫位址 (SSH 方式)
- `https://github.com/xxx`：遠端數據庫位址 (HTTPS 方式)

遠端數據庫位址可在 Repository 頁面找到，前面的圖片就有照到。當我們輸入以上指令時，可以到 `/.git/config` 專案配置檔中檢查是否成功添加遠端數據庫位址：

```plain
[remote "origin"]
    url = git@github.com:awdr74100/git-remote-demo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

或是直接使用 `git remote -v` 查看所有以添加的遠端數據庫資訊：

![git remote -v](https://i.imgur.com/qjBsgX7.png)

當出現以上畫面即代表遠端數據庫已被成功添加，一個本地數據庫可以添加無數個遠端數據庫，你也可以使用以下指令針對遠端數據庫做些修改：

- 修改已註冊遠端數據庫位址：

```bash
git remote set-url origin https://github.com/awdr74100/git-remote-demo.git
```

- 修改已註冊遠端數據庫名稱：

```bash
git remote rename origin github
```

- 刪除已註冊遠端數據庫：

```bash
git remote remove origin
```

簡單來講呢，你可以把它想像成宣告了 `origin` 這一個變數，並且賦予了遠端數據庫的位址，變數名稱可以自由的命名，但一般主要的遠端數據庫我們都會把它命名為 `origin`，其他特殊作用的遠端數據庫才會刻意命名，後面的操作就都會是以這一個變數名稱為主，接下來執行以下命令：

```bash
git push -u origin master
```

說明：

- `git push`：將本地指定分支推送至遠端數據庫
- `-u`：同 `--set-upstream`，設定推送分支的上游
- `origin`：要推向哪個遠端數據庫，寫名稱即可 (就是指前面說的 `origin`)
- `master`：指定本地 `master` 分支進行推送，如果存在 `master` 分支即合併，不存在即新增

這一段可能會比較不好理解，讓我們將上面這段命令完整的寫出來：

```bash
git push --set-upstream origin master:master
```

首先是 `-u` 的部分，等同於 `--set-upstream`，可以使 `master` 這一個指定的分支開始追蹤遠端的分支，只要做過一次 `git push -u origin master`，並且成功 Push 出去，本地的 `master` 分支就會被設定去追蹤遠端的 `origin/master` 分支，往後再 `master` 分支直接使用 `git push` 命令就會推向當時設定的 `origin/master` 分支，反之，如果沒有設定 `-u` 就使用 `git push`，就會導致以下錯誤：

![git 尚未設置上游](https://i.imgur.com/OUCX1Hl.png)

可能有人會想，那我是否可以在不設定 `-u` 的情況下使用以下指令呢？

```bash
git push origin master
```

答案是可以的，我們為什麼要設定 `-u` 就是要方便往後在直接使用 `git push` 命令時，Git 能夠知道此命令該推向何處，上面這種寫法明確的定義推向何處，結果與 `git push -u origin master` 一樣，只是我們習慣在第一次推送時，在明確定義該推向何處時，同時也設置往後這個位置就是預設推向的位置，有關 `-u` 的設定一樣可以到 `/.git/config` 尋找：

```plain
[branch "master"]
    remote = origin
    merge = refs/heads/master
```

在這邊補充一點，如果你往後 `master` 這個以設定 `-u` 的分支，想要單純使用 `git push` 就推向其他的分支，你可以解除 `-u` 的設定或直接覆蓋掉 `-u` 的設定：

- 移除 `upstream` 設定 (當前所在分支為 `master` => 設定 `master` 分支)：

```bash
git branch --unset-upstream
```

- 移除 `upstream` 設定 (當前所在分支不是 `master` => 設定 `master` 分支)：

```bash
git branch --unset-upstream master
```

- 設定 `upstream` 存在即覆蓋 (當前所在分支為 `master` => 設定 `master` 分支)：

```bash
git branch -u origin/master
```

- 設定 `upstream` 存在即覆蓋 (當前所在分支為 `master` => 設定 `master` 分支)：

```bash
git branch -u origin/master master
```

相信到這邊各位已經了解 `upstream` 的作用了，再來是前面提到的 `master:master` 部分，這個就比較簡單了，前面的 `master` 代表本地端的分支，後面的 `master` 代表遠端的分支，如果你把遠端的 `master` 改為 `develop`，那遠端的分支名稱就會是 `develop`，但內容還是本地端的 `master` 分支，就只是單純的改名子而已，接下來我們來看最初執行 `git push -u origin master` 後的 GitHub 頁面：

![git push 後的頁面](https://i.imgur.com/p7h4b4r.png)

你會發現我們的本地數據庫已成功推至遠端數據庫了，且分支名稱為 `master`，假設你在推送時只有寫 `master` 單個本地分支名稱，遠端分支的名稱就會直接採用這一個本地端分支的名稱，讓我們在練習一次：

```bash
git checkout -b develop

touch db.json

git add .

git commit -m '增加 db.json'
```

這一次我們在本地端開了一個名為 `develop` 的分支，執行以下命令進行推送：

```bash
git push origin develop
```

或是

```bash
git push -u origin develop
```

請注意，你沒有必要切換到 `master` 分支才進行推送，你的 Git 命令本身已經添加本地端的哪個分支，除非你要使用 `git push` 方式進行推送，這時就需要切換到要推送的那個分支，**每一個分支都可以設定一個 upstream**，我自己是習慣將每一個分支都設定好 `upstream`，日後就可以直接使用 `git push` 推至指定位置了，工程師就是要少打點字啊！我們來看現在的遠端數據庫有什麼變化：

![push 新分支](https://i.imgur.com/dCYbWTC.png)

記得將頁面預設呈現的 `master` 分支切換到 `develop` 分支，從上面結果可以得知，我們的本地端數據庫已成功同步到遠端數據庫，接下來換本地該如何拉取遠端數據庫的部分：

## 將遠端數據庫 Clone 到本地

我們已經完成將本地數據庫推送至遠端了，將下來示範如何將遠端數據庫克隆回本地：

先確認目前有哪些分支：

```bash
git branch -a
```

你也可以使用 `-r` 僅查看遠端分支，但我習慣使用 `-a` 直接查看所有分支，結果如下：

![git branch -a](https://i.imgur.com/iOltleD.png)

結果如同預期，因為我們已經分別將 `master`、`develop` 分支推至遠端了，所以遠端也存在同名的分支，接下來執行已下命令：

- 克隆遠端數據庫的預設分支至本地：

```bash
git clone git@github.com:awdr74100/git-remote-demo.git gh-demo
```

- 克隆遠端數據庫的指定分支至本地：

```bash
git clone -b master git@github.com:awdr74100/git-remote-demo.git gh-demo
```

剛剛在 Push 時是使用 SSH 方式驗證，在 Clone 這邊我們也一樣使用 SSH 方式連結，事實上，你想要改成 HTTPS 方式也沒差，如果你想要克隆非 `master` (origin/HEAD) 的分支，可以加上 `-b` 參數，後面帶入想要克隆的分支，最後面的 `gh-demo` 代表的是遠端數據庫要放在本地端的哪個資料夾，如果不存在即建立，如果不寫放置資料夾，預設會在當下命令路徑生成遠端數據庫名稱

![git clone](https://i.imgur.com/HaPt1Jc.png)

切換並查看剛剛 Clone 下來的數據庫：

![git clone 分支缺少](https://i.imgur.com/9BYZTBO.png)

到這邊我們已經成功將遠端數據庫 Clone 下來了，但在這邊還有一個問題，從上圖可以發現，這一個數據庫缺少了 `develop` 分支，預設情況下，使用 `git clone` 命令只會將 `master` (origin/HEAD) 分支給複製下來，可能會有人想，我可以直接 `git checkout origin/develop` 就好了啊，但這樣的作法是無法在本地端工作的，正確的做法應該是將遠端數據庫的分支一併給同步下來，可以使用以下指令：

```bash
git checkout -t origin/develop
```

再次查看所有分支：

![git checkout -t](https://i.imgur.com/EMfHFPi.png)

`-t` 全名為 `--track`，此道命令可將遠端分支建立至本地並追蹤 (即設置 upstream)，此時我們的 `gh-demo` 數據庫就會與最之前的 `project` 數據庫一模一樣囉，在這邊補充幾個指令：

- 將遠端分支建立至本地並追蹤 (自定義名稱)：

```bash
git checkout -b develop origin/develop
```

這道指令與 `git checkout -t origin/develop` 結果相同，差別在於可自定義名稱。

- 將遠端分支建立至本地並追蹤 (最簡單)：

```bash
git checkout develop
```

這道命令與使用 `git checkout -t origin/develop` 結果相同，Git 會檢查這一個分支是否洽好存在同名遠端分支，如果存在，即在本地創建這一個分支並追蹤遠端分支。

以上幾道命令結果都一樣，看你認為哪一個比較好記。到這邊我們已經成功將遠端數據庫克隆至本地，以後只要在有 Git 環境的電腦中，都可以達到異地開發的效果，再也不需要使用 USB 囉。

## 使用 Fetch 獲取遠端數據庫修改內容

到這邊還有一個情境是假設本地端已將數據庫推至遠端，在異地開發時，我們也從遠端複製一份到本地端並提交了數次 commit，最後 Push 到遠端，那一開始已存在本地端檔案但資料落後於遠端的這個人該怎麼辦？讓我們來模擬這個狀況：

```bash
cd project

git checkout develop

touch all.js

git add .

git commit -m '新增 all.js'

git checkout master

git merge develop --no-ff
```

查看日誌：

![查看 commit 紀錄-1](https://i.imgur.com/tYT26fr.png)

你會發現我們本地端的兩個分支已經超前遠端分支的紀錄，接下來進行 Push：

```bash
git push --all origin
```

在我們前面都是介紹單個分支的推送，事實上，你也可以添加 `--all` 用以推送本地端所有分支的更新，而 `origin` 就是之前介紹的主機名稱，再看一次日誌：

![查看 commit 紀錄-2](https://i.imgur.com/tfJx30q.png)

看起來我們的本地端內容已經被同步到遠端數據庫了，接著換剛剛克隆下來的數據庫：

```bash
cd gh-demo
```

執行以下命令：

```bash
git fetch
```

查看日誌：

![查看 commit 紀錄-3](https://i.imgur.com/HjhElq0.png)

你會發現本地參照的遠端分支已被更新，這也就是 `git fetch` 的功用，它會將本地存在的分支從遠端給一併拉下來，接著執行合併動作：

- 在 `master` 分支：

```bash
git merge origin/master
```

- 在 `develop` 分支：

```bash
git merge origin/develop
```

查看日誌：

![查看 commit 紀錄-4](https://i.imgur.com/4k9SaRb.png)

大功告成！我們最初的本地端數據庫也被同步完成囉！我們可以針對上面 `git fetch` 指令做點修改：

```bash
git fetch origin master:temp
```

查看日誌：

![查看 commit 紀錄-5](https://i.imgur.com/ysGyR5H.png)

預設情況下，`git fetch` 會把所有的遠端分支拉下來，而上面這到命令的意思就如同前面所講到的 `master:master`，只拉取遠端的 `master` 分支並同步到本地端的 `temp` 分支，不存在即創建，之後我們一樣透過 `git merge temp` 就可以拿到最新內容了。

這邊我們再補充一個指令：

```bash
git pull
```

`git pull` 與 `git fetch` 同樣都是用來將遠端數據庫給拉下來，不同的地方在於 `git pull` 會直接將遠端分支合併至本地分支，你可以把它想成 `git fetch` 與 `git merge` 的組合技，你就不需要親自合併分支了，方便了不少。

我個人比較偏好 `git fetch` 的方式獲取遠端內容，通常在多人開發時，有很大的機率這一個遠端分支與本地分支合併時會發生衝突，使用 `git fetch` 就可先透過 `git diff` 比對差異，將衝突內容作修改，避免合併時可能出現的問題，而 `git pull` 確實比較方便，但如果遠端與本地分支發生衝突，就會直接跳出警告，等著我們慢慢去修，我不太喜歡這樣的做法，各位可以自行試試。

## 刪除遠端分支

在這邊我們補充一下如何刪除遠端的分支，其實原理如同我們前面所提到的 `master:master` 概念，如果你今天想要移除任何的遠端分支，只需要 Push 一個空的分支即可：

```bash
git push origin :develop
```

在 Git v1.7 之後的版本可以使用 `--delete` 參數：

```bash
git push --delete origin develop
```

顯示遠端分支已被刪除：

![刪除遠端分支](https://i.imgur.com/jUhYkHE.png)

此時一樣可以使用 `git log` 查看日誌，你會發現遠端的分支被我們刪除囉。

## Git 指令回顧

```bash
# 新增遠端數據庫
git remote add <repo_name> <url>

# 查看所有以添加的遠端數據庫資訊
git remote -v

# 修改已註冊遠端數據庫位址
git remote set-url <repo_name> <new url>

# 修改已註冊遠端數據庫名稱
git remote rename <old_repo_name> <new_repo_name>

# 刪除已註冊遠端數據庫
git remote remove <repo_name>

# 指定分支上傳至遠端數據庫 (同時設定 upstream)
git push -u <repo_name> <local_branch>

# 指定分支上傳至遠端數據庫 (指定不同名稱)
git push <repo_name> <local_branch>:<remote_branch>

# 指定分支上傳至遠端數據庫
git push <repo_name> <local_branch>

# 分支移除 `upstream`
git branch --unset-upstream <local_branch>

# 分支設定 `upstream` 存在即覆蓋
git branch -u <repo_name>/<remote_branch> <local_branch>

# 查看遠端分支
git branch -r

# 查看所有分支 (包含遠端與本地)
git branch -a

# 克隆遠端數據庫的預設分支至本地
git clone <url> <folder>

# 克隆遠端數據庫的指定分支至本地
git clone -b <remote_branch> <url> <folder>

# 將遠端分支建立至本地並追蹤
git checkout -t <repo_name>/<remote_branch>

# 將遠端分支建立至本地並追蹤 (可自訂名稱)
git checkout -b <local_branch> <repo_name>/<remote_branch>

# 將遠端分支建立至本地並追蹤
git checkout <remote_branch>

# 上傳至遠端數據庫 (全部分支)
git push --all <repo_name>

# 上傳至遠端數據庫 (全部分支，同時設定 upstream)
git push -u <repo_name> --all

# 下載遠端數據庫 (所有本地存在分支)
git fetch

# 合併遠端分支 (將本地分支更新為最新狀態)
git merge <repo_name>/<remote_branch>

# 下載遠端數據庫 (指定分支)
git fetch <repo_name> <remote_branch>

# 下載遠端數據庫 (放至指定分支，不存在及建立)
git fetch <repo_name> <remote_branch>:<local_branch>

# 下載遠端數據庫 (等同於 git fetch + git merge)
git pull

# 刪除遠端分支
git push :<remote_branch>

# 刪除遠端分支 (v1.7 以後版本可使用)
git push --delete <repo_name> <remote_branch>
```
