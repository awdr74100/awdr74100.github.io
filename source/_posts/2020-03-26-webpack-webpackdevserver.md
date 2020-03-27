---
title: Webpack 前端打包工具 - 使用 webpack-dev-server 實現 Live Reload 或 HMR 方式進行開發
description:
  [
    在 Gulp 的環境中，我們會導入 Browsersync 套件方便以 Live Reload 方式做開發，在 Webpack 中也有類似的套件，名為 webpack-dev-server，與傳統 Live Reload 工具較為不同的是，除了支援 Live Reload 方式以外，同時也支援 HMR (Hot Module Replacement) 特性，再不刷新 Browser 的情況下注入修改過後的代碼，達到不丟失應用狀態下即時更新畫面。此篇將介紹如何使用 webpack-dev-server 以 Live Reload 或 HMR 方式進行開發，途中也會補充 publicPath 與 contentBase 這兩個坑人的選項正確用法。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-03-26 00:20:08
updated: 2020-03-27 22:00:10
---

## 前言

在 Gulp 的環境中，我們會導入 Browsersync 套件方便以 Live Reload 方式做開發，在 Webpack 中也有類似的套件，名為 webpack-dev-server，與傳統 Live Reload 工具較為不同的是，除了支援 Live Reload 方式以外，同時也支援 HMR (Hot Module Replacement) 特性，再不刷新 Browser 的情況下注入修改過後的代碼，達到不丟失應用狀態下即時更新畫面。此篇將介紹如何使用 webpack-dev-server 以 Live Reload 或 HMR 方式進行開發，途中也會補充 publicPath 與 contentBase 這兩個坑人的選項正確用法。

## 筆記重點

- webpack-dev-server 安裝
- webpack-dev-server 基本使用
- webpack-dev-server 可傳遞選項
- 補充：webpack-dev-server 開啟 HMR 支持

## webpack-dev-server 安裝

> 套件連結：[webpack-dev-server](https://github.com/webpack/webpack-dev-server)、[css-loader](https://github.com/webpack-contrib/css-loader)、[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

webpack-dev-server：

```bash
$ npm install webpack-dev-server -D
```

require：

```bash
$ npm install css-loader html-webpack-plugin mini-css-extract-plugin -D
```

請先將一般開發環境所需的 loader 與 plugin 進行安裝，最後也必須安裝 webpack-dev-server 用以作為此次討論的目標。

## webpack-dev-server 基本使用

<div class="note warning">此次範例會搭配 css-loader、html-webpack-plugin、mini-css-extract-plugin 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a>、<a href="https://awdr74100.github.io/2020-03-23-webpack-htmlwebpackplugin/" target="_blank">html-webpack-plugin</a>、<a href="https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/" target="_blank">mini-css-extract-plugin</a></div>

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── css/
│       │
│       └─── all.css      # CSS 主檔案
│   │
│   └─── js/
│       │
│       └─── all.js       # JavaScript 主檔案
│   │
│   └─── main.js          # entry 入口檔案
│
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli、webpack-dev-server、css-loader、html-webpack-plugin、mini-css-extract-plugin
```

撰寫 CSS 範例：

```css
.text-primary {
  color: #2525b1;
}
```

撰寫 JavaScript 範例：

```js
console.log('Hello World');
```

至 `./src/index.html` 撰寫 HTML 模板範例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1 class="text-primary">Hello World</h1>
  </body>
</html>
```

<div class="note warning">此段落不需要配置任何有關 webpack-dev-server 的設定</div>

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
```

你一定看過很多文章寫說需要配置 `devServer.contentBase` 選項，才能夠正確指定伺服器需啟動根目錄為何，這完全是錯誤的解釋，在上面範例中，我們沒有配置任何的 `devServer` 選項，全部都已預設方式配置，讓我們來看結果如何。

entry 入口處 (`src/main.js`) 引入 CSS、JavaScript 檔案：

```js
import './css/all.css';
import './js/all';
```

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "build": "webpack --mode development"
  }
}
```

請注意上面指令的寫法，以往我們都是使用 `webpack` 來執行編譯，這邊可新增內容為 `webpack-dev-server` 的 `dev` 指令進行以 webpack-dev-server 開啟 localhost 的動作。

執行 `dev` 指令：

```bash
$ npm run dev
```

手動輸入 `localhost:8080` 開啟本地伺服器：

![webpack-dev-server 開啟結果](https://i.imgur.com/34bUNUB.png)

成功運行！我們可以從上面結果得知，使用 `webpack-dev-server` 能夠開啟一個本地伺服器，預設的 port 為 8080，且支援 Live Reload，你可以自由的更改 CSS、JavaScript、HTML 檔案，Browser 會自動刷新所有內容，以後都不用按 F5 囉。

此時你可能會去找 `dist` 的資料夾是否有成功編譯後的檔案，答案是沒有的，使用 webpack-dev-server 會將打包後的檔案暫存在記憶體內，並不會打包出實體的檔案，你可以把它想像成在記憶體內的 `dist` 資料夾，實體的 `dist` 資料夾結構為何，記憶體內的 `dist` 資料夾結構就為何；由於我們使用了 html-webpack-plugin 將指定模板進行打包，所以我們的實體/記憶體 `dist` 資料夾在根目錄就會有自動引入靜態檔案的 `index.html`，本地伺服器預設就是將這一個檔案進行載入，也就跑出了上面的畫面。

讓我們回來探討 webpack-dev-server 的 `devServer` 選項作用為何，請先新增以下內容：

```js
module.exports = {
  // 其他省略
  devServer: {
    port: 9000,
    open: true,
  },
};
```

- `port`
  - 用來設定本地伺服器的端口，預設為 8080
  - 命令列：webpack-dev-server <span>-</span><span>-</span>port 9000
- `open`
  - 伺服器啟動後是否自動打開瀏覽器，預設為 false
  - 命令列：webpack-dev-server <span>-</span><span>-</span>open

上面這兩個選項蠻好理解的，且我平常也都會設定，免除手動開啟伺服器的困擾。讓我們來看其他選項：

```js
module.exports = {
  // 其他省略
  devServer: {
    publicPath: '/assets/',
    contentBase: path.resolve(__dirname, 'dist'),
  },
};
```

- `publicPath`
- 打包生成的靜態文件在記憶體中的位置 (若 devServer.publicPath 沒有設置，則參考 output.publicPath 的值，若兩者都沒有設置，預設為 `/` )
- `contentBase`
- 告訴伺服器從何處提供原始內容。僅當你要提供靜態文件時才需要配置 (devServer.publicPath 優先於此選項使用，預設為當前執行目錄)

上面這兩個選項就有點抽象了，讓我們直接執行 `npm run dev` 查看結果：

位置：`localhost:8080`

![webpack-dev-server devServer.publicPath 無法取得](https://i.imgur.com/y3LdnUC.png)

位置：`localhost:8080/assets/`

![webpack-dev-server devServer.publicPath 成功取得](https://i.imgur.com/SxB251Q.png)

我們可以從上面結果得知，伺服器的存取位置被改變了，以下是模擬存在記憶體的資料夾結構：

```plain
localhost/
│
└─── assets/
│   │
│   └─── css/
│       │
│       └─── main.css
│   │
│   └─── js/
│       │
│       └─── main.js
│   │
│   └─── index.html
```

相信大家已經猜的到 `devServer.publicPath` 的功能了，它會在記憶體中的 `dist` 資料夾增加一層 `assets` 目錄，這也導致預設的 `localhost:8080` 找不到任何檔案，需要到下一層的目錄才找的到 `index.html` 這一支檔案，也就是 `localhost:8080/assets/` 內，這邊要注意的是如果你沒有配置 `devServer.publicPath` 選項，預設會向 `output.publicPath` 取值，如果兩者都沒有配置，預設值為 `/`，這也是為什麼一開始都沒有配置任何 `devServer` 選項時，能夠直接在 `localhost:8080` 看到畫面的原因。

至於 `devServer.contentBase` 是最常被誤解的選項，你可能看過很多人都是像上面範例一樣配置，但這樣子是完全沒有意義的，`devServer.contentBase` 主要用來使 webpack-dev-server 在開啟伺服器時如果找不到 `index.html` 檔案，就轉而載入指定的內容，像是範例中的 `dist` 資料夾，根本不存在這一個資料夾，載入時也就引發了 express 的 middleware 提示 (webpack-dev-server 是基於 Node.js 中的 express 建構出來)，這也是為什麼上面範例中 `localhost:8080` 會跳出 `Cannot GET /` 的原因，伺服器找不到存在於 `/` 的 `index.html` 檔案，轉而向 `devServer.contentBase` 取得內容，但根本不存在 `webpack-demo/dist` 這一個資料夾，導致同樣也找不到內容，就直接跳錯誤了，你可以嘗試把配置改成如下內容：

```js
module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname, 'node_modules'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index789.html', // 將 index.html 改為 index789.html
    }),
  ],
};
```

位置：`localhost:8080`

![webpack-dev-server devServer.contentPath 無法取得](https://i.imgur.com/mjYgGce.png)

位置：`localhost:8080/index789.html`

![webpack-dev-server devServer.contentPath 成功取得](https://i.imgur.com/XYo10pE.png)

如同我們前面所講到的，`devServer.contentBase` 選項主要用來使伺服器在 `devServer.publicPath` 目錄下找不到 `index.html` 檔案時，轉而載入的內容，由於我們指定了 `node_modules` 目錄，這也就導致在 `localhost:8080` 根路徑時，載入的是 `node_modules` 目錄的內容，`localhost:8080/index789.html` 載入的才是正確內容。

經過了上面的介紹，相信各位已經了解 `devServer` 常見的配置了，當我們不配置 `publicPath` 與 `contentBase` 選項且 html-webpack-plugin 的 `filename` 為 `index.html` 時，伺服器取得的資料夾結構就如同實體編譯出來的資料夾結構，這也是為什麼當初不配置任何 `devServer` 選項能夠成功開啟伺服器並且指向正確目錄的原因。

## webpack-dev-server 可傳遞選項

可參考 [webpack-dev-server Configuration](https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional) 可傳遞參數列表，以下為常用的參數配置：

- stats：`none` | `errors-only` | `minimal` | `normal` | `verbose` | `Object`
  精準控制要顯示的 bundle 訊息，可使用集成配置或自訂配置，可參考 [stats 文檔](https://webpack.js.org/configuration/stats/)，默認為 `normal`

範例：

```js
module.exports = {
  devServer: {
    stats: {
      assets: true,
      cached: false,
      chunkModules: false,
      chunkOrigins: false,
    },
  },
};
```

## 補充：webpack-dev-server 開啟 HMR 支持

在上面所有的操作中，我們都是以 Live Reload 方式進行，所謂的 Live Reload 就是只說在刷新瀏覽器時注入修改過後的代碼，達到即時更新的目的，雖然說已經很好用了，但是在某些情況下還是有點小抱怨，比如說 Live Reload 並不能夠保存應用的狀態 (states)，當刷新頁面後，應用之前的狀態也會丟失，因為它是以重新載入的方式處理修改過後的代碼，這在於某些情況下，真的很不方便，開發體驗也較差，你可以把它想像成傳統頁面與 SPA 頁面之間的差異。

也因為上面所提到的問題，webpack-dev-server 的出現就是為了解決這一個問題，它兼容 Live Reload 方式進行開發，同時也支援了 HMR (Hot Module Replacement) 方式開發，所謂的 HMR 就是指在不刷新畫面的狀態下，注入修改過後的代碼，你可以把它想像成在 Chrome 的開發者工具直接修改 Style 樣式一般，提供開發的體驗以及效率。Webpack 預設是使用 Live Reload，我們可透過配置方式開啟 HMR 功能，讓我們直接開始吧！

配置 `webpack.config.js` 檔案：

```js
module.exports = {
  devServer: {
    hot: true, // 開啟 HMR 支持
  },
};
```

當你啟用 `devServer.hot` 選項時，Webpack 會自動引入 `webpack.HotModuleReplacementPlugin`，代表說我們不需要手動引入這一個 Plugin，只需要單純的開啟 `hot` 選像即可。

entry 入口處 (`src/main.js`) 引入 HMR JavaScript API：

```js
// 其他省略 ...

// 開啟 HMR 支持 (全部模組)
if (module.hot) {
  module.hot.accept();
}
```

切記一定要在 entry 入口處增加上面這段代碼，以完全啟用 HMR 功能。

到了這邊我們可以先執行 `npm run dev` 查看結果：

![webpack-dev-server 開啟 HMR 支持](https://i.imgur.com/v4MnYuL.gif)

以上測試是基於修改 `./src/js/all.js` 檔案而成，可以發現 HMR 確實成功啟用了，再不更新頁面的狀態下注入打包過後的新代碼，開發體驗提高不少，但這邊還有一個問題，就是修改 `./src/css/all.css` 檔案時，並沒有任何反應，那是因為我們還沒有開啟 mini-css-extract-plugin 的 HMR 支持，操作如下：

<div class="note warning">style-loader 預設就已經開啟 HMR 支持，不需要特定做配置</div>

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true, // 開啟 HMR 支持
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

執行 `npm run dev` 查看結果：

![mini-css-extract-plugin 開啟 HMR 支持](https://i.imgur.com/7qMS2rR.gif)

這邊還有一個最尷尬的情況，那就是 html-webpack-plugin 不支持 HMR 方式進行，這也是為什麼修改 `./src/index.html` 時完全沒有反應的原因，解決辦法就是將 index.html 當成 Live Reload 方式進行，操作如下：

```js
module.expores = {
  devServer: {
    contentBase: './src/index.html',
    watchContentBase: true,
  },
};
```

前面有講解到關於 `contentBase` 的使用技巧，而 `watchContentBase` 這一個選項就是用來更改 `contentBase` 作用的，當你開啟這一個選項，它會幫你監控指定目錄或檔案是否有更動，如果有，即刷新頁面。當然如果你使用的是像 vue-loader 等方式進行畫面渲染的話，就沒有這一個問題，因為都會通過 entry 入口處，而 html-webpack-plugin 是以抓取模板的方式進行處理，並不會通過 entry，這也導致了無法支援 HMR，說實在的，真的很可惜阿！
