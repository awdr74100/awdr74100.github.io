---
title: Webpack 前端打包工具 - 使用 clean-webpack-plugin 清除構建資料夾
description:
  [
    在我們每次編譯 Webpack 時，都必須刪除之前測試所建構的 dist 資料夾，以確保結果為最新狀態，可能有些人並沒有這個困擾，那是因為你並沒有在 filename 屬性加入 hash 值，此時編譯處理為取代其檔案，在一般開發中我們都會在檔案名稱加入 hash 值，避免快取機制發生的問題，此時由於檔案名稱的 hash 值不同，其編譯處理將轉為新增，dist 資料夾也就會遺留之前測試所建構出的檔案。此篇將介紹使用 clean-webpack-plugin 在每次編譯時刪除之前測試所建構出的檔案，接著才生成編譯結果。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-03-25 02:18:29
updated: 2020-03-26 00:03:11
---

## 前言

在我們每次編譯 Webpack 時，都必須刪除之前測試所建構的 dist 資料夾，以確保結果為最新狀態，可能有些人並沒有這個困擾，那是因為你並沒有在 filename 屬性加入 hash 值，此時編譯處理為取代其檔案，在一般開發中我們都會在檔案名稱加入 hash 值，避免快取機制發生的問題，此時由於檔案名稱的 hash 值不同，其編譯處理將轉為新增，dist 資料夾也就會遺留之前測試所建構出的檔案。此篇將介紹使用 clean-webpack-plugin 在每次編譯時刪除之前測試所建構出的檔案，接著才生成編譯結果。

## 筆記重點

- clean-webpack-plugin 安裝
- clean-webpack-plugin 基本使用
- clean-webpack-plugin 可傳遞選項
- 補充：cleanOnceBeforeBuildPatterns 使用技巧

## clean-webpack-plugin 安裝

> 套件連結：[clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

clean-webpack-plugin：

```bash
$ npm install clean-webpack-plugin -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```

為了避免有任何誤會，請同時安裝 CSS 相關 loader 以及 clean-webpack-plugin，這一個 Plugin 主要是針對資料夾做操作，並不是針對特定檔案做操作，確保測試所建構出的檔案能夠完整被刪除。

## clean-webpack-plugin 基本使用

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
│   └─── main.js          # entry 入口檔案
│
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli、css-loader、clean-webpack-plugin、mini-css-extract-plugin
```

<div class="note warning">前面為示範之前所提到的遺留測試所建構檔案問題。</div>

撰寫 CSS 範例：

```css
.text-primary {
  color: #2525b1;
}
```

entry 入口處 (`src/main.js`) 引入 CSS 檔案：

```js
import './css/all.css'; // 使用 ESM 方式引入
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
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
      filename: 'css/[name].[hash].css',
    }),
  ],
};
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
$ npm run build
```

隨意修改 CSS 使 hash 值更動：

```css
.text-primary {
  color: #49bd79;
}
```

再次執行 `npm run build` 指令，以下為編譯後的目錄結構：

```plain
webpack-demo/
│
└─── dist/
│   │
│   └─── css/
│       │
│       └─── main.341ff16a50939fca12a9.css
|       └─── main.592df2c6643f48d39238.css
│   │
│   └─── main.341ff16a50939fca12a9.js
|   └─── main.592df2c6643f48d39238.js
```

在我們每次有任何修改檔案行為時，hash 值都會有所改變，這也就導致了 `dist` 資料夾有殘留測試所建構檔案問題，正常來講不應該有這些檔案才對，當然你也可以手動刪除，但你使用的可是自動化工具阿！當然也要用自動化的方式來解決，讓我們來導入 clean-webpack-plugin 看看效果如何。

修改 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 載入 clean-webpack-plugin (第一步)
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
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
      filename: 'css/[name].[hash].css',
    }),
    // 創建實例 (第二步)
    new CleanWebpackPlugin(),
  ],
};
```

再次執行 `npm run build` 指令，並查看編譯結果：

```plain
webpack-demo/
│
└─── dist/
│   │
│   └─── css/
│       │
│       └─── main.341ff16a50939fca12a9.css
│   │
│   └─── main.341ff16a50939fca12a9.js
```

從上面結果可以得知，我們的 `dist` 資料夾殘留的檔案都被刪除了，整個資料夾都是全新的狀態，**clean-webpack-plugin 是以同步的方式刪除檔案**，也就代表刪除資料夾後才會進行生成 `dist` 資料夾動作，不存在刪除資料夾時就生成檔案問題。

你可能會好奇，以往在使用類似功能的 del 套件時，都必須指定所要刪除得資料夾路徑，為什麼 clean-webpack-plugin 不用呢？只是單純的創建實例就可以自動幫我們刪除 dist 資料夾，太神奇了吧！關於這點將在下面做補充，

## clean-webpack-plugin 可傳遞選項

可參考 [clean-webpack-plugin Options](https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional) 可傳遞參數列表，以下為常用的參數配置：

- verbase：`Boolean`
  將日誌寫入控制台，默認為 `false`

範例：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
  ],
};
```

## 補充：cleanOnceBeforeBuildPatterns 使用技巧

事實上，clean-webpack-plugin 預設的刪除目錄為 `output.path` 指定的目錄，也就是絕對路徑下的 `dist` 資料夾，透過 `cleanOnceBeforeBuildPatterns` 這一個可傳遞選項指定並刪除目錄下的所有檔案，如下所示：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'], // 預設值 (相對於 output.path 指定目錄下)
    }),
  ],
};
```

也因為這一個可傳遞選項，促使 clean-webpack-plugin 在每次編譯前刪除指定目錄下的文件，這邊要注意的是，你可以在 `output.path` 目錄下指定刪除任何的檔案，但沒辦法使用相對路徑方式刪除目錄之外的檔案，如下所示：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '../*.json'],
    }),
  ],
};
```

上面寫法代表著在每次編譯前即刪除 `output.path` 下的所有檔案以及 `output.path` 上一層目錄下的所有 `.json` 檔案，但這樣子的寫法是行不通的，編譯過程會報錯，如果你想要刪除 `output.path` 目錄之外的文件，需使用絕對路徑寫法，如下所示：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', path.resolve(__dirname, '*.json')],
    }),
  ],
};
```

有時我們想要在刪除的範圍內保留特定檔案，比如說上面範例中的 `package.json` 與 `package-lock.json`，我們可以使用 `!` 排除文件，如下範例：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        path.resolve(__dirname, '*.json'),
        `!${path.resolve(__dirname, 'package*')}`,
      ],
    }),
  ],
};
```

有 `cleanOnceBeforeBuildPatterns` 的存在，想當然也有 `cleanAfterEveryBuildPatterns` 的存在，使用方式一模一樣，差別只在於一個是編譯前進行處理，一個是編譯後進行處理，各位可自行嘗試，下面為 `cleanAfterEveryBuildPatterns` 的範例：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [], // 預設值 (不刪除任何檔案)
    }),
  ],
};
```
