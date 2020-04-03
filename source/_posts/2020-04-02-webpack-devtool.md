---
title: Webpack 前端打包工具 - 依照指定環境挑選適合的 SourceMap 類型
description:
  [
    相比於 Gulp 需使用套件才能生成 SourceMap，Webpack 只需簡單的開啟 devtool 選項即可生成 SourceMap，且提供了多達 10 種以上的類型供開發者使用，簡直太強大。此篇將介紹如何在 Webpack 開啟 devtool 選項用以生成 SourceMap，並說明在各式 SourceMap 類型下，該如何針對 development (開發環境) 與 production (生產環境) 做最合適的挑選。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js]
date: 2020-04-02 14:26:09
updated: 2020-04-03 22:50:32
---

## 前言

相比於 Gulp 需使用套件才能生成 SourceMap，Webpack 只需簡單的開啟 devtool 選項即可生成 SourceMap，且提供了多達 10 種以上的類型供開發者使用，簡直太強大。此篇將介紹如何在 Webpack 開啟 devtool 選項用以生成 SourceMap，並說明在各式 SourceMap 類型下，該如何針對 development (開發環境) 與 production (生產環境) 做最合適的挑選。

## 筆記重點

- 相關套件安裝
- 初始環境建構
- sourcemap 類型差異
- sourcemap 類型結論
- sass-loader 開啟 sourcemap 支援
- postcss-loader 開啟 sourcemap 支持

## 相關套件安裝

過程會使用到的套件：

```bash
npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime clean-webpack-plugin html-webpack-plugin webpack webpack-cli webpack-dev-server -D ; npm install @babel/runtime-corejs3 -P
```

package.json：

```json
{
  "devDependencies": {
    "@babel/core": "^7.9.0",
    "@babel/plugin-transform-runtime": "^7.9.0",
    "@babel/preset-env": "^7.9.0",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^4.0.4",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "@babel/runtime-corejs3": "^7.9.2"
  }
}
```

在 Webpack 中生成 sourcemap 不需要安裝任何套件，配置即可使用，但為了模擬一般開發情境，請先安裝過程所需套件，避免可能造成的疑惑，同時也請安裝 babel-loader 相關套件，主要用來模擬 sourcemap 所謂的**打包後代碼**、**轉換後代碼**、**原始源代碼**情境。

## 初始環境建構

初始專案結構

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── js/
│       │
│       └─── all.js       # JavaScript 主檔案
│   │
│   ├─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
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
    <ul class="list"></ul>
  </body>
</html>
```

至 `./src/js/all.js` 撰寫 JavaScript 範例：

```js
const arr = ['Roya', 'Eric', 'Owen'];
let str = '';
for (const [key, value] of arr.entries()) {
  str += `<li>序位 ${key + 1}，姓名為 ${value}</li>`;
}
console.log(str); // 檢查是否正確
document.querySelector('.list').innerHTML = str;
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
  },
  devServer: {
    port: 9000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
  ],
};
```

entry 入口處 (`src/main.js`) 引入 JavaScript 檔案：

```js
import './js/all';
```

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
  }
}
```

## sourcemap 類型差異

sourcemap 的生成主要依靠 devtool 選項，讓我們先來看官方是如何介紹的：

| devtool                      | 建構速度 | 重新建構速度 | 是否生成 `.map` 檔案 | 品質 (指向)           |
| ---------------------------- | -------- | ------------ | -------------------- | --------------------- |
| false                        | +++      | +++          | no                   | 打包後的代碼          |
| eval                         | +++      | +++          | no                   | 生成後的代碼          |
| cheap-eval-source-map        | +        | ++           | no                   | 轉換過的代碼 (僅限行) |
| cheap-module-eval-source-map | ○        | ++           | no                   | 原始源代碼 (僅限行)   |
| eval-source-map              | --       | +            | no                   | 原始源代碼            |
| cheap-source-map             | +        | ○            | yes                  | 轉換過的代碼 (僅限行) |
| cheap-module-source-map      | ○        | -            | yes                  | 原始源代碼 (僅限行)   |
| source-map                   | --       | --           | yes                  | 原始源代碼            |
| hidden-source-map            | --       | --           | yes                  | 原始源代碼            |
| nosources-source-map         | --       | --           | yes                  | 無原始源代碼內容      |

<div class='note warning'>+++ 非常快速，++ 快速，+，較快，○ 普通，- 偏慢，-- 很慢</div>

當初看到這個圖表，整個人很矇，完全不知道在寫什麼，經過了反覆的測試，發現其實重點可放在每一個 sourcemap 的品質 (指向)，讓我們舉幾個簡單的例子：

將 `devtool` 設為 `false`：

```js
module.exports = {
  devtool: false,
};
```

編譯並查看 console 指向結果：

![將 devtool 設為 false](https://i.imgur.com/3OdWBeO.png)

從上面結果會發現，當我們把 `devtool` 設為 `false` 時，console 的指向為**打包後的代碼**，也就是 `dist/js/main.js` 中，代表不使用任何的 sourcemap 類型，通常不會有人選擇配置此選項，雖然看起來代碼的指向是我們預期的，但它指向的可是打包生成的 `main.js` 檔案阿！**行數肯定是不正確的**，同時也無法追蹤是哪一個原始模組發出提示或警告的問題。

將 `devtool` 設為 `eval`：

```js
module.exports = {
  devtool: 'eval', // production 環境下，此類型為預設值
};
```

編譯並查看 console 指向結果：

![將 devtool 設為 eval](https://i.imgur.com/fPMm0mN.png)

從上面結果可以得知，當我們把 `devtool` 選項設為 `eval` 時，console 的指向為**生成後的代碼**，你會看到一堆類似 `var xxx_WEBPACK_IMPORTED_MODULE_X` 的宣告，**因為它並沒有從 loader 獲取 sourcemap，造成行數顯示錯誤**，此類型不適合我們在 development 環境使用。

將 `devtool` 設為 `cheap-eval-source-map`：

```js
module.exports = {
  devtool: 'cheap-eval-source-map',
};
```

編譯並查看 console 指向結果：

![將 devtool 設為 cheap-eval-source-map](https://i.imgur.com/Y9alATh.png)

從上面結果可以得知，當我們把 `devtool` 選項設為 `cheap-eval-source-map` 時，console 的指向為**轉換過的代碼**，你可以把它想像成已經被 babel-loader 與 corejs 處理過後的代碼，但裡面 `import` 的模組還尚未被解析，類似 Gulp 使用相同套件的編譯結果，此類型同樣不適合我們在 development 環境使用，最好的指向因該是直接呈現我們放在 `src/js/all.js` 的檔案內容才對。

將 `devtool` 設為 `cheap-module-eval-source-map`：

```js
module.exports = {
  devtool: 'cheap-module-eval-source-map',
};
```

編譯並查看 console 指向結果：

![將 dedvtool 設為 cheap-module-eval-source-map](https://i.imgur.com/ApIHjDg.png)

從上面結果可以得知，當我們把 `devtool` 選項設為 `cheap-module-eval-source-map` 時，console 的指向為**原始源代碼**，也就是 `src/js/all.js` 檔案內容，使類型非常適合我們在 development 環境使用，兼具速度與其指向正確性，但這邊要注意的是，**此類型的 sourcemap 選項只包含行的指向，並不包含列的指向**，如果有列指向的需求，可使用 `eval-source-map`。

將 `devtool` 設為 `eval-source-map`：

```js
module.exports = {
  devtool: 'eval-source-map',
};
```

編譯並查看 console 指向結果：

![將 devtool 設為 eval-source-map](https://i.imgur.com/DS7n0Bq.png)

`eval-source-map` 類型與 `cheap-module-eval-source-map` 大同小異，差別在於 `eval-source-map` 連同列也幫我們做了指向，可仔細觀察兩者鼠標的指向，通常我們不太會在意列的指向，畢竟行的指向已經能夠幫我們找出原始資料的位置了，除非你懶得再指向的行找尋目標，那 `eval-source-map` 會很適合你，不過我建議在 development 環境使用 `cheap-module-eval-source-map` 就夠了，清楚的指向原始源資料，速度也不會太差。

## sourcemap 類型結論

當我們在 development 環境選擇 sourcemap 類型時，最先該追求的是指向的正確性，像是 `eval` 與 `cheap-eval-source-map` 類型就較不符合，選擇 `cheap-module-eval-source-map` 與 `eval-source-map` 類型才是王道，其次追求的是重新建構的速度，通常在開發時，我們會反覆的進行測試，這點就顯得極為重要。

- development 環境最佳選擇為 `cheap-module-eval-source-map`

以上介紹的 sourcemap 類型都不會生成實體 `.map` 檔案，也因為這個原因，才使得每一類型速度都不會太差，在 production 環境我們需要有實體的 `.map` 檔案，用以讓開發者在需要 sourcemap 時才進行加載，藉此解決 `bundle.js` 因 sourcemap 附加在檔案內造成體積過大的問題，這邊我不推薦任何有關 `inline` 的 sourcemap 類型，原理如同 url-loader 額度設定太高一樣。

- production 環境推薦可使用 `source-map`、`hidden-source-map`、`nosources-source-map`

---

備註：

- 在 Webpack 4 中，development 環境預設 sourcemap 類型為 `eval`
- 在 Webpack 4 中，production 環境預設 sourcemap 類型為 `false`

## sass-loader 開啟 sourcemap 支援

在前面我們都是針對 JavaScript 開啟 sourcemap 支援，想必大家更為好奇的應該是如何開啟 Sass/SCSS 的 sourcemap 支援吧？開啟方式相當的簡單，讓我們先將專案結構更改如下：

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── scss/
│       │
│       └─── component
│           │
│           └─── _card.scss
│       │
│       └─── all.scss     # SCSS 主檔案
│   │
│   ├─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

安裝 sass-loader、css-loader、style-loader 相關套件：

```bash
npm install sass-loader node-sass css-loader style-loader -D
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: false,
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
  },
  devServer: {
    port: 9000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
  ],
};
```

sass-loader 搭配 style-loader 開啟 sourceMap 相對簡單，只需要開啟除了 style-loader 以外的 `sourcecMap` 選項即可，這邊要注意的是，sass-loader 搭配 style-loader 是不受 `devtool` 選項控制的，如果你將 `devtool` 設為 `false`，一樣也能生成 sourcemap，結果如下：

![sass-loader 搭配 style-loader 開啟 sourcemap 支持](https://i.imgur.com/s7MjSkR.png)

接下來換 sass-loader 搭配 mini-css-extract-plugin，請先安裝套件：

```bash
npm install mini-css-extract-plugin -D
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: 'source-map', // 只有此類型的 sourcemap 完全支援
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
  },
  devServer: {
    port: 9000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
  ],
};
```

sass-loader 搭配 mini-css-extract-plugin 同樣開啟除了 mini-css-extract-plugin 的 `sourceMap` 選項即可支持 sourcemap，但與 style-loader 不同的地方在於，mini-css-extract-plugin 會受到 `devtool` 選項影響生成，在這邊必須選擇 `source-map` 類型才能正確生成 sourcemap，效果如下：

![sass-loader 搭配 style-loader 開啟 sourcemap 支持](https://i.imgur.com/s7MjSkR.png)

## postcss-loader 開啟 sourcemap 支持

如果你的專案有導入 PostCSS，一樣開啟 `sourceMap` 選項即可獲得 sourcemap 支持，配置如下：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
  },
  devServer: {
    port: 9000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
  ],
};
```
