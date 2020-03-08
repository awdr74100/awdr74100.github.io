---
title: Webpack 前端打包工具 - 使用 url-loader 與 file-loader 處理靜態資源
description:
  [
    上一次在介紹 mini-css-extract-plugin 時，有提到關於使用 background-image:url() 以相對路徑參考本地圖片時所發生的錯誤，最後是使用 file-loader 解決此問題；簡單來說，file-loader 就是用來處理一般開發網頁時所使用的靜態資源，例如：字形、圖片等等，將所有資源載入到 Webpack 內，並且解析資源的相互依賴，最後以配置的選項生成對應的結果；而 url-loader 則類似於 file-loader，可依資源的大小做對應的處理。此篇將介紹 file-loader 與 url-loader 的使用方法，以及兩者在應用時最大的差別為何。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-03-09 01:12:33
updated: 2020-03-09 01:12:33
---

## 前言

上一次在介紹 mini-css-extract-plugin 時，有提到關於使用 background-image:url() 以相對路徑參考本地圖片時所發生的錯誤，最後是使用 file-loader 解決此問題；簡單來說，file-loader 就是用來處理一般開發網頁時所使用的靜態資源，例如：字形、圖片等等，將所有資源載入到 Webpack 內，並且解析資源的相互依賴，最後以配置的選項生成對應的結果；而 url-loader 則類似於 file-loader，可依資源的大小做對應的處理。此篇將介紹 file-loader 與 url-loader 的使用方法，以及兩者在應用時最大的差別為何。

## 筆記重點

- url-loader 與 file-loader 安裝
- url-loader 與 file-loader 基本使用
- url-loader 與 file-loader 可傳遞選項
- 補充：url-loader 與 file-loader 實際應用
- 補充：file-loader 載入本地字體

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

在 file-loader 中的 `name` 屬性就類似於其他 loader 或 plugin 的 `filename` 屬性，不同的地方在於，`name` 屬性得依照官方文件中的 [Placeholders](https://github.com/webpack-contrib/file-loader#placeholders) 配置才行，上面這個配置就是最基本的依照 entry 檔案的名稱以及附檔名進行 output。

<div class='note danger'>切記先將 dist 資料夾完全刪除，以保證最新的編譯結果如同預期，之後也會介紹使用 clean-webpack-plugin 解決此問題</div>

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

而 **url-loader 中的 options 選項是與 file-loader 共用的**，差別在於 url-loader 新增了 `limit` 選項，用以設置可轉為 base64 的文件大小上限，如下所示：

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

url-loader 唯一的功能就在於將資源轉換為 `base64` 的格式，主要依靠 `limit` 控制需轉換的文件，轉為 `base64` 的好處就在於，往後網頁在渲染圖片時，不需要以 request 的方式加載圖片，直接向 JavaScript 檔案拿取即可，這樣子以效能來說，會提高許多，但你也不能把大小的上限設定太高，由於 `base64` 是存在於 bundle.js 內，這樣子的做法會導致 JavaScript 異常的肥大，對於效能來說反而會下降，衡量並設置適當的大小才是正確的作法。

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

<div class="note warning">file-loader 用以將靜態資源載入到 Webpack 內，並且解析資源的相互依賴關係，最後 output 到指定的位置，而 url-loader 用以將指定大小上限內的圖片資源轉換為 base64 格式，如遇到超過上限的資源，將 fallback 給 file-loader 做處理，兩者功能並沒有衝突，由於處理對象相同，導致很多人會搞混，通常兩個 loader 都是一起使用居多，並且直接設置 url-loader 即可</div>

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
  設置 output 時的文件名稱，相關參數可參考 [Placeholders](https://github.com/webpack-contrib/file-loader#placeholders)，默認為 `[contenthash].[ext]`

- outputPath：`String` | `Function`
  指定目標文件的公共路徑，在 [mini-css-extract-plugin](https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/#補充：publicPath-修改目標公共路徑) 文章有介紹到，默認為 `underfined`

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

## 補充：url-loader 與 file-loader 實際應用

前面講解到了 url-loader 與 file-loader 的基本使用方式，這次讓我們帶入到實際應用內，加深各位對這兩個 loader 的印象。

> 套件連結：[url-loader](https://github.com/webpack-contrib/url-loader)、[file-loader](https://github.com/webpack-contrib/file-loader)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

url-loader 與 file-loader：

```bash
$ npm install url-loader file-loader -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── img/
│       │
│       └─── banner.jpg   # Size >= 10 KB
│       └─── logo.jpg     # Size < 10 KB
│   │
│   └─── css/
│       │
│       └─── all.css      # CSS 主檔案
│   │
│   └─── main.js          # entry 入口檔案
│
└─── index.html           # 引入 bundle.js 與 main.css 測試用檔案
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json         # 已安裝 webpack、webpack-cli、css-loader、mini-css-extract-plugin、url-loader、file-loader
```

撰寫 CSS 範例：

```css
.w-100-h-100 {
  width: 100px;
  height: 100px;
}

.bg-cover {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.banner {
  background-image: url('../img/banner.jpg');
}

.logo {
  background-image: url('../img/logo.png');
}
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // 由於 CSS 增加了一層的結構，相對的 publicPath 也需增加一層
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            // 直接配置 url-loader 就好，超過上限的資源會自動 fallback 給 file-loader
            loader: 'url-loader',
            options: {
              name: 'img/[name].[ext]',
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};
```

這邊要特別注意！並不是 file-loader 與 url-loader 都要進行配置，直接配置 url-loader 就等同於配置了 file-loader，`limit` 內的會交由 url-loader 處理，超過 `limit` 的資源則會 fallback 給 file-loader 進行處理。

<div class="note danger">Webpack 會自動解析 CSS 內的參考圖檔，將它抓出來以 require 的方式處理，除非有特定資源需要透過 file-loader 處理，不然不需要另外的 import 這些 CSS 所用的圖檔</div>

entry 入口處 (`src/main.js`) 引入 CSS 檔案：

```js
import './css/all.css';
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

至 `./index.html` 引入打包而成的 `bundle.js` 與 `main.css` 檔案：

```html
<!-- 其他省略 -->
<head>
  <!-- 引入打包生成的 CSS -->
  <link rel="stylesheet" href="dist/css/main.css" />
</head>
<body>
  <div class="banner w-100-h-100 bg-cover"></div>
  <div class="logo w-100-h-100 bg-cover"></div>
  <!-- 引入打包生成的 JavaScript -->
  <script src="dist/js/bundle.js"></script>
</body>
```

查看結果：

![file-loader 結果](https://i.imgur.com/MOMIu8C.png)

![url-loader 結果](https://i.imgur.com/MoyAU11.png)

從上面結果可以得知，logo.png 圖檔已被轉換成 base64 格式，而 banner.png 這張較大的圖檔，被 url-loader fallback 給 file-loader 處理，最後就只是在配置的指定位置生成而已。

## 補充：file-loader 載入本地字體

有時我們在開發網頁時，會需要使用一些特殊字體，像我本身就很常到 [Google Fonts](https://fonts.google.com/) 拉一些字體出來用，不僅可以增加網頁整體的質感，還可以擺脫傳統字體的呆板樣式。

而外部字體的載入方式有很多種，包含一般最為常見的 CSS link，或是使用 `@import` 方式載入字體，我個人是偏好使用 `@font-face` 來載入字體，將字體給下載下來，提供較為穩定的載入字體方法。

先前介紹了以 file-loader 或 url-loader 來處理圖片等靜態資源，此章節將介紹如何以 file-loader 處理 `.ttf`、`.otf` 等字體資源，讓我們直接開始吧！

> 請先至 [Google Fonts](https://fonts.google.com/) 隨意下載字體，並放置在 `src/font` 內

```diff
 webpack-demo/
 │
 └─── src/
 │   │
+│   └─── font/
+│       │
+│       └─── NotoSansTC-Regular.otf
```

以 `@font-face` 載入本地字體：

```css
@font-face {
  font-family: 'NotoSansTC';
  src: url('../font/NotoSansTC-Regular.otf') format('opentype');
}

p {
  font-family: 'NotoSansTC';
  font-size: 40px;
}
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
        ],
      },
      // 處理 require("font")
      {
        test: /\.(woff|woff2|eot|ttf|otf|)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'font/[name].[ext]',
            },
          },
        ],
      },
      // 處理 require("image")
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name].[ext]',
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};
```

這邊要注意，如果你打算將圖片、文字打包後放置在同一個路徑下，可以不必另外寫一個 Regex 去處理，上面這種寫法，主要是將圖片與文字放置在不同的資料夾，千萬要記得，Webpack 會將 CSS 內的相關路徑參考語法轉換為 `require` 的方式進行處理，並不是說 file-loader 的配置只能在 url-loader 區塊內配置，Webpack 是以 Regex 配對相關的 use，千萬不要搞混了！

執行編譯：

```bash
$ npm run build
```

此時 `src` 資料夾內的 `font` 也通通打包進來了，以下為打包後的 `dist` 資料夾專案結構：

```plain
webpack-demo/
│
└─── dist/
│   │
│   └─── font/
│       │
│       └─── NotoSansTC-Regular.otf
// 其他省略
```

觀察打包生成的 CSS 檔案：

```css
@font-face {
  font-family: 'NotoSansTC';
  src: url(../font/NotoSansTC-Regular.otf) format('opentype');
}

p {
  font-family: 'NotoSansTC';
  font-size: 40px;
}
```

從上面結果可以得知，CSS 內的 `@font-face` 連結也是正確的，此時打開網頁即可看到字體已被更改，我們打包字體的目的也就成功了。
