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
