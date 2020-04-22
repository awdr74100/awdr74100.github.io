---
title: Git 版本控制系統 - 分支合併衝突與解決辦法
description:
  [
    在之前我們有提到 Git 主要被使用在多人協作開發，每個人各自完成屬於自己的工作，最後透過合併即可完成應用，但想的簡單，實做起來卻有些困難，過程中難免會有意外發生，比如說 A 同事與 B 同事先前在初始檔案各開了一個分支，但 A 同事發現這一份檔案存在 Bug，於是做了修復的動作，而 B 同事正好也發現了這一個 Bug 也做了修復，此時如果進行合併，就會造成所謂的合併衝突，此狀況不只會發生在本地分支，遠端分支也同樣會發生，該如何解決此類的衝突，也就是本篇的主題。,
  ]
categories: [Git]
tags: [Git]
date: 2020-04-22 14:47:31
updated: 2020-04-22 14:47:31
---

## 前言

在之前我們有提到 Git 主要被使用在多人協作開發，每個人各自完成屬於自己的工作，最後透過合併即可完成應用，但想的簡單，實做起來卻有些困難，過程中難免會有意外發生，比如說 A 同事與 B 同事先前在初始檔案各開了一個分支，但 A 同事發現這一份檔案存在 Bug，於是做了修復的動作，而 B 同事正好也發現了這一個 Bug 也做了修復，此時如果進行合併，就會造成所謂的合併衝突，此狀況不只會發生在本地分支，遠端分支也同樣會發生，該如何解決此類的衝突，也就是本篇的主題。

## 筆記重點

- 本地分支合併衝突
- 遠端分支合併衝突

## 本地分支合併衝突

讓我們先來模擬衝突發生的狀況：

```bash
$ mkdir project

$ git init
Initialized empty Git repository in C:/Users/a7894/Desktop/project/.git/

$ echo index.html

$ git add .

$ git commit -m 'add index.html'
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
$ git add .

$ git commit -m 'update index.html'
```

到這邊已經完成初始化的動作了，假設目前有一位工程人員開了一個分支並提交了一次 commit 紀錄：

```bash
$ git checkout -b dog

$ echo '' > all.css

$ git add .

$ git commit -m 'add all.css'
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
$ git add .

$ git commit -m 'edit index.html title'
```

假設又有一位工程人員開了一個分支並修復 title 這個問題：

```bash
$ git checkout master

$ git checkout -b cat

$ ... edit index.html title

$ git add .

$ git commit -m 'edit index.html title'
```

讓我們來看目前的日誌：

![查看目前 commit 紀錄](https://i.imgur.com/nlEUA90.png)

你會發現在 `dog` 分支與 `cat` 分支同時修改了 `index.html` 檔案的標題，這邊要注意，並不是修改同一份檔案就會發生衝突，而是修改同一份檔案的同一行代碼才會發生衝突，基本上 Git 有自己判定的標準，讓我們繼續來看衝突是如何發生的：

```bash
$ git checkout cat

$ git merge dog
```

此時會跳出合併發生衝突的警告：

![git 合併衝突](https://i.imgur.com/S3fuCDg.png)

此時千萬不要慌張，讓我們先用 `git status` 壓壓驚：

![查看檔案狀態-1](https://i.imgur.com/28Xdtpt.png)

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

![查看檔案狀態-2](https://i.imgur.com/52KjPlj.png)

你會發現提示改變了，告訴我們所有衝突都已被修復，但還處於合併中，因為我們還沒有提交至數據庫阿！輸入以下命令：

```bash
git commit
```

這時你可能會想，為什麼沒有加 `-m` 參數呢？事實上，在這種情況下，我習慣使用預設的訊息，如果你跟我一樣單純使用 `git commit`，此時會跳出 Vim 請你輸入訊息內容，而分支衝突本身就有預設的訊息內容了，也就代表直接關閉視窗即可，但如果你想要自訂訊息內容，那就照往常的加入 `-m ''` 即可，這時候讓我們來看究竟合併成功了沒：

![查看檔案狀態-3](https://i.imgur.com/FC99OCg.png)

大功告成！分支已被成功合併，事實上，本地分支發生衝突的機率確實是挺高的，但只要跑過一次流程，就沒什麼好害怕的了，接下來進入到遠端分支合併衝突的部分。