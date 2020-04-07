---
title: Webpack 前端打包工具 - 使用 SplitChunksPlugin 抽離公用模組
description:
  [
    一般在做各種開發時，我們很常引入一些 npm 套件加快功能的實現，比如說 AJAX 行為就很適合使用 axios 套件來完成，當我們使用 Webpack 進行打包時，相關的 npm 套件也會通通被打包進 bundle.js 內，但這樣的行為對效能來說是較不友善的，原因為 bundle.js 實在是太肥大了，正確的作法應該是將 node_modules 內的模組單獨打包成一個檔案，避免載入時間過長的問題。此篇將介紹如何使用 SplitChunksPlugin 抽離 node_modules 內模組使之成為獨立的檔案，後面也會介紹當我們在開發多頁式應用時，如何以 SplitChunksPlugin 抽離公用模組用以解決重複程式碼的問題。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, w3HexSchool]
date: 2020-04-06 21:04:08
updated: 2020-04-06 21:04:08
---

## 前言

一般在做各種開發時，我們很常引入一些 npm 套件加快功能的實現，比如說 AJAX 行為就很適合使用 axios 套件來完成，當我們使用 Webpack 進行打包時，相關的 npm 套件也會通通被打包進 bundle.js 內，但這樣的行為對效能來說是較不友善的，原因為 bundle.js 實在是太肥大了，正確的作法應該是將 node_modules 內的模組單獨打包成一個檔案，避免載入時間過長的問題。此篇將介紹如何使用 SplitChunksPlugin 抽離 node_modules 內模組使之成為獨立的檔案，後面也會介紹當我們在開發多頁式應用時，如何以 SplitChunksPlugin 抽離公用模組用以解決重複程式碼的問題。

## 筆記重點

- 相關套件安裝
- SplitChunksPlugin 基本使用
- SplitChunksPlugin 可傳遞選項
- 補充：Dynamic import()
- 補充：解決 MPA 所造成的重複程式碼問題

## 相關套件安裝

過程會使用到的套件：

```bash
npm install html-webpack-plugin clean-webpack-plugin webpack webpack-cli -D ; npm install axios -P
```

package.json：

```json
{
  "devDependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^4.0.4",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  },
  "dependencies": {
    "axios": "^0.19.2"
  }
}
```

在 Webpack 4 中，SplitChunksPlugin 已預設裝載，我們不需要進行任何安裝動作，配置即可使用，事實上，SplitChunksPlugin 本身就已經開啟了，但預設配置是針對較為"特別"的情境才有作用，這才導致我們沒有感覺 SplitChunksPlugin 已經作用在當前還環境，為了保證結果如同預期，請先安裝上面所陳列的相關套件。

## SplitChunksPlugin 基本使用

初始專案結構：

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── js/
│       │
│       ├─── a.js         # JavaScript 模組 (1)
│       └─── b.js         # JavaScript 模組 (2)
│   │
│   ├─── index.html       # HTML 主檔案
│   └─── main.js          # entry 入口檔案
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
  // optimization.splitChunks 預設配置
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      // minRemainingSize: 0, (Webpack 5 才有此選項)
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

SplitChunksPlugin 不需要進行下載，直接可在 `optimization` 選項內進行配置，在前面有說過 Webpack 預設是有開啟 SplitChunksPlugin 的，但只針對"特殊"情境才有作用，這點下面會在說明，讓我們繼續完成編譯動作。

entry 入口處 (`src/main.js`) 引入 JavaScript 模組：

```js
import './js/a';
import './js/b';
```

JavaScript 模組 (1)：

```js
import axios from 'axios';
```

JavaScript 模組 (2)：

```js
import axios from 'axios';
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

此時打包生成的 `dist` 資料夾結構如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── main.js
│   └─── index.html
```

過程如同之前所介紹的，什麼事都沒有發生，讓我們將 SplitChunksPlugin 配置更改如下：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'initial', // 全域配置
    },
  },
};
```

再次執行編譯並查看結果：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── vendors~main.js
│   ├─── main.js
│   └─── index.html
```

此刻的你一定很錯亂，怎會突然新增了一個名為 `vendors~main.js` 的檔案，且檔案內容正好是 node_modules 內的相關模組 (此為 axios 套件)，太神奇了吧！讓我們先從剛剛修改的 `chunks` 選項開始說起：

- chunks：`async` | `initial` | `all`
  選擇那些類型的 chunk 是需要被優化的，默認為 `async`

當初我在認識 `chunks` 選項時，是直接以實作的方式去學習，因為官方文檔完全說的不清不楚阿！且如果你搜尋相關的文章，你會發現大部分都是直接翻譯官方文檔，我完全不懂這樣子的意義在哪？經過了反覆的嘗試，得出以下結論：

- `async`：只處理 [Lazy Loading](https://webpack.js.org/guides/lazy-loading/) 的 chunks，例如 `import(xxx)` 語法載入的模組
- `initial`：只處理同步加載的 chunk，例如 `import xxx` 語法載入的模組
- `all`：兼容以上兩種方式，通通進行處理

我們在 entry 內的所有模組都是使用 `import` 方式進行載入，這才導致 SplitChunksPlugin 在預設配置下沒有任何反應，因為 `chunks` 預設配置是 `async`，關於 `async` 的實際應用將會在下面補充介紹。理解了 `chunks` 是做什麼用，接下來換最為重要的 `cacheGroups` 選項部分：

- `cacheGroups`：定義 chunks 所屬的緩存組
- `{cacheGroups}`：緩存組名稱，可由 `name` 屬性更改
- `cacheGroups.{cacheGroups}.priority`：緩存組優先級，默認為 `0`
- `cacheGroups.{cacheGroups}.test`：控制當下緩存組匹配的 chunk，省略它會選擇所有 chunk
- `cacheGroups.{cacheGroups}.filename`：僅當 chunk 為同步加載時，才允許覆蓋文件名
- `cacheGroups.{cacheGroups}.enforce`：忽略全域的[部分選項](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupenforce)

`cacheGroups` 選項是使用 SplitChunksPlugin 成功與否的關鍵，這邊要注意的是上面提到的選項，都是 `cacheGroups` 專屬可配置的區域選項，有沒有注意到我說的是區域選項？事實上，`cacheGroups` 同層的選項都是屬於全域選項，也就是說你也可以在 `cacheGroups` 內配置 `chunks` 選項，一樣可以作用，且預設就已提供兩個 `cacheGroups` 供我們使用，為什麼前面單純的將 `chunks` 選項更改為 `initial` 就可以將 node_modules 內的模組抽離成獨立檔案，答案是不是呼之欲出了？

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'initial', // 將 async 改為 initial
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

沒錯！就是依靠預設配置的 `vendors` 這一個 `cacheGroups`，為什麼之前採預設配置都沒有反應，就是因為 `vendors` 參考的全域 `chunks` 配置屬性為 `async`，但我們是採用同步加載方式引入模組，當然會沒有反應，此時將 `chunks` 改為 `initial` 即可正常啟動抽離 chunk 的動作，但一般我們並不會使用預設的 `cacheGroups`，通常都會新增客製的 `cacheGroups` 做使用，如下所示：

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
          enforce: true,
          priority: 10, // 預設為 0，必須大於預設 cacheGroups
        },
      },
    },
  },
};
```

上面是一個抽離 node_modules 相關模組使之成為獨立檔案的標準寫法，我們並沒有更改預設的全域配置，直接以區域配置進行客製化，將符合正規表達式的 chunk 抽離出來，且 chunk 的載入方式須為同步載入，忽略全域的部分選項，最後將 chunk 名稱更改為 vendors，此時的編譯結果如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── vendors.js
│   ├─── main.js
│   └─── index.html
```

大功告成！如果 entry 內有任何引入 node_modules 模組的檔案，此模組都會被單獨打包進 vendors.js 內，如果你想要針對特定檔案進行抽離，只需要在正規表達式做撰寫即可，你也可以新增不同的 `cacheGroups` 專門針對不同要求做打包，優化整體的檔案結構。

介紹到這邊，已經把最重要的 `cacheGroups` 與 `chunks` 屬性給釐清了，可能有人會問，那其他的屬性呢？像是 `minSize`、`maxSize`、`minChunks` 等等，是做什麼用的？事實上，這幾個選項就如同字面上的意思，舉個例子：

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      minSize: 70000, // 限制最小大小 ( byte )
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
          enforce: true,
        },
      },
    },
  },
};
```

上面這種寫法是不影響 vendors 這個 `cacheGroups` 的，因為我們啟用了 `enforce` 選項，代表不參考全域的屬性，正確的寫法應該如下：

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
          enforce: true,
          minSize: 70000, // 限制最小大小 ( byte )
        },
      },
    },
  },
};
```

此時如果 node_modules 內的套件並沒有超過 70 KB，也就不會進入這一個 `cacheGroups`，自然就不會產生 vendors 這個檔案，各位可自行試試看剩餘這這些選項，其實都大同小異，最重要的 `cacheGroups` 與 `chunks` 觀念學會比較重要。

## SplitChunksPlugin 可傳遞選項

可參考 [SplitChunksPlugin Options](https://webpack.js.org/plugins/split-chunks-plugin/) 可傳遞參數列表，以下為常用的參數配置：

- automaticNameDelimiter：`String`
  指定用於生成名稱的連結符號，默認為 `~`

- minChunks：`Number`
  在做抽離代碼動作前，chunks 的最小引用次數，默認為 `1`

範例：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      automaticNameDelimiter: '@',
      minChunks: 2,
    },
  },
};
```

## 補充：Dynamic import()

在前面有提到 `chunks` 選項預設的 `async` 不太適合我們當前的使用情境，因為我們是以靜態的方式載入模組，如下所示：

```js
import './js/a';
import './js/b';
```

這次我們來介紹如何動態載入模組，並搭配 `async` 選項做使用，請先將 entry 入口處更改如下：

```js
// 靜態載入
import $ from 'jquery'; // 請記得安裝

// 動態載入
import(/* webpackChunkName: 'a' */ './js/a');
import(/* webpackChunkName: 'b' */ './js/b');
```

有別於使用 `import` 靜態載入模組，`import()` 在某些情況下可能帶來更高的效能，這邊要注意的是，必須以上面的寫法來載入模組，註解處是用已告知此模組的 chunkName，如果把註解給移除，預設的 chunkName 為數字，較為不直覺，建議還是直接定義 chunkName 比較好，

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
```

這邊就只是單純的配置相關選項，前面有提到 `chunks` 預設的值為 `async`，我們不需要進行任何配置，預設就以作用 vendors 這一個 `cacheGroups`，讓我們直接進行編譯看看：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── a.js
│   ├─── b.js
│   ├─── vendors~a~b.js
│   ├─── main.js
│   └─── index.html
```

從編譯結果可以得知，確實 node_modules 內的 axios 套件被抽離成 `vendors~a~b.js` 檔案，因為 `a.js` 與 `b.js` 是以動態載入的方式引入模組，檔案內的模組也就跟著作用，這邊有一點要注意的是，你會發現動態載入的模組也被抽離成獨立檔案了，這是基於 Webpack 預設的配置，與 SplitChunksPlugin 沒有關係。

上面就是預設配置的 `async` 結果，眼尖的朋友應該發現其中的問題了，那就是 jQuery 也被打包進 main.js 內了，並沒有被抽離出來，原理如同之前所介紹的，SplitChunksPlugin 預設配置的 `async` 只針對動態載入的模組，如果我們需要同時處理動態與非動態載入的模組，可使用 `all` 選項，如下所示：

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

此時的編譯結果如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── a.js
│   ├─── b.js
│   ├─── vendors~a~b.js      // 非同步載入的 axios 套件
│   ├─── vendors~main.js     // 同步載入的 jquery 套件
│   ├─── main.js
│   └─── index.html
```

從上面結果可以得知，node_modules 內的模組都已經被抽離成獨立檔案了，因為 `all` 選項會同時處理動態與非動態載入的模組，你可能現在在想，為什麼 SplitChunksPlugin 預設的 `chunks` 選項不直接設為 `all` 呢？就不用這麼麻煩了啊！我是認為另外兩個選項在某些情境下還是有存在的必要，並不是說哪一個選項最好，還是得看當下情境較適合哪一個選項而定，並且，`all` 所產生的效果並非所有情境下都需要。

## 補充：解決 MPA 所造成的重複程式碼問題

初始專案結構：

```plain
webpack-demo/
│
├─── node_modules/
├─── src/
│   │
│   └─── js/
│       │
│       ├─── a.js         # JavaScript 模組 (1)
│       └─── b.js         # JavaScript 模組 (2)
│   │
│   ├─── contact.html     # HTML 檔案 (contact)
│   ├─── contact.js       # entry 入口檔案 (contact)
│   ├─── index.html       # HTML 主檔案 (index)
│   └─── main.js          # entry 入口檔案 (index)
│
├─── webpack.config.js    # Webpack 配置檔案
├─── package-lock.json
└─── package.json
```

a.js：

```js
import $ from 'jquery';
import fun from './c';
```

b.js：

```js
import axios from 'axios';
import fun from './c';
```

c.js：

```js
export default () => {
  console.log('Hello World');
};
```

main.js：

```js
import './js/a';
```

contact.js：

```js
import './js/b';
```

配置 `webpack.config.js` 檔案：

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js',
    contact: './src/contact.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/contact.html',
      filename: 'contact.html',
    }),
  ],
};
```

以上是 MPA (Multi-Page Application) 基本的開發流程，讓我們直接進行編譯看看：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── contact.html
│   ├─── contact.js
│   ├─── index.html
│   └─── index.js
```

從上面的編譯結果可以得知，確實相關的代碼都有成功被打包進去，但這邊有一個問題是，兩個頁面存在相同的代碼，也就是 `c.js` 的檔案內容，這樣會導致頁面加載到不必要的流量，關於這一個問題，我們一樣可以使用 SplitChunksPlugin 來解決，配置如下：

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 抽離 node_modules
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
          priority: 20,
          enforce: true,
        },
        // 抽離公用模組
        common: {
          chunks: 'initial',
          minSize: 0,
          name: 'common',
          minChunks: 2,
          priority: 10,
        },
      },
    },
  },
};
```

記得將全域的 `minSize` 與 `minChunks` 透過區域配置方式給覆蓋掉，避免無法進入 common 這個 `cacheGroups`。

此時的編譯結果如下：

```plain
webpack-demo/
│
├─── dist/
│   │
│   ├─── common.ks         // 存在所有 node_modules 套件
│   ├─── common.ks         // 只存在 c.js
│   ├─── contact.html
│   ├─── contact.js
│   ├─── index.html
│   └─── index.js
```

這邊要注意！html-webpack-plugin 預設是載入所有 chunk 的，我們需要再各自頁面排除其他不相干的 chunk，如下所示：

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'], // 僅包含名為 main 的 chunk
    }),
    new HtmlWebpackPlugin({
      template: './src/contact.html',
      filename: 'contact.html',
      chunks: ['contact'], // 僅包含名為 contact 的 chunk
    }),
  ],
};
```

大功告成！
