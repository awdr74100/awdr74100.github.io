---
title: Webpack 前端打包工具 - 使用 url-loader 與 file-loader 處理靜態資源
description:
  [
    上一次在介紹 mini-css-extract-plugin 時，有提到關於使用 background-image:url() 以相對路徑參考本地圖片時所發生的錯誤，最後是使用 file-loader 解決此問題；簡單來說，file-loader 就是用來處理一般開發網頁時所使用的靜態資源，例如：字形、圖片等等，將所有資源載入到 Webpack 內，並且解析資源的相互依賴，最後以配置的選項生成對應的結果；而 url-loader 則類似於 file-loader，可依資源的大小做對應的處理。此篇將介紹 file-loader 與 url-loader 的使用方法，以及兩者在應用時最大的差別為何。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-03-09 17:54:48
updated: 2020-03-09 17:54:48
---

## 前言

上一次在介紹 mini-css-extract-plugin 時，有提到關於使用 background-image:url() 以相對路徑參考本地圖片時所發生的錯誤，最後是使用 file-loader 解決此問題；簡單來說，file-loader 就是用來處理一般開發網頁時所使用的靜態資源，例如：字形、圖片等等，將所有資源載入到 Webpack 內，並且解析資源的相互依賴，最後以配置的選項生成對應的結果；而 url-loader 則類似於 file-loader，可依資源的大小做對應的處理。此篇將介紹 file-loader 與 url-loader 的使用方法，以及兩者在應用時最大的差別為何。

## 筆記重點

- url-loader 與 file-loader 安裝
- url-loader 與 file-loader 基本使用
- url-loader 與 file-loader 可傳遞選項

## url-loader 與 file-loader 安裝

> 套件連結：[url-loader](https://github.com/webpack-contrib/url-loader)、[file-loader](https://github.com/webpack-contrib/file-loader)

url-loader：

```bash
$ npm install url-loader -D
```

file-loader：

```bash
$ npm install file-loader -D
```

在前面章節，我們會先以 file-loader 做示範，直到關於 `base64` 一詞的出現，才會使用到 url-loader，請先將兩個 loader 進行安裝。

## file-loader 與 url-loader 基本使用

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── img/
│       │
│       └─── test.png     # 測試用圖片
│   │
│   └─── main.js          # entry 入口檔案
│
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli、url-loader、file-loader
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          // 配置 loader (第一步)
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
```

配置 file-loader 相對簡單，這邊要注意的是，目前我們的 Regex 只有單純篩選圖片的相關檔案，並未包含其他靜態資源。

entry 入口處 (`src/main.js`) 引入圖片檔案：

```js
import './img/test.png';
```

執行編譯指令：

```bash
$ npm run build
```

此時會生成名稱為 hash 值的圖片檔案：

```diff
 webpack-demo/
 └─── dist/
 │   │
+│   └─── 4664caca877b29c20cf1cc536e41911e.png
 │   └─── bundle.js
```

相信有閱讀過以前 Webpack 文章的朋友已經發現其中的問題，那就是我們還沒有配置 `filename`，導致預設名稱為 hash 值，這邊要注意，file-loader 並沒有 `filename` 這個屬性，取而代之的是 `name` 屬性，讓我們趕緊來配置它：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          // 配置 loader (第一步)
          {
            loader: 'file-loader',
            options: {
              // 配置 name 屬性 (第二步)
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

在 file-loader 中的 `name` 屬性就類似於其他 loader 或 plugin 的 `filename` 屬性，不同的地方在於，`name` 屬性得依照 [官方文件](https://github.com/webpack-contrib/file-loader#placeholders) 配置才行，上面這個配置就是最基本的依照 entry 檔案的名稱以及附檔名進行 output。

再次執行編譯指令：

```bash
$ npm run build
```

此時會生成與 entry 檔案名稱相同的圖片檔案：

```diff
 webpack-demo/
 └─── dist/
 │   │
+│   └─── test.png
 │   └─── bundle.js
```

以上就是 file-loader 的基本使用，可能有人會問，那 url-loader 呢？神奇的事情要發生了！讓我們直接將上面的 `webpack.config.js` 中的 file-loader 更改為 url-loader，如下所示：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader', // 將 file-loader 更改為 url-loader
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

此時如果你執行 `npm run build` 進行編譯，結果會與 file-loader 一模一樣，有沒有很神奇？事實上，url-loader 預設提供了一個名為 `fallback` 的選項，用以調用超過文件大小的程序，如下所示：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 超過大小時調用 file-loader 處理該檔案
              fallback: require.resolve('file-loader'),
            },
          },
        ],
      },
    ],
  },
};
```

而 **url-loader 中的 options 選項是與 file-loader 共用的**，差別在於 url-loader 新增了 `limit` 等選項，用以設置文件轉為 base64 的大小上限，如下所示：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              limit: 8192, // 用以限制須轉為 base64 的文件大小 (單位：byte)
            },
          },
        ],
      },
    ],
  },
};
```

url-loader 唯一的功能就在於將資源轉換為 `base64` 的格式，主要依靠 `limit` 控制需轉換的文件，轉為 `base64` 的好處就在於，往後網頁在渲染圖片時，不需要以 request 的方式加載圖片，直接向 JavaScript 檔案拿取即可，這樣子以效能來說，會提高許多，但你也不能把大小的上限設定太高，由於 `base64` 是存在於 bundle.js 內，這樣子的做法會導致 JavaScript 異常的肥大，對於效能來說反而會下降，設置適當的大小才是正確的作法。

<div class='note danger'>切記先將 dist 資料夾完全刪除，以保證最新的編譯結果如同預期，之後也會介紹使用 clean-webpack-plugin 解決此問題</div>

再次執行編譯指令：

```bash
$ npm run build
```

通過 url-loader 的文件將轉成 `base64` 存在於 bundle.js 內：

```plain
webpack-demo/
└─── dist/
│   │
│   └─── bundle.js    # 圖片轉為 base64 存在於 JavaScript 檔案內
```

關於 `base64` 的實際應用將在下面補充，讓我們來做個總結：

<div class="note warning">fiel-loader 用以將靜態資源載入到 Webpack 內，並且解析資源的相互依賴關係，最後 output 到指定的位置，而 url-loader 用以將指定大小上限內的圖片資源轉換為 base64 格式，如遇到超過上限的資源，將 fallback 給 file-loader 做處理，兩者功能並沒有衝突，只是處理的對象差不多，導致很多人會搞混，通常兩個 loader 都是一起使用居多，並且直接設置 url-loader 即可</div>

## url-loader 與 file-loader 可傳遞選項

<div class="note warning">可與 file-loader 選項共用</div>

可參考 [url-loader Options](https://github.com/webpack-contrib/url-loader#options) 可傳遞參數列表，以下為常用的參數配置：

- limit：`Number` | `Boolean` | `String`
  限制可轉為 base64 的檔案大小上限，單位為 byte，默認為 `underfined`

- fallback：`String`
  指定當文件大小超過 limit 限制時，需轉向的加載程序，默認為 `fiel-loader`

範例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 用以限制須轉為 base64 的文件大小 (單位：byte)
              limit: 8192,
              // 超過大小及調用 file-loader
              fallback: require.resolve('file-loader'),
            },
          },
        ],
      },
    ],
  },
};
```

---

可參考 [file-loader Options](https://github.com/webpack-contrib/file-loader#options) 可傳遞參數列表，以下為常用的參數配置：

- name：`String` | `Function`
  設置 output 時的文件名稱，可用參數可參考 [這裡](https://github.com/webpack-contrib/file-loader#placeholders)，默認為 `[contenthash].[ext]`

- outputPath：`String` | `Function`
  指定文件放置的公共路徑，之前的 [文章](https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/#補充：publicPath-修改目標公共路徑) 有介紹到，默認為 `underfined`

範例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              // 設置 output 時的檔案名稱
              name: 'img/[name].[ext]',
              // 修改公共路徑
              publicPath: '../',
            },
          },
        ],
      },
    ],
  },
};
```
