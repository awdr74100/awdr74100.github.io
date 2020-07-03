---
title: Webpack 前端打包工具 - 使用 optimize-css-assets-webpack-plugin 壓縮 CSS
description:
  [
    之前我們有提到如何使用 html-webpack-plugin 內建的 minify 選項壓縮 HTML，而 JavaScript 則是依靠 Webpack 本身內建的 TerserWebpackPlugin 進行壓縮，唯獨少了 CSS 的方法，這次就來介紹如何使用 optimize-css-assets-webpack-plugin 壓縮我們的 CSS，其內部預設是使用 cssnano 作為編譯器，cssnano 是建立在 PostCSS 生態系統上的工具，代表我們也可使用 postcss-loader 搭配 cssnano 來達到同樣的目的及效果，如果專案本身已導入 PostCSS，建議直接搭配 cssnano 可更快的完成壓縮目的。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-07-02 20:38:26
updated: 2020-07-03 00:12:53
---

## 前言

之前我們有提到如何使用 html-webpack-plugin 內建的 minify 選項壓縮 HTML，而 JavaScript 則是依靠 Webpack 本身內建的 TerserWebpackPlugin 進行壓縮，唯獨少了 CSS 的方法，這次就來介紹如何使用 optimize-css-assets-webpack-plugin 壓縮我們的 CSS，其內部預設是使用 cssnano 作為編譯器，cssnano 是建立在 PostCSS 生態系統上的工具，代表我們也可使用 postcss-loader 搭配 cssnano 來達到同樣的目的及效果，如果專案本身已導入 PostCSS，建議直接搭配 cssnano 可更快的完成壓縮目的。

## 筆記重點

- optimize-css-assets-webpack-plugin 安裝
- optimize-css-assets-webpack-plugin 基本使用
- optimize-css-assets-webpack-plugin 可傳遞選項
- 補充：搭配 mini-css-extract-plugin 生成 source-map 失敗
- 補充：使用 postcss-loader 搭配 cssnano 進行壓縮

## optimize-css-assets-webpack-plugin 安裝

> 套件連結：[optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

主要的套件：

```bash
npm install optimize-css-assets-webpack-plugin -D
```

過程會使用到的套件：

```bash
npm install css-loader mini-css-extract-plugin -D
```

package.json：

```json
{
  "devDependencies": {
    "css-loader": "^3.6.0",
    "mini-css-extract-plugin": "^0.9.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  }
}
```

optimize-css-assets-webpack-plugin 只是用來將 CSS 給進行壓縮，實際處理 CSS 的動作還是得交由 css-loader 和 mini-css-extract-plugin 來完成，這邊你不需要下載 cssnano，此為 optimize-css-assets-webpack-plugin 的相依套件，為了保證壓縮如預期進行，官方已經幫我們包裝好了。

## optimize-css-assets-webpack-plugin 基本使用

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
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

撰寫 CSS 範例：

```css
.text-primary {
  color: blue;
}

.text-danger {
  color: red;
}
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 載入 optimize-css-assets-webpack-plugin (第一步)
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
    // 創建實例 (第二步)
    new OptimizeCssAssetsPlugin({
      // 傳入編譯器可傳遞選項 (可選)
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }),
  ],
};
```

optimize-css-assets-webpack-plugin 預設的編譯器為 cssnano，如果你想針對這一個編譯器傳入選項，這邊可使用 `cssProcessorPluginOptions` 屬性，方法就如同你在 `postcss.config.js` 內設置的那樣，記得格式不要寫錯，單純修改 `preset` 可採 `String` 的形式，如果想將選項傳遞進去，則須修改為 `Array` 的形式，詳細可參考 [cssnano](https://cssnano.co/guides/presets) 的說明。

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

檢查 `./dist/css/all.css` 是否成功被壓縮：

<!-- prettier-ignore-start -->
```css
.text-primary{color:#00f}.text-danger{color:red}
```
<!-- prettier-ignore-end -->

大公告成！目前我們壓縮的配置都是參照 cssnano 中的 `default` 模式，另外還有 `advanced` 模式可做使用，這點將在下方 postcss-loader 結合 cssnano 的章節共同做介紹。

## optimize-css-assets-webpack-plugin 可傳遞選項

可參考 [optimize-css-assets-webpack-plugin Options](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin#configuration) 可傳遞參數列表，以下為常用的參數配置：

- assetNameRegExp：`RegExp`
  指示應壓縮的資源，默認為 `/\.css$/g`

- cssProcessor：`Compiler`
  用於處理壓縮的編譯器，默認為 `cssnano`

- cssProcessorOptions：`Object`
  將選項傳遞給 cssProcessor 的接口，默認為 `{}`

- cssProcessorPluginOptions：`Object`
  將選項傳遞給 cssProcessor 中 plugin 的接口，默認為 `{}`

說實在的，我不太能理解作者可傳遞選項的命名方式，這邊的 `cssProcessorOptions` 應該是要指 `cssProcessor` 的可傳遞選項才對，結果卻是傳入不包含 `plugins` 的 PostCSS 選項，詳細可參考 PostCSS 中的 [options](https://github.com/postcss/postcss#options)，直接來看範例：

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: true,
        },
      },
      cssProcessorPluginOptions: {
        preset: 'default',
      },
    }),
  ],
};
```

## 補充：搭配 mini-css-extract-plugin 生成 source-map 失敗

這套件有個詭異的地方在於使用 optimize-css-assets-webpack-plugin 搭配 mini-css-extract-plugin 會導致 source-map 生成失敗，先讓我們來模擬下情境：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  devtool: 'source-map', // 選擇生成實體 .map 文件
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
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
    new OptimizeCssAssetsPlugin(),
  ],
};
```

關於 source-map 的使用可參考我之前寫過的 [文章](https://awdr74100.github.io/2020-04-02-webpack-devtool/)，接著進行編譯：

```bash
npm run build
```

編譯結果：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── css/
│       │
│       └─── main.css
│   │
│   └─── js/
│       │
│       ├─── main.js
│       └─── main.js.map
```

發現特別的地方了嗎？我們的 CSS 並沒有成功生成 `.map` 檔案，自然也就沒有 source-map 的效果，如果你把 optimize-css-assets-webpack-plugin 給拿掉，source-map 就生出來了，這很明顯是這個套件的問題，但也不用太過於擔心，這個問題不是只有我們遇到，且 GitHub 已經有人給出答案了，詳細可參考 [Issues](https://github.com/NMFR/optimize-css-assets-webpack-plugin/issues/53)，這邊需要使用到前面提到了 `cssProcessorOptions` 選項，參考以下範例：

```js
module.exports = {
  plugins: [
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: true,
        },
      },
    }),
  ],
};
```

將 `inline` 設為 `false` 的用意是避免生成內聯映射，這樣就能正確生成 `.map` 文件了，以及將 `annotation` 設為 true 用以向 `.css` 文件添加 source-map 的路徑註釋，讓我們在編譯一次：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── css/
│       │
│       ├─── main.css
│       └─── main.css.map
│   │
│   └─── js/
│       │
│       ├─── main.js
│       └─── main.js.map
```

這次 CSS 的 source-map 就成功生成了，以上是在將 `devtool` 設為 `source-map` 時才需要這樣做，在 development 環境推薦使用的 `cheap-module-eval-source-map` 則有不同的做法，參考以下：

```js
module.exports = {
  plugins: [
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: true,
        },
      },
    }),
  ],
};
```

`cheap-module-eval-source-map` 為內聯模式，代表我們須將 `inline` 設為 `true`，這時你可能就有疑問了，`true` 不是默認選項嗎？我們還需要設置？答案是沒錯，[官方文檔](https://github.com/postcss/postcss/blob/master/docs/source-maps.md#options) 有提到如果以前的 source-map 類型為外部地圖，而不是內聯地圖，則即使你未設置 `inline` 選項，PostCSS 也不會嵌入地圖，你可以把它理解為使用 mini-css-extract-plugin 生成實體 CSS 檔案，就是必須告訴她 `inline` 要為 `true`，不然會導致失敗，如果你使用的是 style-loader，就都沒這些問題，因為 style-loader 始終都為內聯地圖，並不會有 `.css` 實體檔案的產生。

## 使用 postcss-loader 搭配 cssnano 進行壓縮

如果當前專案本身就已經導入 PostCSS，那我推薦你直接使用 cssnano 來完成壓縮，過程也不會像 optimize-css-assets-webpack-plugin 這麼多陷阱，請先將 postcss-loader 與 cssnano 安裝進來：

```bash
npm install postcss-loader cssnano -D
```

cssnano 為 optimize-css-assets-webpack-plugin 的相依套件，這邊可以先檢查 `node_modules` 是否存在這個套件，或者直接將其覆蓋也是可以，接著將 postcss-loader 給配置進來：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: 'source-map',
  mode: process.env.NODE_ENV,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          // 新增 postcss-loader
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
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

這邊我們可把與 optimize-css-assets-webpack-plugin 相關的代碼都給拿掉，我們不需要它了，我個人是偏好在獨立的 `postcss.config.js` 檔案內撰寫 PostCSS 設定，你也可以在 postcss-loader 中的 `options` 下進行撰寫，隨看個人喜好，參考以下：

在 `./` 根目錄新增名為 `postcss.config.js` 的檔案：

```diff
 webpack-demo/
 │
+└─── postcss.config.js
```

將相關 plugin 載入進來：

```js
module.exports = {
  plugins: [require('cssnano')],
};
```

有關 plugin 的傳遞選項可由後方帶入：

```js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', { discardComments: { removeAll: true } }],
    }),
  ],
};
```

如果你配置過 autoprefixer，那你應該對上面過程很熟悉才對，兩者都屬於 PostCSS 中的 Plugin，配置方法自然也就都差不多，接著直接進行編譯：

```bash
npm run build
```

檢查是否成功壓縮：

<!-- prettier-ignore-start -->
```css
.text-primary{color:#00f}.text-danger{color:red;display:flex}
```
<!-- prettier-ignore-end -->

檢查是否成功生成 `.map` 文件：

```plain
webpack-demo/
│
├─── dist/
│   │
│   └─── css/
│       │
│       ├─── main.css
│       └─── main.css.map
│   │
│   └─── js/
│       │
│       ├─── main.js
│       └─── main.js.map
```

這不就與使用 optimize-css-assets-webpack-plugin 的結果一樣嗎？且我們不需要去操心 `inline` 之類的選項，過程簡單許多，這邊補充之前提到的 `advanced` 模式：

安裝高級優化組件：

```bash
npm install cssnano-preset-advanced
```

更改 cssnano 中的 `preset` 選項：

```js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: 'advanced',
    }),
  ],
};
```

關於 `default` 與 `advanced` 的差異，詳細可參考 [這邊](https://cssnano.co/optimisations/)，簡單來講就是啟用更深層的優化，但可能會有更改原始代碼的情況發生。請斟酌使用。
