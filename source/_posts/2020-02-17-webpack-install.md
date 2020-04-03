---
title: Webpack 前端打包工具 - 環境安裝與基本配置
description:
  [
    Webpack 可說是近年來最為熱門的技術，以往在編寫 ES6、Sass/SCSS、Pug、CoffeeScript 等預處理器或需編譯內容時，通常都得透過自動化工具，如 Gulp、Grunt 等任務流程執行工具進行編譯處理，到了現在，Webpack 已逐漸取代這些工具，Webpack 本身提供許多強大的功能，包含現正熱門的 SPA (單頁式應用) 透過配置 loader 方式也能輕鬆應付。本篇將從 Webpack 運行原理開始做介紹，接著說明該如何建立 Webpack 運行環境，最後透過打包方式產出我們的第一個 bundle.js 檔案。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-17 17:29:46
updated: 2020-02-20 20:11:32
---

## 前言

Webpack 可說是近年來最為熱門的技術，以往在編寫 ES6、Sass/SCSS、Pug、CoffeeScript 等預處理器或需編譯內容時，通常都得透過自動化工具，如 Gulp、Grunt 等任務流程執行工具進行編譯處理，到了現在，Webpack 已逐漸取代這些工具，Webpack 本身提供許多強大的功能，包含現正熱門的 SPA (單頁式應用) 透過配置 loader 方式也能輕鬆應付。本篇將從 Webpack 運行原理開始做介紹，接著說明該如何建立 Webpack 運行環境，最後透過打包方式產出我們的第一個 bundle.js 檔案。

## 筆記重點

- Webpack 簡介
- Webpack 安裝
- Webpack 基本配置
- Webpack 額外說明 - 指定運行環境
- Webpack 額外說明 - 使用 ESM 模組規範
- Webpack 額外說明 - 多個入口起點

## Webpack 簡介

![Webpack 介紹](https://i.imgur.com/KznxzWD.png)

Webpack 本身是一個開源的 JavaScript 模組打包工具，提供了前端缺乏的模組化開發方式，將各種靜態資源視為模組，當執行相關命令進行編譯時，將依 `webpack.config.js` 配置檔案執行優化並將其 entry 檔案打包成單個 JavaScript 檔案。

你可能會好奇，Webpack 所針對的模組不是指 JavaScript 模組嗎？那他要如何像 Gulp 一樣處理 `.scss`、`.pug` 之類的檔案呢？這時就得提到 Webpack Loader 這一個東西，它可將 JavaScript 以外的檔案透過解析，將其轉換為 JavaScript 模組，非常的特別，這點在後面都會有提到，簡單來講，Webpack 可幫我們完成以下事情：

- 整合 CommonJS & AMD & ES6 Modulrs 模組規範
- 編譯 Sass/SCSS、Pug、CoffeeScript 等預處理器
- 轉換 TypeScript、ECMAScript 6 相關代碼
- 解析模組間的相互依賴，進行打包處理
- other...

Webpack 最大的特色就在於模組打包，上圖所呈現的就是打包的進行方式，且能解決模組間的相互依賴問題，這也是一般人常說 Webpack 比 Gulp 更為適合開發 SPA (單頁式應用) 的關鍵，由於 Webpack 是以模組為基石，我們可以更為自由的操作整體結構，非常的強大，讓我們先從安裝開始說起。

## Webpack 安裝

<div class="note warning">本篇教學都是採用 Webpack 4 版本，與 v3 版本有些許不同，請稍加注意</div>

Webpack 依賴 Node.js 環境，需先進行安裝。在這邊使用 nvm 進行安裝：

```bash
nvm install 12.14.1
```

當然你也可以使用 [官方安裝檔](https://nodejs.org/en/) 安裝 Node.js，接著使用以下指令查看是否正確安裝：

```bash
node -v
```

![node 是否正確安裝](https://i.imgur.com/ysAfrID.png)

讓我們先建立一個專案資料夾並切換：

```bash
mkdir webpack-demo
cd webpack-demo
```

初始化專案並生成 `package.json` 檔案：

```bash
npm init -y
```

安裝 webpack 所需相關套件：

```bash
npm install webpack webpack-cli -D
```

這邊要注意的是 Webpack 4 把以往都綁在 Webpack 內的 Webpack-CLI 挪出來另外安裝，所以除了安裝 Webpack 外還要記得安裝 Webpack-CLI。且由於 Webpack 不像是 Gulp 需要指定編譯內容，所以我們可將 Webpack 安裝在專案環境，並透過 npm script 執行即可，官方也推薦此做法。

## Webpack 基本配置

初始專案結構：

```plain
webpack-demo/
│
├─── node_modules/
│
├─── src/
│   │
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli
```

請依造上面專案結構所示，新增 `src/main.js` 與 `webpack.config.js` 檔案。

配置 `webpack.config.js` 檔案：

```js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
```

讓我們來了解一下 Webpack 配置檔有什麼東西：

- **entry**
  - 用來設定 entry 檔案的進入點，也就是 JavaScript 模組檔案的入口處
- **output**
  - **path**：設定打包後的 JavaScript 檔案放置路徑，通常都會搭配 path 模組以形成絕對路徑
    - `__dirname`：c:\Users\blue\Desktop\webpack-demo
    - `path.resolve(...)`：c:\Users\blue\Desktop\webpack-demo\dist
  - **filename**：打包後的 JavaScript 檔案名稱，你也可以這樣寫 `js/bundle.js`

entry 入口處 (`src/main.js`) 鍵入以下內容：

```js
const myName = 'Roya';
console.log('Hello ' + myName);
```

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "build": "webpack --mode development"
  }
}
```

執行編譯指令：

```bash
npm run build
```

此時你會發現專案根目錄新增了 `dist/bundle.js` 檔案，這個檔案就是依照 `webpack.config.js` 配置所打包而成的 JavaScript 檔案，可直接做引入。

新增 `./index.html` 並引入打包而成的 `bundle.js` 檔案：

```html
<!-- 其他省略 -->
<body>
  <script src="dist/bundle.js"></script>
</body>
```

觀察 Console 結果：

![console](https://i.imgur.com/dFTKYWQ.png)

當出現以上結果，即代表操作流程正確無誤，同時也恭喜你成功打包了第一個項目，這也就是 Webpack 整個的處理流程，是不是很容易？但這僅僅是 Webpack 的冰山一角，我們可以透過其他配置來完成更為進階的操作，讓我們先從運行環境開始說起。

## Webpack 額外說明 - 指定運行環境

在前面的 `package.json` 中，我們新增了以下的編譯指令：

```json
{
  "scripts": {
    "build": "webpack --mode development"
  }
}
```

事實上，這道命令驅動了 Webpack 在 development 環境執行編譯，我們可以嘗試把 `--mode development` 拿掉，如下所示：

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

執行 `npm run build` 指令並察看結果：

![webpack運行環境](https://i.imgur.com/S1c5Rok.png)

你會發現 Webpack 雖然編譯成功，但跳出了相關的警告，警告內容為提醒你尚未配置 mode 選項，預設將以 production 為運行環境，此時觀察 `dist/bundle.js` 檔案，你會發現全部 JavaScript 都已被壓縮，這個概念就類似於使用 Uglify 套件進行壓縮，**Webpack 本身以集成壓縮相關套件**，在我們執行編譯命令時，可加入 mode 選項，指定當前的編譯環境並觸發相關的優化，以下為可選的項目：

- development：指定為開發環境(未壓縮代碼)
- production：指定為生產環境(壓縮代碼)
- none：退出任何默認優化選項

根據 [官方文件](https://webpack.js.org/configuration/mode/) 顯示，如果沒有指定當前環境，Webpack 會將 `mode` 選項設置為 `production` 環境，也就是默認選項。

CLI 命令傳遞 `mode` 選項：

```json
{
  "scripts": {
    "build": "webpack --mode development"
  }
}
```

相當於在 `webpack.config.js` 中設置 `mode` 選項：

```js
module.exports = {
  mode: 'development',
};
```

經過了以上介紹，你會發現 Webpack 本身以集成了許多功能，以往在使用 Gulp 時，都必須倚賴相關套件才能達到相同效果，Webpack 把這些使用頻率較高的套件集成在自己身上，透過簡單配置，即可達到相同效益，非常的方便。

## Webpack 額外說明 - 使用 ESM 模組規範

以往在開發 Gulp 時，都只能使用 CommonJS 模組規範相關語法做撰寫，當然你也可以使用 `gulpfile.babel.js` 並導入 Babel 做撰寫，但你不會覺得這樣有點太麻煩了嗎？ESM 規範語法確實好用，但兼容性問題未解決之前，一切真的都免談。基於 Webpack 本身就是以模組為核心，他很完美的整合了各式的模組規範，你不需要載入任何的套件，照正常編寫即可，以下為 ES6 Modules 範例：

請先新增 `src/js/module.js` 檔案並輸入以下內容：

```js
export default () => {
  console.log('Hello World');
};
```

在 entry 入口處引入模組：

```js
import fun from './js/module';

fun();
```

執行 `npm run build` 進行打包並觀察引入後 Console 結果：

![基於 Webpack 的 ESM 示範](https://i.imgur.com/QMSUbjr.png)

當出現以上結果及代表編譯成功，我們沒有進行任何配置，就只是單純的使用 ESM 規範語法而已，這也是 Webpack 的其中一個特點，**在 entry 入口處的任意檔案能夠隨意使用任何模組規範**，透過 Webpack 解析模組間的相互依賴關係，最後打包成靜態檔案，當瀏覽器引入時也不存在兼容性等問題。

## Webpack 額外說明 - 多個入口起點

上面所講述的，都是以單個頁面，也就是單個 `index.html` 為主，但有時我們會需要開發多個頁面的網站，這時該怎麼配置 Webpack 呢？請先在 `src` 資料夾建立以下所需檔案：

```plain
webpack-demo/
│
├─── src/
│   │
│   ├─── main.js          # entry 入口檔案(1)
│   └─── about.js         # entry 入口檔案(2)
```

至 `webpack.config.js` 進行配置：

```js
const path = require('path');

module.exports = {
  entry: {
    main: './src/main.js',
    about: './src/about.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
};
```

事實上，entry 入口處除了以字串型式宣告入口文件路徑外，還能夠以物件的方式進行傳遞，如上面範例所示，且傳統我們會稱 `entry.main`、`entry.about` 為物件的 "key"，在 Webpack 中稱之為 "chunk"，而一個 "chunk" 對應一個 entry 入口文件路徑，這樣子的型式稱之為多入口文件，最後 output 時也會各自打包成獨立的 JavaScript 檔案，最後要注意的是 `output.filename` 中檔案名稱的寫法，等等會再作解釋，讓我們先執行 `npm run build` 編譯看看：

![webpack result](https://i.imgur.com/12r89pn.png)

觀察打包後的 dist 資料夾，確實生成了 `about.js` 與 `main.js` 檔案，有別於以往寫死名稱的作法，使用 `[name]` 能夠依照 "chunk" 名稱命名打包後的檔案名稱，提供更大的彈性，這邊要注意是，**使用多文件入口時，千萬不能把 filename 寫死，會發生打包後名稱相同問題，導致編譯失敗**。讓我們來看其他 `[name]` 的範例：

```js
const path = require('path');

module.exports = {
  entry: './src/about.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
};
```

上面為單個 entry 並搭配 `[name]` 的範例，我們並沒有使用物件方式配置 "chunk"，此時打包過後的檔案名稱是什麼呢？答案為 `main.js`，**其實使用字串方式宣告 entry 單入口文件路徑，等同於下面的寫法**：

```js
const path = require('path');

module.exports = {
  entry: {
    main: './src/about.js',
  },
};
```

除了 `[name]` 用法以外，Webpack 還提供了很多類似用法，詳細可看 [這邊](https://webpack.js.org/configuration/output/#outputfilename)，以上就是 Webpack 多個入口起點該如何配置的簡單介紹。
