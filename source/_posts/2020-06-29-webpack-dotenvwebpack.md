---
title: Webpack 前端打包工具 - 使用 dotenv-webpack 設置全局變量
description:
  [
    在 Webpack 中我們會使用 DefinePlugin 或 EnvironmentPlugin 來設置全局變量，以提供 entry 內的模組針對這一個變數快速做響應，但有一點困擾我們的是，這兩個 Plugin 撰寫的全局變量都是屬於顯式性質的，代表任何人都能從所撰寫的位置得知這一個全局變量，如果情況發生在尚未發布的專案，有心人就可利用這一個變量，通常為測試主機位址，進一步做攻擊的動作，在後端我們會使用 dotenv 套件，前端可使用 dotenv-webpack 套件，屬 DefinePlugin 與 dotenv 的包裝，進一步將變量中的敏感信息隱藏起來。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-06-29 21:23:49
updated: 2020-06-29 21:23:49
---

## 前言

在 Webpack 中我們會使用 DefinePlugin 或 EnvironmentPlugin 來設置全局變量，以提供 entry 內的模組針對這一個變數快速做響應，但有一點困擾我們的是，這兩個 Plugin 撰寫的全局變量都是屬於顯式性質的，代表任何人都能從所撰寫的位置得知這一個全局變量，如果情況發生在尚未發布的專案，有心人就可利用這一個變量，通常為測試主機位址，進一步做攻擊的動作，在後端我們會使用 dotenv 套件，前端可使用 dotenv-webpack 套件，屬 DefinePlugin 與 dotenv 的包裝，進一步將變量中的敏感信息隱藏起來。

## 筆記重點

- dotenv-webpack 安裝
- dotenv-webpack 基本使用
- dotenv-webpack 可傳遞選項

## dotenv-webpack 安裝

> 套件連結：[dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack)

主要的套件：

```bash
npm install dotenv-webpack -D
```

package.json：

```json
{
  "devDependencies": {
    "dotenv-webpack": "^1.8.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  }
}
```

dotenv-webpack 屬 DefinePlugin 與 dotenv 的包裝，這兩個套件都不需要額外進行安裝，其中的 DefinePlugin 是 Webpack 本身就存在的套件，而 dotenv 則是 dotenv-webpack 的相依套件，嚴格來講是 dotenv-default 的相依套件。

## dotenv-webpack 基本使用

初始專案結構：

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

前面我們先來看 DefinePlugin 與 EnvironmentPlugin 是如何設置全局變量的：

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: 'http://localhost:3000',
    }),
  ],
};
```

這邊要注意，上面 DefinePlugin 中的 value 寫法是錯誤的，可參考以下示例：

```js
// 讀取
console.log(API_URL);

// 結果
console.log(http://localhost:3000);
```

DefinePlugin 會將編譯範圍內的全局變量 key 替換成對應的 value，這邊的替換是指原封不動的進行替換，此時可能就會造成像上面這樣子的結果，建議透過 `JSON.stringify()` 來完成予值動作：

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('http://localhost:3000'),
    }),
  ],
};
```

此時就能確保編譯後的結果如預期：

```js
console.log('http://localhost:3000');
```

很明顯的 DefinePlugin 有著不直覺的設計，這才有了後來的 EnvironmentPlugin 出現：

```js
module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      API_URL: 'http://localhost:3000',
    }),
  ],
};
```

上面等效於以下 DefinePlugin 的寫法：

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('http://localhost:3000'),
    }),
  ],
};
```

是不是很酷？在 EnvironmentPlugin 宣告的全局變量始終都會有 `process.env` 字串符前綴，這邊的 `process.env` 並不是指環境變數，如果你到 `process.env` 底下是找不到 `API_URL` 這個對象的，加入 `process.env` 的目的在於模擬環境變數的使用，這邊我們也不需要手動加入 `JSON.stringify()` 語法，EnvironmentPlugin 會自動幫我們添加，可參考以下示例：

```js
// 讀取
console.log(process.env.API_URL);

// 結果
console.log('http://localhost:3000');
```

跑過 DefinePlugin 與 EnvironmentPlugin 你會發現兩者所撰寫的全局變量都是屬於顯示性質的，假設你將此專案推至 GitHub 等遠端 Repository 並將其設為公開，任何人都能在 Webpack 配置檔看到這些全局變量，這是很危險的一件事，這時候就是 dotenv-webpack 出場的時候了，配置如下：

```js
const path = require('path');
// 載入 dotenv-webpack (第一步)
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  plugins: [
    // 創建實例 (第二步)
    new Dotenv(),
  ],
};
```

配置 dotenv-webpack 相當簡單，與其他 Webpack Plugin 大同小異，在 dotenv-webpack 內部有一個可傳遞選項名為 `path`，預設指向 `./.env` 這支檔案，這也是我們配置全局變量的地方，先新增這一支檔案：

```diff
 webpack-demo/
 │
+└─── .env
```

配置方法就如同後端的 dotenv 套件，參考以下：

```plain
API_URL = http://localhost:3000
```

目前我們就只是將全局變量額外撰寫至 `.env` 檔內，為了達到隱藏的目的可將 `.env` 檔案新增至 `.gitignore` 內，這樣就能避免 GitHub 存在任何顯式型態的全局變量，接著來說明 `.env` 檔內的全局變量該如何做使用：

```js
// 讀取
console.log(process.env.API_URL);

// 結果
console.log('http://localhost:3000');
```

畢竟 dotenv-webpack 屬 DefinePlugin 與 dotenv 的包裝，取用的方法自然就跟 DefinePlugin 很像，優點是少了 DefinePlugin 那些不直覺的設計，dotenv-webpack 內部與 EnvironmentPlugin 差不多，都已經幫我們處理好 `process.env` 與 `JSON.stringify()` 的問題，凡是在 `.env` 設置的全局變量，一律都是使用 `process.env.XXX` 將其讀取，這邊唯一要注意的是，`.env` 設置的全局變量都是屬於字串型態，在某些情況下我們得自己處理轉型的問題。

這邊做個補充，在 `.env` 撰寫的全局變量嚴格來講並不屬於隱式型態，畢竟在前端沒有所謂的隱式說法，最後還是會透過打包暴露給引用對象，凡是有基礎底子的人都能透過原始碼推測全局變量的內容值，dotenv-webpack 所能做的就是限制全局變量的暴露關係，只將代碼中顯示引用的全局變量暴露給最終綑綁包，代表未經引用的變量將被拋棄，任何人都無法查看這一個變量內容。

## dotenv-webpack 可傳遞選項

可參考 [dotenv-webpack Options](https://www.npmjs.com/package/dotenv-webpack#properties) 可傳遞參數列表，以下為常用的參數配置：

- path：`String`
  配置全局變量的位置，默認為 `./.env`

- systemvars：`Boolean`
  允許加載所有系統變量，默認為 `false`

範例：

<!-- prettier-ignore-start -->
```js
const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [
    new Dotenv({
      path:
        process.env.NODE_ENV === "development"
          ? "./.env.development"
          : "./.env.production",
      systemvars: true,
    }),
  ],
};
```
<!-- prettier-ignore-end -->
