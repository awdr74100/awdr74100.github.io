---
title: Webpack 前端打包工具 - 使用 sass-loader 編譯 Sass/SCSS
description:
  [
    以我自己來說，已經很少用純 CSS 來撰寫樣式表了，大多時候都是直接使用 SCSS 作為開發語言，既方便又高效，雖然說得透過編譯器使之編譯成 CSS 檔案才能在瀏覽器運行，但這一切對於現代化開發來講，似乎已經不成問題了。此篇將介紹如何使用 sass-loader 編譯我們的 Sass/SCSS 預處理器，並說明途中可能會遇到的陷阱。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, SCSS]
date: 2020-03-04 15:25:06
updated: 2020-03-04 15:25:06
---

## 前言

以我自己來說，已經很少用純 CSS 來撰寫樣式表了，大多時候都是直接使用 SCSS 作為開發語言，既方便又高效，雖然說得透過編譯器使之編譯成 CSS 檔案才能在瀏覽器運行，但這一切對於現代化開發來講，似乎已經不成問題了。此篇將介紹如何使用 sass-loader 編譯我們的 Sass/SCSS 預處理器，並說明途中可能會遇到的陷阱。

## 筆記重點

- sass-loader 安裝
- sass-loader 基本使用
- sass-loader 可傳遞選項
- 補充：Dart Sass 與 Node Sass

## sass-loader 安裝

> 套件連結：[sass-loader](https://github.com/webpack-contrib/sass-loader)、[css-loader](https://github.com/webpack-contrib/css-loader)、[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

sass-loader：

```bash
$ npm install sass-loader node-sass -D
```

require：

```bash
$ npm install css-loader mini-css-extract-plugin -D
```

請注意！安裝 sass-loader 並不像 gulp-sass 會將依賴的 node-sass 也一起安裝，也就是說 sass-loader 與 node-sass 都需要進行安裝。以及 sass-loader 只負責編譯 Sass/SCSS 部分，最後還是得依靠 css-loader 與 mini-css-extract-plugin 生成獨立的檔案，通通給他安裝下去就對了！

## sass-loader 基本使用

<div class="note warning">此次範例會搭配 css-loader 與 mini-css-extract-plugin 一起使用，相關文章連結：<a href="https://awdr74100.github.io/2020-02-26-webpack-cssloader-styleloader/" target="_blank">css-loader</a>、<a href="https://awdr74100.github.io/2020-03-02-webpack-minicssextractplugin/" target="_blank">mini-css-extract-plugin</a></div>

初始專案結構：

```plain
webpack-demo/
|
| - node_modules/
|
| - src/
|   | - scss/
|       | - all.scss    # SCSS 主檔案
|
|   | - main.js         # entry 入口檔案
|
| - index.html          # 引入 bundle.js 與 main.css 測試用檔案
| - webpack.config.js   # Webpack 配置檔案
| - package-lock.json
| - package.json        # 已安裝 webpack、webpack-cli、css-loader、mini-css-extract-plugin、sass-loader、node-sass
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

entry 入口處 (`src/main.js`) 引入 CSS 檔案：

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
$ npm run build
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
$ npm install node-sass -D
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
$ npm install sass -D
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
