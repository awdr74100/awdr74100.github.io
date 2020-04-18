---
title: Git 版本控制系統 - 環境安裝與基本指令
description:
  [
    Git 是一個分散式的版本控制系統，可針對專案的不同版本進行操作。當初在學 Git 時是直接買書回來看，大概知道什麼時候該打什麼指令，但我還是認為自己的基礎不夠扎實，還不到業界的標準，如果你是應徵軟體相關的工作，這肯定是必備技能。此系列文章主要紀錄在各種情境下，該如何靈活使用 Git 管控我們的專案版本，到後半段的文章也會提及如何將專案部屬至遠端的 Git 伺服器，如 GitHub、Bitbucket 等，最後會以常見的 Work Flow，如 GitHub Fow 收尾，加深自己對 Git 的印象。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-16 00:31:36
updated: 2020-04-17 18:20:15
---

## 前言

Git 是一個分散式的版本控制系統，可針對專案的不同版本進行操作。當初在學 Git 時是直接買書回來看，大概知道什麼時候該打什麼指令，但我還是認為自己的基礎不夠扎實，還不到業界的標準，如果你是應徵軟體相關的工作，這肯定是必備技能。此系列文章主要紀錄在各種情境下，該如何靈活使用 Git 管控我們的專案版本，到後半段的文章也會提及如何將專案部屬至遠端的 Git 伺服器，如 GitHub、Bitbucket 等，最後會以常見的 Work Flow，如 GitHub Fow 收尾，加深自己對 Git 的印象。

## 筆記重點

- 為什麼需要使用 Git？
- 安裝 Git 至 Windows 環境下
- 使用者設定 / 全域與區域差別
- 初始化 Git Repository
- Git 基本指令
- 章節 Git 指令回顧

## 為什麼需要使用 Git？

假設你是一位 Web 開發人員，在做專案開發時可能會遇到以下情境：

![傳統版本控制](https://i.imgur.com/2oSCNHQ.png)

為了保證之後可查看過往的開發紀錄，在每次新的開發時，我們都會直接另存新檔並將修改內容直接以標題顯示，老實講，我以前就是這樣幹的，我是一位有點強迫症的人，我喜歡在每次開發時都遍歷過往的紀錄，避免自己陷入曾發生的錯誤，但你不覺得這樣子顯得很不專業嗎？身為一位開發人員，居然用這麼傳統的方式辨別每次開發的過程，何不我們嘗試使用版本控制進行開發呢？

![使用 Git 版本控制](https://i.imgur.com/dIsQMmS.png)

以上為 VSCode 中的 Git History 插件效果，是不是覺得很驚人？在也不需要另存新檔了，你可能會有疑問，這不就只是在每次開發時做一次紀錄嗎？我需要知道的是紀錄的內容阿！

![使用 Git 進行比對](https://i.imgur.com/Oa2A1VI.png)

透過簡單的指令即可比對不同版本的差異，你是不是越來越有興趣了？讓我們再做一個示例：

- 當前狀態 (master)：

![當前最新狀態](https://i.imgur.com/hZOQ3Hx.png)

- 新增內文 (6cb782f)：

![切換到指定狀態](https://i.imgur.com/ZMA2SyS.png)

你沒有看錯，代碼被還原到指定的紀錄上了，但這不代表以後的紀錄被刪除了，你可以自由的切換當前專案的版本。有時候在團隊開發時，可能會有同一份檔案被修改的情況，以往我們都是用口述的方式進行討論，但現在不用這麼麻煩了，來看以下示例：

![版本衝突](https://i.imgur.com/mizZplS.png)

當我們遇到版本衝突時，Git 會提示衝突的地方，我們只需要與夥伴溝通要使用誰的版本即可，是不是很方便？說了這麼多，讓我們直接開始使用 Git 吧！

## 安裝 Git 至 Windows 環境下

由於我本身是 Windows 的環境，故以下教學都是針對此環境進行。

> 官方連結：[Git](https://git-scm.com/)

![Git 下載頁面](https://i.imgur.com/ist48Oz.png)

安裝過程就一路給它按下去就對了，安裝完成後可以在滑鼠右鍵選單內容找到 `Git Bash Here` 與 `Git GUI Here` 選項，在這邊我們可以選擇 `Git Bash Here`，此時會跳出以下視窗：

![Git Bash](https://i.imgur.com/S1hTuvl.png)

這個就是 Git 內建的命令提示字元，嚴格來講應該算是模擬 Linux 系統內的 Bash，我們所有的 Git 指令都會在這邊完成，當然你也可以使用 Windows 底下的 PowerShell 或 CMD，只要 Git 有成功安裝，隨你高興，我們可使用以下指令確認 Git 是否有成功安裝：

```bash
git --version
```

假設出現 Git 的版本號，即代表安裝成功，如下圖：

![git --version](https://i.imgur.com/1jNHeF0.png)

## 使用者設定 / 全域與區域差別

在觀看此文章段落之前，可以先至下一個段落實際把玩 Git 一番，這樣對此段落內容會比較有感覺。當我們在不設定當下使用者是誰的情況下，會跳出以下錯誤：

![使用者未設定](https://i.imgur.com/J6iONlw.png)

就如同字面上的意思，當我們要提交一個 commit 時，必須告訴 Git 當下的使用者是誰，以保證未來可以追蹤此提交的使用者，這時可以輸入它給予的建議設定使用者，如下所示：

```bash
git config --global user.name "Roya"
```

```bash
git config --global user.email 'a78945612385238@gmail.com'
```

上面這兩道指令主要用來設定使用者的姓名與信箱，此時可輸入以下指令檢查是否成功設定：

```bash
git config --list
```

如果出現 `user.name` 與 `user.email` 即代表設定成功。

這邊介紹另一種檢查的方法，至 `C:\Users\${USER}\.gitconfig` 查看內容：

```plain
[user]
    name = Roya
    email = a78945612385238@gmail.com
```

這一個檔案是 Git 的全域配置檔，還記得我們上面使用 `--global` 參數進行配置嗎？如果以全域方式設定使用者，在往後進行任何 Git 操作時，預設都會以這一個使用者為主，通常只在第一次使用 Git 時都才要設定，你也可以使用區域方式配置使用者，如下所示：

```bash
git config --local user.name 'Eric'
```

```bash
git config --local user.email 'asdwef@gmail.com'
```

區域配置的設定一樣會有專屬設定檔，專案資料夾內的 `/.git/config` 檔案就是了，同樣可檢查是否成功設定：

```plain
[user]
    name = Eric
    email = asdwef@gmail.com
```

當你在專案提交 commit 時，就會是使用區域配置的使用者而非全域配置的使用者，這點要注意！此時就能夠正常提交 commit 囉。

## 初始化 Git Repository

接下來讓我們正式開始使用 Git 吧！首先請先新增一個空的資料夾：

```bash
mkdir project
```

假設這一個資料夾就是我們專案放置的地方，使用 `cd` 移至這個資料夾：

```bash
cd project
```

如果你的資料結構很複雜，也可以直接將專案資料夾拉進 bash 內：

```bash
cd C:\Users\a7894\Desktop\project
```

接下來進行初始化 Git Repository 的動作，請輸入以下指令：

```bash
git init
```

此時會跳出已新增 `.git` 的提示，如下所示：

![git init](https://i.imgur.com/QnJrqHG.png)

這一個 `.git` 檔案就是我們專案資料夾的 Repository，到了這邊已經完成讓 Git 針對此專案進行版控的動作

## Git 基本指令

![git 運作流程](https://i.imgur.com/scWvYQ1.jpg)

讓我們借助[六角學院](https://www.hexschool.com/)所製作的流程圖說明 Git 是如何進行版控的，從上圖可以發現有四大部分需要我們了解，讓我們直接從實際應用操演一番。

新增 `index.html` 檔案：

```diff
 webpack-demo/
 │
+├─── index.html
```

輸入以下指令查看當前目錄狀態：

```bash
git status
```

這一道指令可能是你往後最常使用的指令，主要用來查看當前目錄的狀態，如下所示：

![git status](https://i.imgur.com/7jvZNjc.png)

從 Git 的提示可以看出，我們的 `index.html` 檔案目前狀態是 `Untracked`，關於檔案狀態的部分會再之後的檔案復原獨立文章在做討論，這邊我們只需要記得一個重點就是，**所有剛新增的檔案初始存在區域都是屬於工作目錄**，也就是上圖的第一個地方，請注意，**在沒有提交半次 commit 的檔案，都是不受 Git 所版控的**，也就是說，每一次的工作流程，都必須跑到最後一次 commit 記錄發生時，才能使用檔案復原或切換這些上面曾經展示過的功能，現在讓我們跑下一個工作流程，也就是將工作目錄檔案提交至索引區，執行以下指令：

```bash
git add index.html
```

or (全部檔案)

```bash
git add .
```

or (在 Git 2.x 之後，效果如同 `git add .`)

```bash
git add --all
```

此時一樣可透過 `git status` 查看目前狀態：

![git add index.html](https://i.imgur.com/grzPncJ.png)

你會發現檔案的狀態又發生改變了，使用**此命令主要是將存在工作目錄的檔案提交至索引內**，也就是圖中的第二個部分，你可能會好奇這一個索引區域是幹嘛用的，以及目前我們到底成功提交 commit 了沒，答案是還沒，先來解釋索引的部分，在 Git 中，我們有時候會反悔當下的 commit，如果存在工作目錄的檔案只需要透過一道指令即可提交 commit，這就會造成多餘的 commit 產生，雖然一樣可透過指令回復並刪除指定的 commit，但相比於設立一個暫存區複雜許多，這一個索引區域本身就是一個暫存區域，主要是讓使用者檢查用，就這麼簡單，之後也會介紹如何將暫存區的檔案回復至工作目錄，接下來就是重頭戲了，執行以下指令：

```bash
git commit -m '新增 index.html'
```

當我們執行了上面這道命令後，**存在索引區的檔案就會被提交至本地數據庫**，也就是圖中第三個部分，這邊的 `-m` 是指 message 的意思，你可以替這一次提交附加一個訊息，以供未來檢視，可能會有人問，我可以直接打 `git commit` 就好嗎？此時會跳到 Vim 的命令模式，如下圖：

![Vie insert](https://i.imgur.com/oD6TcQa.png)

看來還是得輸入訊息，如果你發現不能打字，可以按 `i` 進行 insert 的操作，就可以輸入內容了，最後輸入 `:wq` 完成編輯，也就是 `:w` 儲存後再 `:q` 關閉檔案。**不管是使用哪一種方式，絕對不能輸入空的訊息內容**，就算輸入並儲存了，Git 也會提示由於提交訊息為空而中止提交，也就是保持在索引區狀態，這點要注意！

如果你認為預設的 Vim 編輯器不對你的胃口，你也可以更改為記事本或其他編輯器，下面為更改為 `VSCode` 編譯器的指令：

```bash
git config --global core.editor 'code --wait'
```

到這邊一個基本的 Git 工作流程也就完成了，代表 commit 紀錄已經成功生成。此時可利用以下指令查看所有的 commit 紀錄：

```bash
git log
```

在使用 `git log` 指令時，如果加上額外參數，可以看到不一樣的輸出格式，例如加上 `--oneline` 或 `--graph`，各位可以自己試看看，以下為一般輸出結果：

![git log](https://i.imgur.com/mMaJ7rN.png)

如果你認為內建的日誌看起來很痛苦，你也可以使用 VSCode 中的 [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) 插件或像是 [Sourcetree](https://www.sourcetreeapp.com/) 等 GUI 圖形介面軟體，尤其是 Sourcetree 的部分，有關這一個軟體會在之後的文章單獨做介紹。

到了這邊，我們已經成功提交了第一個 commit 記錄了，你可以嘗試提交多一點的紀錄，以加深整個流程的印象，可能會有人問，那上面那張圖的第四個部分呢？怎沒有講到？事實上，本地端的 Git 操作，就只包含前三個部分，所謂的遠端數據庫就是指像是 GitHub、GitLab、Bitbucket 等平台，這些的本體都是屬於 Git 伺服器，我們一樣可透過 Git 指令將指定目錄推上去，達到遠端存取的作用，但在學習遠端操作前，我們必須先了解 Git 一個相當重要的操作，也就是分支 (branch) 的部分，了解了分支的正確用法，在來使用遠端操作，吸收才會扎實。關於分支的部分，將在下一篇文章做介紹。

## 章節 Git 指令回顧

- 檢查 Git 版本：`git --version`
- 新增全域使用者 (姓名)：`git config --global user.name "姓名"`
- 新增全域使用者 (信箱)：`git config --global user.email "信箱"`
- 新增區域使用者 (姓名)：`git config --local user.name "姓名"`
- 新增區域使用者 (信箱)：`git config --local user.email "信箱"`
- 檢查使用者設定：`git config --list`
- 全域 Git 設定檔：`C:\Users\${USER}\.gitconfig`
- 專案 Git 設定檔：`/.git/config`
- 初始化 Git Repositroy：`git init`
- 查看當前目錄狀態：`git status`
- 將工作目錄檔案提交至索引區 (指定檔案)：`git add <提交檔案>`
- 將工作目錄檔案提交至索引區 (全部檔案)：`git add .`
- 將工作目錄檔案提交至索引區 (在 Git 2.x 之後，效果如同 `git add .`)：`git add --all`
- 將索引區檔案提交至本地數據庫：`git commit -m '訊息'`
- 將索引區檔案提交至本地數據庫 (開啟預設編輯器)：`git commit`
- 將預設的 Vim 編輯器改為 VSCode：`git config --global core.editor "code --wait"`
- 查看目錄日誌：`git log`
- 查看目錄日誌 (精簡化)：`git log --oneline`
- 查看目錄日誌 (線路圖)：`git log --oneline --graph`
