---
title: Webpack 前端打包工具 - 使用 image-webpack-loader 壓縮圖片
description:
  [
    在 Gulp 可使用 gulp-imagemin 套件來壓縮 PNG、JPG 等類型圖片，想當然的在 Webpack 也有類似的套件可使用，名為 image-webpack-loader，一樣都是基於 imagemin 所設計，兩者在使用上幾乎沒有差別，一般人可能聽過的是 imagemin-webpack-plugin，這是屬於 Plugin 類型的套件，代表是在生成資源時才進行壓縮，無法像 image-webpack-loader 一樣後續再交由 url-loader 進行處理，我自己是比較喜歡 image-webpack-loader 就是了。此篇將介紹如何使用 image-webpack-loader 壓縮各種類型的圖片。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-07-24 00:13:27
updated: 2020-07-25 00:01:39
---

## 前言

在 Gulp 可使用 gulp-imagemin 套件來壓縮 PNG、JPG 等類型圖片，想當然的在 Webpack 也有類似的套件可使用，名為 image-webpack-loader，一樣都是基於 imagemin 所設計，兩者在使用上幾乎沒有差別，一般人可能聽過的是 imagemin-webpack-plugin，這是屬於 Plugin 類型的套件，代表是在生成資源時才進行壓縮，無法像 image-webpack-loader 一樣後續再交由 url-loader 進行處理，我自己是比較喜歡 image-webpack-loader 就是了。此篇將介紹如何使用 image-webpack-loader 壓縮各種類型的圖片。

## 筆記重點

- image-webpack-loader 安裝
- image-webpack-loader 基本使用
- image-webpack-loader 可傳遞選項

## image-webpack-loader 安裝

> 套件連結：[image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

主要的套件：

```bash
npm install image-webpack-loader -D
```

過程會使用到的套件：

```bash
npm install file-loader url-loader css-loader mini-css-extract-plugin html-webpack-plugin cross-env -D
```

package.json：

```json
{
  "devDependencies": {
    "cross-env": "^7.0.2",
    "css-loader": "^3.6.0",
    "file-loader": "^6.0.0",
    "html-webpack-plugin": "^4.3.0",
    "image-webpack-loader": "^6.0.0",
    "mini-css-extract-plugin": "^0.9.0",
    "url-loader": "^4.1.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  }
}
```

image-webpack-loader 只是負責將圖片給壓縮，實際上搬運圖片的這個動作還是得交由 file-loader 進行，當圖片壓縮後到達了一定大小，我們可改交由 url-loader 將其轉換為 Base64 型態，為了模擬實際開發上的情境，請將上面列出的套件都進行安裝。

## image-webpack-loader 基本使用

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
│   └─── img/
│       │
│       └─── self.jpg     # JPG 圖檔
│   │
│   ├─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

撰寫 CSS 範例：

```css
.image {
  width: 400px;
  height: 400px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('~@/self.jpg');
}
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
    <div class="image"></div>
  </body>
</html>
```

這邊我們採用 CSS 的方式來載入圖片，這樣就不用在 entry 入口處另外載入圖片了。

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/img'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[ext]',
            },
          },
          // 配置 image-webpack-loader (第一步)
          {
            loader: 'image-webpack-loader',
            options: {
              // 只在 production 環境啟用壓縮 (第二步)
              disable: process.env.NODE_ENV === 'production' ? false : true,
            },
          },
        ],
      },
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
```

壓縮圖片非常消耗時間，這邊我們選擇在 `production` 環境才啟用壓縮，`development` 環境則是不啟用壓縮，image-webpack-loader 本身支援 PNG、JPEG、GIF、SVG 和 WebP 圖片壓縮，算是支援大部分圖片類型了，這邊我們就先採預設的壓縮設定，下面會在介紹如何針對各類型圖片客製壓縮設定。

entry 入口處 (`src/main.js`) 引入 CSS 檔案：

```js
import './css/all.css'; // 使用 ESM 方式引入
```

至 `package.json` 新增編譯指令：

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

這邊我們使用到了 cross-env 套件來解決設置 `NODE_ENV` 環境變數在跨平台可能會產生的問題。

執行編譯指令：

```bash
npm run build
```

檢查圖片是否正確被載入：

![檢查圖片是否正確被載入](https://i.imgur.com/hkApN1r.png)

由於我們設定了 `publicPath` 為根目錄，如果單純打開 `./dist/index.html` 會沒辦法顯示網頁，這邊可以隨便開啟一個 `localhost` 用以模擬伺服器環境，或者使用 webpack-dev-server 來協助開發，接著來看這張圖片是否有被成功壓縮。

原圖：

![原圖](https://i.imgur.com/X7gOnEd.png)

經過壓縮：

![經過壓縮](https://i.imgur.com/uTORkdR.png)

可以發現壓縮後的圖檔幾乎看不出有任何失真的狀況，而圖檔大小卻整整縮小了 50% 之多，從原有的 153.1KB 縮減為 65.9KB，可以說是相當的有感，以後就再也不需要去使用是 [tinypng](https://tinypng.com/) 等類似的服務囉。

## image-webpack-loader 可傳遞選項

image-webpack-loader 除了基本的 `disable` 與舊版 Webpack 才需使用的 `bypassOnDebug` 選項外，其餘可傳遞選項均為各類型圖片的優化器，可參考以下：

- [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg)：JPEG 圖片優化器
- [optipng](https://github.com/imagemin/imagemin-optipng)：PNG 圖片優化器
- [pngquant](https://github.com/imagemin/imagemin-pngquant)：PNG 圖片優化器 (推薦)
- [svgo](https://github.com/imagemin/imagemin-svgo)：SVG 圖片優化器
- [gifsicle](https://github.com/imagemin/imagemin-gifsicle)：GIF 圖片優化器
- [webp](https://github.com/imagemin/imagemin-webp)：WebP 圖片優化器 (預設不啟用)

所有圖片優化器均為 image-webpack-loader 的相依套件，代表無須進行任何下載，配置即可使用，關於配置的方法可參考以下範例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          // url-loader...
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV === 'production' ? false : true,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false, // 表示不啟用這一個圖片優化器
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75, // 配置選項表示啟用 WebP 優化器
              },
            },
          },
        ],
      },
    ],
  },
};
```
