---
title: Webpack 前端打包工具 - 使用 sass-loader 編譯 Sass/SCSS 預處理器
description:
  [
    以我自己來說，已經很少用純 CSS 來撰寫樣式表了，大多時候都是直接使用 SCSS 作為開發語言，既方便又高效，雖然說得透過編譯器使之編譯成 CSS 檔案才能在瀏覽器運行，但這一切對於現代化開發來講，似乎已經不成問題了。此篇將介紹如何使用 sass-loader 編譯我們的 Sass/SCSS 預處理器，並說明途中可能會遇到的陷阱，以及一般人最為困惑的 Node Sass 與 Dart Sass 使用上的差別。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, SCSS]
date: 2020-03-04 15:25:06
updated: 2020-03-05 16:54:52
---

## 前言

以我自己來說，已經很少用純 CSS 來撰寫樣式表了，大多時候都是直接使用 SCSS 作為開發語言，既方便又高效，雖然說得透過編譯器使之編譯成 CSS 檔案才能在瀏覽器運行，但這一切對於現代化開發來講，似乎已經不成問題了。此篇將介紹如何使用 sass-loader 編譯我們的 Sass/SCSS 預處理器，並說明途中可能會遇到的陷阱，以及一般人最為困惑的 Node Sass 與 Dart Sass 使用上的差別。

## 筆記重點

- sass-loader 安裝
- sass-loader 基本使用
- sass-loader 可傳遞選項
- 補充：Dart Sass 與 Node Sass
- 補充：使用 resolve.alias 參考相對路徑圖片

## sass-loader 安裝

> 套件連結：[sass-loader](https://github.com/webpack-contrib/sass-loader)、[node-sass](https://github.com/sass/node-sass)

主要的套件：

```bash
npm install sass-loader node-sass -D
```

過程會使用到的套件：

```bash
npm install css-loader mini-css-extract-plugin -D
```

package.json：

```json
{
  "devDependencies": {
    "css-loader": "^3.4.2",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.13.1",
    "sass-loader": "^8.0.2",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  }
}
```

請注意！安裝 sass-loader 並不像 gulp-sass 會將依賴的 node-sass 也一起安裝，也就是說 sass-loader 與 node-sass 都需要進行安裝。以及 sass-loader 只負責編譯 Sass/SCSS 部分，最後還是得依靠 css-loader 與 mini-css-extract-plugin 生成獨立的檔案，通通給他安裝下去就對了！

## sass-loader 基本使用

<div class="note warning">此次範例會搭配 css-loader 與 mini-css-extract-plugin 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a>、<a href="https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/" target="_blank">mini-css-extract-plugin</a></div>

初始專案結構：

```plain
webpack-demo/
│
└─── node_modules/
└─── src/
│   │
│   └─── scss/
│       │
│       └─── all.scss     # SCSS 主檔案
│   │
│   └─── main.js          # entry 入口檔案
│
└─── index.html           # 引入 bundle.js 與 main.css 測試用檔案
└─── webpack.config.js    # Webpack 配置檔案
└─── package-lock.json
└─── package.json
```

撰寫 SCSS 範例：

```scss
$primary: #2525b1;

.text-primary {
  color: $primary;
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
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        // 把 sass-loader 放在首要處理 (第一步)
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

其實從上面的範例可以看出，配置 sass-loader 非常的簡單，只需要將其放置在使用 loader 的第一順位即可，後面的步驟就如同之前所介紹的，利用 css-loader 與 mini-css-extract-plugin 把 CSS 給獨立抽取成單獨檔案。

entry 入口處 (`src/main.js`) 引入 SCSS 檔案：

```js
import './scss/all.scss'; // 使用 ESM 方式引入
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

![sass-loader 結果](https://i.imgur.com/8VdqkNr.png)

可能有人會覺得配置 sass-loader 挺簡單的，沒錯！就是這麼簡單。基於 Webpack 這種現代化工具來說，要處理這些預處理器真的不難，唯一有點小障礙的部分也就只有之前在 mini-css-extract-plugin 介紹的 `background-image: url("../..")` 使用相對路徑參考本地圖片發生錯誤的問題，有興趣的人可至相關連結進行閱讀，可能會有更深的理解喔！相關連結：[mini-css-extract-plugin](https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/)

## sass-loader 可傳遞選項

可參考 [sass-loader Options](https://github.com/webpack-contrib/sass-loader#options) 可傳遞參數列表，以下為常用的參數配置：

- sassOptions：`Object` | `Function`
  [Node Sass](https://github.com/sass/node-sass/#options) 或 [Dart Sass](https://github.com/sass/dart-sass#javascript-api) 的可傳遞的選項，預設為 `none`

範例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed', // Node Sass 的可傳遞選項
              },
            },
          },
        ],
      },
    ],
  },
};
```

## 補充：Dart Sass 與 Node Sass

<div class="note warning">Dart Sass 與 Node Sass 都屬於 Sass 的編譯器，Dart Sass 具備編譯輸出為 JavaScript 的能力，目前為 Sass 的主要開發對象，這也代表各種新功能將優先引入；Node Sass 底層使用的是 LibSass，基於 C/C++ 編寫，這使其編譯速度快過 Dart Sass；對於一般開發建議使用 Node Sass，如有新功能的需求，可使用 Dart Sass。</div>

在 sass-loader 中，與之前介紹的 gulp-sass 使用 Dart Sass 有所不同。sass-loader 在默認情況下，是以 `package.json` 中的依賴關係判定當下所需使用的編譯器，如下範例：

使用 Node Sass 編譯器：

```bash
npm install node-sass -D
```

```json
{
  "devDependencies": {
    "sass-loader": "^8.0.2",
    "node-sass": "^4.13.1" // 只存在 node-sass
  }
}
```

使用 Dart Sass 編譯器：

```bash
npm install sass -D
```

```json
{
  "devDependencies": {
    "sass-loader": "^8.0.2",
    "sass": "^1.26.2" // 只存在 sass (dart-sass)
  }
}
```

從上面示例可以看出，**sass-loader 是依造你當前環境唯一的編譯器做使用，不需要進行任何配置**，如果只存在哪個編譯器就直接使用它，可能會有人問，那如果同時存在兩個編譯器呢？這種情況的話，sass-loader 默認會使用 node-sass，這也是當你安裝 sass-loader 且沒有安裝任何編譯器時，如果直接進行編譯的話，會跳出安裝 node-sass 的提示。

sass-loader 也提供了一種 `implementation` 選項，用來使在同時安裝 node-sass 與 dart-sass 編譯器情況下，強制切換成需要的編譯器，如下範例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'), // 強制使用 dart-sass 編譯器
            },
          },
        ],
      },
    ],
  },
};
```

## 補充：使用 resolve.alias 參考相對路徑圖片

<div class="note warning">此章節會使用到 file-loader，由於目前還未曾介紹過此套件，建議讀者可先至相關連結閱讀其文章，再回來吸收本章節內容，效果可能會更好喔！</div>

之前完整介紹了有關 mini-css-extract-plugin 使用 publicPath 解決 `background-image: url()` 以相對路徑參考本地圖片時所發生的問題，連結在 [這裡](https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/)，這一次我們在做一點更細微的補充，先讓我們來看目前的 SCSS 資料夾結構：

```plain
webpack-demo/
│
└─── src/
│   │
│   └─── scss/
│       │
│       └─── base
│           │
│           └─── _reset.scss
│       │
│       └─── helpers
│           │
│           └─── _variables.scss
│       │
│       └─── component
│           │
│           └─── _navbar.scss
│       │
│       └─── all.scss     # SCSS 主檔案
```

在我們使用 Sass/SCSS 撰寫樣式表時，很常以上面這種結構來區分使用的對象，假設我們目前在撰寫 `navbar` 元件，且需要以 `background-image: url()` 來增加 logo 圖片，我們可能會這樣寫：

```scss
// path：src/scss/component/_navbar.scss

.logo {
  background-image: url('../../img/test.png');
}
```

載入所有 SCSS 模組：

```scss
// path：src/scss/all.scss

@import './component/navbar';
// 其他省略
```

這時如果直接編譯，會跳出以下錯誤：

![sass-loader 圖片找不到](https://i.imgur.com/xh9tus1.png)

你可能會好奇，怎麼會跳出錯誤？且錯誤提示還是指出圖片的路徑錯誤，導致找不到圖片，其實原理很簡單，**在我們撰寫 SCSS 的模組時，所有的相對路徑都應該是基於 `all.scss` 檔案才對，也就是載入所有模組的主檔案**，如果以上面範例來說明，正確的路徑寫法應該如下：

```scss
// path：src/scss/component/_navbar.scss

.logo {
  background-image: url('../img/test.png');
}
```

此時編譯結果就會是成功的了，但這樣子的寫法非常不直覺，且通常我們會一不小心就跟著編輯器的指示一路給他按下去，比如 VSCode 中的 Path Intellisense 套件，最後就會導致錯誤，因為大部分的提示都是基於當前所編輯的檔案所給出的相對路徑提示，並不能指定提示的基準為哪一個檔案，造成種種的麻煩，這時該怎麼辦呢？

之前有說過，Webpack 最大的魅力就在於它會自動解析模組間的相互依賴關係，我們可以利用這一個專長來操作我們的圖片存取路徑。

配置 `webpack.config.js` 檔案中的 `resolve.alias` 選項：

```js
module.exports = {
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, 'src/img'),
    },
  },
};
```

使用 `alias` 指定圖片存取路徑：

```scss
// path：src/scss/component/_navbar.scss

.logo {
  background-image: url('~@img/test.png');
}
```

這邊要注意在 sass-loader 處理的檔案中，必須增加 `~` 前綴以告知此不是相對路徑內容，而是需要 Webpack 去解析的模塊，在 [官方文件](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules) 也有說明，此時讓我們直接編譯看看：

```bash
npm run build
```

編譯結果：

![sass-loader 使用 resolve.alias](https://i.imgur.com/wXVbem1.png)

編譯成功！且圖片存取路徑也正確，從上面範例可以看出，使用 `resolve.alias` 設置別名，不僅可以提高辨識度，且更為方便使用，當然這一個 `resolve.alias` 選項不只可以用來設置在 SCSS 環境，JavaScript 環境也可以，且不需要使用 `~` 前綴，直接定義即可，以下為 ESM 載入模組的範例

```js
module.exports = {
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
};
```

entry 入口處 (`src/main.js`) 引入 SCSS 檔案：

```js
import '@src/scss/all.scss';
```

這邊要注意，`resolve.alias` 的 `key` 值是可以隨意命名的喔！並不是一定要依造上面這樣的寫法，完全依靠個人習慣以及喜好。
