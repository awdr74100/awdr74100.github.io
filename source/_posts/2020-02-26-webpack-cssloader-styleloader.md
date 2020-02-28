---
title: Webpack 前端打包工具 - 使用 css-loader 與 style-loader 處理樣式表
description:
  [
    上次在介紹 Webpack 時有稍微提到 Loader 究竟是做什麼用，簡單來講，Webpack 本身只能處理 JavaScript 模組，如果要處理其他類型的文件，就需要使用相關的 Loader 進行轉換。Loader 可以理解為模組和資源的轉換器，它本身是一個 function，接受源文件作為參數傳遞，最後返回轉換後的結果。這次讓我們從最基本的打包 CSS 開始講解，利用 css-loader 抽取源文件相關的 CSS 檔進行轉換，並利用 css-loader 的好搭檔 style-loader 將轉換後的 CSS 附加到 style 標籤已進行存取。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-02-26 19:17:58
updated: 2020-02-28 02:12:58
---

## 前言

上次在介紹 Webpack 時有稍微提到 Loader 究竟是做什麼用，簡單來講，Webpack 本身只能處理 JavaScript 模組，如果要處理其他類型的文件，就需要使用相關的 Loader 進行轉換。Loader 可以理解為模組和資源的轉換器，它本身是一個 function，接受源文件作為參數傳遞，最後返回轉換後的結果。這次讓我們從最基本的打包 CSS 開始講解，利用 css-loader 抽取源文件相關的 CSS 檔進行轉換，並利用 css-loader 的好搭檔 style-loader 將轉換後的 CSS 附加到 style 標籤已進行存取。

## 筆記重點

- css-loader 與 style-loader 安裝
- css-loader 與 style-loader 基本使用
- css-loader 與 style-loader 可傳遞選項
- 補充：loader 屬性的簡寫方式
- 補充：獨立 CSS 與 非獨立 CSS 差別

## css-loader 與 style-loader 安裝

> 套件連結：[css-loader](https://github.com/webpack-contrib/css-loader)、[style-loader](https://github.com/webpack-contrib/style-loader)

css-loader：

```bash
$ npm install css-loader -D
```

style-loader：

```bash
$ npm install style-loader -D
```

這邊要注意的是 css-loader 只是單純將 entry 內相關的 CSS 檔案抽取出來做轉換，最後必須透過 style-loader 將 CSS 注入到 HTML 的 `<style>` 標籤上，已進行存取，也就代表使用 style-loader 會以 HTML 標籤的形式完成存取，並不是以單獨的 CSS 檔案做引用完成存取，這邊需要特別注意！之後也會介紹如何透過 pluign 的方式，單獨把 CSS 抽取成獨立的檔案，這次就先從 css-loader 與 style-loader 開始做介紹。

## css-loader 與 style-loader 基本使用

初始專案結構：

```plain
webpack-demo/
|
| - node_modules/
|
| - src/
|   | - css/
|       | - all.css     # CSS 主檔案
|
|   | - main.js         # entry 入口檔案
|
| - index.html          # 引入 bundle.js 測試用檔案
| - webpack.config.js   # Webpack 配置檔案
| - package-lock.json
| - package.json        # 已安裝 webpack、webpack-cli、css-loader、style-loader
```

撰寫 CSS 範例：

```css
.text-primary {
  color: rgb(37, 37, 177);
}
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

配置 loader 其實很簡單，先前已經有介紹過 **entry** 與 **output** 選項，這次來介紹另一個也很重要的屬性，也就是 module 屬性，用以配置 loader 的處理方式：

- **module**：配置選項決定如何處理[不同類型的模組](https://webpack.docschina.org/concepts/modules)
  - **rules**：創建模組時，匹配請求的規則數組
    - **test**：查找符合 Regex (正規表達式) 副檔名的模組，如符合即使用 use 內指定的 loader
    - **use**：定義需加載的 loader，可接受字串陣列或物件陣列傳遞。加載是由右到左依序作用

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
$ npm run build
```

至 `./index.html` 引入打包而成的 `bundle.js` 檔案：

```html
<!-- 其他省略 -->
<body>
  <h1 class="text-primary">Hello World</h1>
  <script src="dist/bundle.js"></script>
</body>
```

查看結果：

![css-loader 與 style-loader 編譯結果](https://i.imgur.com/lKbi2wh.png)

觀察上面結果可以得知，我們只是單獨的引入 bundle.js 這一個檔案，並沒有引入任何的 CSS 檔案，卻能夠讀取的相關的 CSS 樣式，這一切都是 style-loader 的功勞，他能夠將 css-loader 解析過後的 CSS 以 `<style></style>` 標籤方式插入到 `<head></head>` 內，此時也就完成了打包的目的。

## css-loader 與 style-loader 可傳遞選項

可參考 [css-loader Options](https://github.com/webpack-contrib/css-loader#options) 可傳遞參數列表，以下為常用的參數配置：

- modules：`true` | `false`
  啟用/禁用 CSS 模組及其配置，默認為 `false`

範例：

```js
module.exports = {
  // 其他省略
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, // 啟用 CSS 模組功能
            },
          },
        ],
      },
    ],
  },
};
```

---

可參考 [style-loader Options](https://github.com/webpack-contrib/style-loader#options) 可傳遞參數列表，以下為常用的參數配置：

- injectType：`styleTag` | `singletonStyleTag` | `lazyStyleTag` | `lazySingletonStyleTag` | `linkTag`
  設置 CSS 注入 DOM 的方式，默認為 `styleTag`

- attributes：`Object`
  附加在 `<style>` / `<link>` 標籤上的屬性及其值，莫認為 `{}`

範例：

```js
module.exports = {
  // 其他省略
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag', // 多個 CSS 合併為單一個 style 標籤
              attributes: {
                id: 'allCSS', // 附加 id 屬性並定義其值為 "allCSS"
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

## 補充：loader 屬性的簡寫方式

在上面配置 loader 的教學中，我們都是字串陣列的方式取用 loader，如下所示：

```js
module.exports = {
  // 其他省略
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

事實上，上面的寫法就等同於以下寫法：

```js
module.exports = {
  // 其他省略
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};
```

通常物件陣列的寫法只會出現在有可傳遞選項時，如下範例：

```js
module.exports = {
  // 其他省略
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
};
```

在我們配置 loader 時，通常都是直接複製官方文檔中的範例在進行修改，既不會出錯也較為方便，並沒有說哪一種配置 loader 的寫法較好，完全是看個人的習慣以及喜好。

## 補充：獨立 CSS 與 非獨立 CSS 差別

當我們使用 style-loader 時，即代表是使用非獨立 CSS 的方式完成取用，但這有違一般開發的習慣，我們通常都是將 JavaScript、CSS 獨立抽取成單獨的檔案，並且利用 `<script>`、`<link>` 來引入檔案，我不能說單獨把 CSS 抽取成獨立檔案絕對是對的，以下是我對兩種方式的看法：

|       獨立 CSS - `<link>` 引用       | 沒有獨立 CSS - `<style>` 撰寫 |
| :----------------------------------: | :---------------------------: |
| 減少 style 標籤 (舊版本的 IE 有限制) |     減少額外的 HTTP 請求      |
|        獨立 CSS 較為方便修改         |      減少多餘的 CSS 檔案      |
|  CSS 與 JS 並行加載，將提高載入速度  |   組件化更加乾淨的專案架構    |
|            瀏覽器緩存機制            |              無               |

針對以上兩種取用方法，Webpack 都有提供各自的套件，比如說 `<style>` 取用就是使用本文章所介紹的 [style-loader](https://github.com/webpack-contrib/style-loader)，而 `<link>` 引用則是使用 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)，關於 mini-css-extract-plugin 的使用方式將會在下一篇文章獨立做介紹，歡迎有興趣的人前去觀看。
