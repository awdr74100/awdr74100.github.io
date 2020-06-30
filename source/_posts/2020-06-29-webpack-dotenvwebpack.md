---
title: Webpack 前端打包工具 - 使用 dotenv-webpack 設置全局變量
description:
  [
    在 Webpack 中我們會使用 DefinePlugin 或 EnvironmentPlugin 來設置全局變量，以提供 entry 內的模組針對這一個變數快速做響應，但有一點困擾我們的是，這兩個 Plugin 撰寫的全局變量都是屬於顯式性質的，代表任何人都能從所撰寫的位置得知這一個全局變量，如果情況發生在尚未發布的專案，有心人就可利用這一個變量，通常為測試主機位址，進一步做攻擊的動作，在後端我們會使用 dotenv 套件，前端可使用 dotenv-webpack 套件，屬 DefinePlugin 與 dotenv 的包裝，進一步將變量中的敏感信息隱藏起來。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-06-29 21:23:49
updated: 2020-06-30 18:01:30
---

## 前言

在 Webpack 中我們會使用 DefinePlugin 或 EnvironmentPlugin 來設置全局變量，以提供 entry 內的模組針對這一個變數快速做響應，但有一點困擾我們的是，這兩個 Plugin 撰寫的全局變量都是屬於顯式性質的，代表任何人都能從所撰寫的位置得知這一個全局變量，如果情況發生在尚未發布的專案，有心人就可利用這一個變量，通常為測試主機位址，進一步做攻擊的動作，在後端我們會使用 dotenv 套件，前端可使用 dotenv-webpack 套件，屬 DefinePlugin 與 dotenv 的包裝，進一步將變量中的敏感信息隱藏起來。

## 筆記重點

- dotenv-webpack 安裝
- dotenv-webpack 基本使用
- dotenv-webpack 可傳遞選項
- 補充：cross-env 與 dotenv-webpack 差別

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

配置 dotenv-webpack 相當簡單，與其他 Webpack Plugin 大同小異，在 dotenv-webpack 內部有一個可傳遞選項名為 `path`，預設指向 `./.env` 這支檔案，這也是我們設置全局變量的地方，請先新增名為 `.env` 的檔案：

```diff
 webpack-demo/
 │
+└─── .env
```

配置方法如同後端的 dotenv 套件，參考以下：

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

畢竟 dotenv-webpack 屬 DefinePlugin 與 dotenv 的包裝，取用的方法自然就跟 DefinePlugin 很像，優點是少了 DefinePlugin 那些不直覺的設計，dotenv-webpack 內部與 EnvironmentPlugin 差不多，都已經幫我們處理好 `process.env` 與 `JSON.stringify()` 的問題，凡是在 `.env` 設置的全局變量，一律都是使用 `process.env.XXX` 將其讀取，這邊唯一要注意的是 `.env` 設置的全局變量都是屬於字串型態，在某些情況下我們得自己處理轉型的問題。

這邊做個補充，在 `.env` 撰寫的全局變量嚴格來講並不屬於隱式型態，畢竟在前端沒有所謂的隱式說法，最後還是會透過打包暴露給引用對象，凡是有基礎底子的人都能透過原始碼推測全局變量的內容值，dotenv-webpack 所能做的就是限制全局變量的暴露關係，只將代碼中顯示引用的全局變量暴露給最終綑綁包，代表未經引用的變量將被拋棄，任何人都無法查看這一個變量內容。

## dotenv-webpack 可傳遞選項

可參考 [dotenv-webpack Options](https://www.npmjs.com/package/dotenv-webpack#properties) 可傳遞參數列表，以下為常用的參數配置：

- path：`String`
  配置全局變量的位置，默認為 `./.env`

- systemvars：`Boolean`
  允許加載所有系統變量，包含 cross-env 設置的變量，默認為 `false`

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
      systemvars: true, // 允許讀取 process.env 下的任意系統變量
    }),
  ],
};
```
<!-- prettier-ignore-end -->

## 補充：cross-env 與 dotenv-webpack 差別

這邊補充關於 cross-env 與 dotenv-webpack 的差別，嚴格來講是比較 cross-env 與 DefinePlugin 的差別，畢竟 dotenv-webpack 與 EnvironmentPlugin 都是基於 DefinePlugin 所設計，前面已經安裝過 dotenv-webpack 了，這邊將 cross-env 也給安裝進來：

```bash
npm install cross-env -D
```

接著在 `package.json` 新增 `cross-env` 指令：

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

之前我們有提到使用 cross-env 的目的在於兼容各平台的環境變數設置，畢竟在 Windows 系統下是無法直接像 `NODE_ENV=development` 這樣設置環境變數的，這時候就牽扯到一個問題了，那就是這個環境變數取用的範圍是到哪裡？直接來看範例：

```js
// ./webpack.config.js
console.log(process.env.NODE_ENV); // development

// ./src/main.js
console.log(process.env.NODE_ENV); // development
```

這時你可能會認為 cross-env 設置的環境變數可在任何地方做使用，代表運行環境與編譯環境都能讀取到值，這其實是錯誤的觀念，你可以嘗試將 cross-env 的變量更改為如下：

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development USER_NAME=Roya webpack",
    "build": "cross-env NODE_ENV=production USER_NAME=Eric webpack"
  }
}
```

接著讀取環境變量：

```js
// ./webpack.config.js
console.log(process.env.NODE_ENV); // development
console.log(process.env.USER_NAME); // Roya

// ./src/main.js
console.log(process.env.NODE_ENV); // development
console.log(process.env.USER_NAME); // undefined
```

發現到神奇的地方了嗎？除了 `NODE_ENV` 變量以外，其它變量在編譯環境都讀不到值，這邊的編譯環境是指 entry 入口引入的那些模組，比如說 `./src/main.js`，而運行環境就是指除此之外的那些檔案，比如說 `./webpack.config.js`，這邊的 `NODE_ENV` 變量其實不是由 cross-env 設置的，而是我們在設置 `mode` 選項時，Webpack 自動使用 DefinePlugin 設置的，參考以下：

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('<當前環境>'),
    }),
  ],
};
```

所以我們可以得出的結論是，**使用 cross-env 設置的環境變量只能在運行環境讀取到其值**，在編譯環境是無法讀取到值的，較常使用在 `webpack.config.js` 做為邏輯的判斷。

看完了 cross-env 的介紹，接著來看 DefinePlugin 設置的變量範圍：

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.USER_NAME': JSON.stringify('Roya'),
    }),
  ],
};
```

如同我們前面所說，上面寫法等效於以下：

```js
module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      USER_NAME: 'Roya',
    }),
  ],
};
```

也等效於 dotenv-webpack 的寫法：

```plain
USER_NAME = Roya
```

接著讀取全局變量：

```js
// ./webpack.config.js
console.log(process.env.USER_NAME); // undefined

// ./src/main.js
console.log(process.env.USER_NAME); // Roya
```

很明顯的 **DefinePlugin、EnvironmentPlugin、dotenv-webpack 設置的全局變量都只存在於編譯環境內**，畢竟要先有編譯的這個動作，Webpack 才能將這些變量注入進去，這點蠻合理的，這也是我前面強調這些方法屬於全局變量但不屬於環境變量的原因。

基於 cross-env 設置的變量是屬於環境變量，代表變量是掛載到 `process.env` 物件下，假設你使用的是 dotenv-webpack 設置變量，可開啟 `systemvars` 選項，這時編譯環境內就能夠讀取到 cross-env 設置的環境變量，可參考以下：

```js
module.exports = {
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
  ],
};
```

不須在 `.env` 設置全局變數，直接讀取 cross-env 設置的環境變量即可：

```js
console.log(process.env.USER_NAME);
```
