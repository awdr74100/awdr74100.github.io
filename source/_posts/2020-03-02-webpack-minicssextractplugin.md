---
title: Webpack 前端打包工具 - 使用 mini-css-extract-plugin 把 CSS 抽離出來
description:
  [
    此篇為接續上一篇再說明如何將 CSS 給單獨抽離的介紹文章。上一次我們利用了 style-loader 將 css-loader 處理過後的 CSS 注入到 HTML 內，將以 style 標籤的形式存在，但這有違一般開發的處理流程，建議還是將 CSS 檔案給獨立出來，既方便修改，也不會造成效能上的疑慮。這一次我們改用 mini-css-extract-plugin 將 CSS 給單獨抽離出來，並說明途中可能會踩到的坑以及該如何解決等辦法。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-03-02 15:15:50
updated: 2020-03-03 08:26:34
---

## 前言

此篇為接續上一篇再說明如何將 CSS 給單獨抽離的介紹文章。上一次我們利用了 style-loader 將 css-loader 處理過後的 CSS 注入到 HTML 內，將以 style 標籤的形式存在，但這有違一般開發的處理流程，建議還是將 CSS 檔案給獨立出來，既方便修改，也不會造成效能上的疑慮。這一次我們改用 mini-css-extract-plugin 將 CSS 給單獨抽離出來，並說明途中可能會踩到的坑以及該如何解決等辦法。

## 筆記重點

- mini-css-extract-plugin 安裝
- mini-css-extract-plugin 基本使用
- mini-css-extract-plugin 可傳遞選項
- 補充：background-image: url() 以相對路徑參考本地圖片時發生錯誤
- 補充：更改 CSS 檔案生成路徑
- 補充：publicPath 修改目標公共路徑

## mini-css-extract-plugin 安裝

> 套件連結：[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)、[css-loader](https://github.com/webpack-contrib/css-loader)

主要的套件：

```bash
npm install mini-css-extract-plugin -D
```

過程使用的套件：

```bash
npm install css-loader -D
```

package.json：

```json
{
  "devDependencies": {
    "css-loader": "^3.4.2",
    "mini-css-extract-plugin": "^0.9.0",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  }
}
```

這邊要注意的是 mini-css-extract-plugin 是屬於 Webpack 的 Plugin，主要為 style-loader 的另一種類型套件，你可以不用下載 style-loader，但主要編譯還是得依靠 css-loader，也就是說 mini-css-extract-plugin 與 css-loader 都必須進行安裝。

## mini-css-extract-plugin 基本使用

<div class="note warning">此次範例會搭配 css-loader 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a></div>

初始專案結構：

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── css/
│       │
│       └─── all.css      # CSS 主檔案
│   │
│   └─── main.js          # entry 入口檔案
│
├─── index.html           # 引入 bundle.js 與 main.css 測試用檔案
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

撰寫 CSS 範例：

```css
.text-primary {
  color: #2525b1;
}
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
// 載入 mini-css-extract-plugin (第一步)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // 新增 loader (第三步)
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // 創建實例 (第二步)
  plugins: [new MiniCssExtractPlugin()],
};
```

配置 Plugin 相對於配置 loader 簡單不少，只需要新增 `plugins` 屬性，並以陣列項目的方式新增對應的 plugin 實例對象即可，如上範例。

entry 入口處 (`src/main.js`) 引入 CSS 檔案：

```js
import './css/all.css'; // 使用 ESM 方式引入
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

至 `./index.html` 引入打包而成的 `bundle.js` 與 `main.css` 檔案：

```html
<!-- 其他省略 -->
<head>
  <!-- 引入打包生成的 CSS -->
  <link rel="stylesheet" href="dist/main.css" />
</head>
<body>
  <h1 class="text-primary">Hello World</h1>
  <!-- 引入打包生成的 JavaScript -->
  <script src="dist/bundle.js"></script>
</body>
```

查看結果：

![mini-css-extract-plugin 結果](https://i.imgur.com/8VdqkNr.png)

是不是一切都正常多了？相比於使用 style-loader 將 CSS 注入到 HTML，我更喜歡使用 mini-css-extract-plugin 將 CSS 給獨立抽取出來，我相信這應該也是大多人開發的習慣，這邊還有一點要注意，CSS 檔案目前是生成在與 bundle.js 同一個階層目錄，我自己是習慣將 CSS 放置在各自的資料夾，這點在後面會在補充說明。

## mini-css-extract-plugin 可傳遞選項

<div class="note danger">關於 publicPath 更為詳細的說明，可參考下面的補充說明</div>

可參考 [mini-css-extract-plugin Options](https://github.com/webpack-contrib/mini-css-extract-plugin#options) 可傳遞參數列表，以下為常用的參數配置：

- publicPath：`String` | `Function`
  指定目標文件的公共路徑，默認為 `webpackOptions.output`

範例：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../', // 指定公共路徑
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

## 補充：background-image: url() 以相對路徑參考本地圖片時發生錯誤

<div class="note warning">此章節會使用到 file-loader，由於目前還未曾介紹過此套件，建議讀者可先至相關連結閱讀其文章，再回來吸收本章節內容，效果可能會更好喔！</div>

經過了上面的介紹，相信各位對使用 mini-css-extract-plugin 都有一定程度的了解，細心的朋友可能已經發現其中的問題了，那就是使用 `background-image: url()` 語法時，Webpack 打包會跳出錯誤，事實上，這個問題並不是歸咎於這一個語法，而是歸咎於使用相對路徑參考本地圖片，這邊要注意，是使用相對路徑參考，而不是使用絕對路徑參考，使用絕對路徑參考本地圖片是不會發生錯誤的，讓我們來探討這個問題該如何解決。

> 請先至 `src` 資料夾新增 `img` 資料夾並放入隨便一張圖片

```diff
 webpack-demo/
 │
 ├─── src/
 │   │
+│   └─── img/
+│       │
+│       └─── test.jpg
```

撰寫以**絕對路徑**參考本地圖片的 CSS 範例：

```css
.bg-img {
  background-image: url('/src/img/test.jpg');
}
```

執行編譯指令：

```bash
npm run build
```

成功編譯，打包後的 CSS 如下：

```css
.bg-img {
  background-image: url('/src/img/test.jpg');
}
```

從上面範例可以得知，使用絕對路徑方式參考本地圖片是不會發生任何錯誤的，但沒有人會使用這種方式參考圖片，主要原因為圖片並不會自動透過 Webpack 打包到 `dist` 資料夾，且最後生產環境是以 `dist` 資料夾為主，根本不存在 `src` 資料夾，這也就導致引入圖片失敗，故沒有人會使用絕對路徑來撰寫參考圖片，讓我們來看使用相對路徑的範例：

撰寫以**相對路徑**參考本地圖片的 CSS 範例：

```css
.bg-img {
  background-image: url('../img/test.jpg');
}
```

執行編譯指令：

```bash
npm run build
```

編譯失敗，出現以下結果：

![相對路徑參考本地圖片發生錯誤](https://i.imgur.com/NG2cD5C.png)

簡單來講呢，就是 Webpack 會自動偵測 CSS 檔案內所參考的相對路徑圖片，並且把它轉換成 `require` 方式引用圖片，如下所示：

```plain
<!-- 遇到 -->
background-image: url("test.jpg");

<!-- 解析成 -->
require("./test.jpg");
```

而為什麼會發生錯誤呢？原理如同之前所介紹的 Webpack 基礎知識，Webpack 本身只能處理 JavaScript 檔案，如果需要使用 CSS，就必須引入到 entry 內並配置 css-loader，而圖片檔則是依靠 url-loader 或 file-loader，這兩個 loader 就是專門用來處理圖片等類似檔案的，讓我們以 file-loader 來示範：

```bash
npm install file-loader -D
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

關於 file-loader 的配置可至相關連結進行閱讀，這邊就不多加以說明，讓我們直接進行編譯看看：

```bash
npm run build
```

成功編譯！此時 `src` 資料夾內的圖片也通通打包進來了，以下為打包後的 `dist` 資料夾專案結構：

```diff
webpack-demo/
│
├─── dist/
│   │
│   ├─── bundle.js        # 打包生成的 JavaScrit 檔案
│   ├─── main.css         # 打包生成的 CSS 檔案
│   └─── test.jpg         # 自動抓取並通過 file-loader 的圖片檔
```

觀察打包生成的 CSS 檔案：

```css
.bg-img {
  background-image: url(test.jpg);
}
```

從上面結果可以得知，連同參考路徑也幫我們做了修正，這也是會什麼使用相對路徑參考本地圖片時，需要使用 file-loader 的原因，它會透過解析修正你的相對路徑，非常的方便，但這邊千萬要注意，**當你同時修改了 CSS 檔案的生成路徑，也務必要修改 mini-css-extract-plugin 的 publicPath 路徑**，這點在後面會有說明，讓我們先從更改檔案生成路徑開始做介紹。

## 補充：更改 CSS 檔案生成路徑

以往我們在開發網頁時，習慣將各個語言放置在屬於自己資料夾，方便辨識之外，也有避免檔案過大等問題，但在初期配置 Webpack 時，你會發現 output 的檔案全部都生成在 `dist` 目錄階層下，相比於 Gulp ，簡單修改 `gulp.dest()` 即可更改放置目錄，Webpack 配置方式差不多，但可能有些小陷阱需要特別注意，先讓我們來看之前曾提過的 `bundle.js` 生成路徑修改範例：

```js
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 把它想像成 gulp.dest(...)
    filename: 'js/bundle.js',
  },
};
```

從上面範例可以看出，只需要修改 output 內的 `filename` 選項，即可將生成路徑做對應的修改，此時打包後的 `dist` 資料夾結構如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── js/
│       │
│       └─── bundle.js    # 打包生成的 JavaScrit 檔案
```

這邊千萬要注意，**修改路徑並不是修改 output 內的 path 選項**，這會導致所有的 loader 或 plugin 都得做相對應的修改，變得非常的麻煩！讓我們來看 mini-css-extract-plugin 該如何與上面範例一樣修改檔案生成路徑：

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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 把它想像成 gulp.dest(...)
      filename: 'css/[name].[hash:3].css',
    }),
  ],
};
```

在每一個 plugin 中，都可以傳遞一個物件，而這一個物件可以配置 `filename`、`chunkFilename` 等屬性，配置原理如同 output 內的 `filename` 選項，同時也可以使用 `output.filename` 的模板字串，詳情可參考 [這裡](https://webpack.js.org/configuration/output/#template-strings)，此時打包後的 `dist` 資料夾結構如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── js/
│       │
│       └─── bundle.js    # 打包生成的 JavaScrit 檔案
│   │
│   └─── css/
│       │
│       └─── main.18f.css # 打包生成的 CSS 檔案
```

事實上，大部分的 loader 或 plugin 都可以藉由修改 `filename` 更改打包後的生成路徑，唯一要注意的是，像 CSS 這種檔案，我們很常使用 `background-image: url("../..")` 來載入圖片，這時問題就來了，`filename` 的生成路徑並不會響應樣式表內的相對路徑，打包出來的結果也就變成找不到圖片，這時候就得依靠 publicPath 可傳遞選項修改公共路徑，修正打包後的相對路徑，這樣說起來可能有點複雜，讓我們繼續往下看。

## 補充：publicPath 修改目標公共路徑

讓我們結合以上所補充的兩點說明，此時 `webpack.config.js` 檔案配置如下：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js', // 修改生成路徑
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]', // 修改生成路徑
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // 修改生成路徑
    }),
  ],
};
```

這邊要注意 file-loader 的可傳遞選項 `name` 的寫法，這樣子的寫法相較於使用 `outputPath` 選項，我更推薦使用此種寫法，此時打包後的 `dist` 資料夾結構如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── js/
│       │
│       └─── bundle.js    # 打包生成的 JavaScrit 檔案
│   │
│   └─── css/
│       │
│       └─── main.css     # 打包生成的 CSS 檔案
│   │
│   └─── img/
│       │
│       └─── test.jpg     # 自動抓取並通過 file-loader 的圖片檔
```

**打包前**的 CSS 檔案：

```css
.bg-img {
  background-image: url('../img/test.jpg');
}
```

**打包後**的 CSS 檔案

```css
.bg-img {
  background-image: url(img/test.jpg);
}
```

圖片跑不出來！打包後的路徑怎會變成這樣呢？因為我們修改了 CSS 預設的檔案生成路徑，對於 file-loader 來說，CSS 的檔案生成路徑還是以 `dist` 目錄下為主，這也就導致了圖片找不到的問題，解決方式也很簡單，主要有以下三種：

1. 使用 mini-css-extract-plugin 中的 `publicPath` 更改公共路徑 **(推薦)**：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../', // 修改公共路徑
            },
          },
          'css-loader',
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

相對於使用其他方法，我自己是偏好這一個方法，你可以把 publicPath 想像成替所有參考圖片路徑增加一個前綴，由於我們更改了 CSS 檔案的生成路徑，也就是多新增了一層目錄放置檔案，相對的，publicPath 也必須往上一層去找檔案，此時打包後的 CSS 結果如下：

```css
.bg-img {
  background-image: url(../img/test.jpg);
}
```

---

2. 使用 Webpack 基本配置中的 `output.publicPath` 修改公共路徑：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
    publicPath: '/', // 修改公共路徑
  },
};
```

Webpack 中的 `output.publicPath` 選項，原理就如同 mini-css-extract-plugin 中的 `publicPath` 選項，一樣都是替資源中的相對路徑增加一個前綴，但與之不同的是，在 Webpack 中配置 publicPath 選項，會導致全域的修改，沒辦法像 mini-css-extract-plugin 獨立的配置，我自己是不太常用這一個方法，此時打包後的 CSS 結果如下：

```css
/* dist 目錄下 */
.bg-img {
  background-image: url(/img/test.jpg);
}
```

---

3. 使用 file-loader 中的 `publicPath` 修改公共路徑：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
              publicPath: '../', // 修改公共路徑
            },
          },
        ],
      },
    ],
  },
};
```

file-loader 的 publicPath 選項，原理如同前面兩個，但它是針對所有通過 file-loader 的檔案進行配置，有時候某些 JavaScript 會引入需通過 file-loader 的檔案，這時候 publicPath 的路徑配置可能會跟 CSS 有些衝突，除非 file-loader 就只是用來處理圖片資源，不然不建議直接將 publicPath 設置在 file-loader， 此時打包後的 CSS 結果如下：

```css
.bg-img {
  background-image: url(../img/test.jpg);
}
```

以上三種方法都可以修正預設的引用路徑，使資源載入正確，到了這邊，問題通通都被解決了，這也是一開始我在學習時所遇到的坑，沒想到解決方式這麼簡單，推薦給大家。
