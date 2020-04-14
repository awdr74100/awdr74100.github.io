---
title: Webpack 前端打包工具 - 使用 vue-loader 手動建置出 Vue CLI 環境
description:
  [
    從 Vue CLI v3 開始引入了 webpack-chain 套件，同時針對配置進行了高度抽象化，我們不能以先前配置 Webpack 的方式進行撰寫，而是必須閱讀官方文件配置在專屬的 vue.config.js 檔案內才能起作用，是不是覺得這樣太麻煩了？不如我們依照自己習慣手動建置一個 Vue CLI 環境吧！此篇將介紹如何使用 vue-loader 並搭配先前所介紹的 loader 與 plugin 手動建置出 Vue CLI 的環境。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, Vue.js, w3HexSchool]
date: 2020-04-13 00:01:10
updated: 2020-04-13 00:01:10
---

## 前言

從 Vue CLI v3 開始引入了 webpack-chain 套件，同時針對配置進行了高度抽象化，我們不能以先前配置 Webpack 的方式進行撰寫，而是必須閱讀官方文件配置在專屬的 vue.config.js 檔案內才能起作用，是不是覺得這樣太麻煩了？不如我們依照自己習慣手動建置一個 Vue CLI 環境吧！此篇將介紹如何使用 vue-loader 並搭配先前所介紹的 loader 與 plugin 手動建置出 Vue CLI 的環境。

## 筆記重點

- vue-loader 安裝
- vue-loader 基本使用

## vue-loader 安裝

> 套件連結：[vue-loader](https://vue-loader.vuejs.org/guide/#vue-cli)、[vue](https://vuejs.org/v2/guide/installation.html)

主要的套件：

```bash
npm install vue-loader vue-template-compiler -D ; npm install vue -P
```

過程會使用到的套件：

```bash
npm install webpack webpack-cli webpack-merge  webpack-dev-server url-loader file-loader html-webpack-plugin clean-webpack-plugin babel-loader @babel/core @babel/preset-env core-js sass-loader node-sass postcss-loader autoprefixer css-loader style-loader mini-css-extract-plugin -D
```

package.json：

```json
{
  "devDependencies": {
    "@babel/core": "^7.9.0",
    "@babel/preset-env": "^7.9.5",
    "autoprefixer": "^9.7.6",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "core-js": "^3.6.5",
    "css-loader": "^3.5.2",
    "file-loader": "^6.0.0",
    "html-webpack-plugin": "^4.2.0",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.13.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^8.0.2",
    "style-loader": "^1.1.3",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.1",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3",
    "webpack-merge": "^4.2.2"
  },
  "dependencies": {
    "vue": "^2.6.11"
  }
}
```

當你安裝 vue-loader 的同時，也請記得安裝 vue-template-compiler，vue-loader 主要得依靠其套件進行編譯 `.vue` 檔的動作，最後當然少不了我們的 vue 主套件，同樣也須進行安裝。

> 每當 vue 有新版本發布時，一個相對應的 vue-template-compiler 也會隨之發布。兩者的版本必須保持同步，這樣 vue-loader 才能正常生成兼容 runtime 的代碼。這意味著你每次升級專案中的 vue 時，也必須同時升級 vue-template-compiler。

## vue-loader 基本使用

初始專案結構：

```plain
webpack-demo/
│
├─── build/
│   │
│   ├─── webpack.base.conf.js     # Webpack 共用配置檔 (等待合併)
│   ├─── webpack.dev.conf.js      # 開發環境配置檔
│   └─── webpack.prod.conf.js     # 生產環境配置檔
│
├─── node_modules/
├─── public/
│   │
│   ├─── favicon.ico
│   └─── index.html               # HTML 主檔案
│
├─── src/
│   │
│   └─── assets/
│       │
│       └─── img/
│           │
│           └─── test.jpg         # 測試 file-loader 是否成功解析
│       │
│       └─── scss/
│           │
│           └─── all.scss         # SCSS 主檔案
│
│   │
│   ├─── App.vue                  # Vue 主檔案
│   └─── main.js                  # entry 入口檔案
│
├─── .browserslistrc
├─── babel.config.js
├─── postcss.config.js
├─── package-lock.json
└─── package.json
```

配置 `build/webpack.base.conf.js` 檔案：

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.vue', '.mjs', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@img': path.resolve(__dirname, '../src/assets/img'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico',
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
          enforce: true,
        },
        default: false,
      },
    },
  },
};
```

在 `webpack.base.conf.js` 的配置中，我們做了以下事情：

- 配置 [babel-loader]() 編譯並轉換 ES6+ 代碼，node_modules 內的套件除外
- 配置 [url-loader]() 將上限內的資源轉換為 Base64 編碼，超過上限的資源 fallback 給 [file-loader]() 處理
- 配置 [clean-webpack-plugin]() 在每次編譯前刪除 `output.path` 的檔案，以保證編譯結果為最新
- 配置 [html-webpack-plugin]() 將指定的本地模板自動引入相關資源並生成到 `output.path` 位置
- 配置 [SplitChunksPlugin]() 將 node_modules 內的套件抽離成獨立檔案
- 配置 [runtimeChunk]() 將 Webpack 運行時代碼抽離成獨立檔案
- 配置 vue-loader 提取單文件組件 ([SFCs](https://vue-loader.vuejs.org/zh/spec.html)) 的每個語言塊，並透過相關 loader 做對應的處理，最後將他們組裝成一個 ES Module

這邊唯一沒有介紹過的就屬 vue-loader 了，讓我們額外針對它做介紹：

```js
// 載入 vue-loader/lib/plugin (第一步)
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  module: {
    rules: [
      // 配置 vue-loader (第二步)
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [
    // 創建實例 (第三步)
    new VueLoaderPlugin(),
  ],
};
```

vue-loader 與其他 loader 或 plugin 的配置方式相比大同小異，主要就是增加一個 rules 用以處理 `.vue` 檔，vue-loader 會將每一個語言塊提取出來並送至相關的 loader 去做處理，比如說 `<style>`、`<templete>` 等，也就是說，除了配置 vue-loader 以外，也須配置像是 css-loader 或 babel-loader 用以處理需解析的模塊。

這邊還有一點要注意的是，由於 vue-loader 本身就以搭配 vue-template-compiler 用做解析 `<templete>` 模塊，所以我們不必將整個 vue 包引入進來，而是選擇只包含運行時的構建版本即可，如下所示：

```js
module.exports = {
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js', // 相比於 vue.esm.js 小 30% 左右
    },
  },
};
```

這邊做一個補充，vue-loader 主要是透過 `compiler` 這個可傳遞選項引入 vue-template-compiler 用做編譯器，如下所示：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compiler: require('vue-template-compiler'), // 此為預設值
        },
      },
    ],
  },
};
```

配置 `webpack.dev.conf.js` 檔案：

```js
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 9000,
    open: true,
    clientLogLevel: 'warn',
    compress: true,
    overlay: true,
    stats: 'errors-only',
    hot: true,
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
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
});
```

在 `webpack.dev.conf.js` 的配置中，我們做了以下事情：

- 配置 [sass-loader]() 編譯並轉換 Sass/SCSS 預處理器代碼
- 配置 [postcss-loader]() 搭配 autoprefixer 自動為 CSS 增加 Prefix
- 配置 [css-loader]() 將 