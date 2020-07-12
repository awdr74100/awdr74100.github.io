---
title: Webpack 前端打包工具 - 使用 prerender-spa-plugin 預渲染單頁應用
description:
  [
    通常我們在將一個專案改為目前流行的 SPA (Single-page application) 時，最大的考慮因素肯定是 SEO 是否重要，畢竟在 SPA 的世界裡幾乎沒有 SEO 的可能，對於爬蟲來說是無法爬取 JavaScript 檔案內容的，這也就印證 SPA 不適合用在強調 SEO 的專案上面，有些人可能會選擇使用像是 Nuxt.js、Next.js 等 SSR 框架，這確實是個解決辦法，但對於小型項目來說更好的做法是使用 Prerendering 方式，過程也相對簡單。此篇將介紹如何使用 prerender-spa-plugin 將我們的 SPA 添加預渲染。,
  ]
categories: [Webpack]
tags: [Webpack, Node.js, SEO, Vue.js, w3HexSchool]
date: 2020-07-13 00:14:38
updated: 2020-07-14 00:21:04
---

## 前言

通常我們在將一個專案改為目前流行的 SPA (Single-page application) 時，最大的考慮因素肯定是 SEO 是否重要，畢竟在 SPA 的世界裡幾乎沒有 SEO 的可能，對於爬蟲來說是無法爬取 JavaScript 檔案內容的，這也就印證 SPA 不適合用在強調 SEO 的專案上面，有些人可能會選擇使用像是 Nuxt.js、Next.js 等 SSR 框架，這確實是個解決辦法，但對於小型項目來說更好的做法是使用 Prerendering 方式，過程也相對簡單。此篇將介紹如何使用 prerender-spa-plugin 將我們的 SPA 添加預渲染。

## 筆記重點

- prerender-spa-plugin 安裝
- prerender-spa-plugin 基本使用
- prerender-spa-plugin 可傳遞選項

## prerender-spa-plugin 安裝

> 套件連結：[prerender-spa-plugin](https://www.npmjs.com/package/prerender-spa-plugin)

主要的套件：

```bash
npm install prerender-spa-plugin -D
```

prerender-sap-plugin 是 Vue 核心團隊成員開發出的預渲染插件，其內部運用了 Puppeteer 套件在 Webpack 構建的最後階段爬取指定路由的內容，之後再將這些內容實際渲染成獨立的 HTML 文件，並建立路由對應的目錄，這邊我們不需要下載 puppeteer，此為相依套件，關於 SPA 環境的搭建我們選擇使用 Vue CLI 來完成，如果你想使用 vue-loader 手動搭建出來，可參考我之前寫的 [文章](https://awdr74100.github.io/2020-04-13-webpack-vueloader/)。

## prerender-spa-plugin 基本使用

使用 Vue CLI 快速搭建 SPA 環境：

![Vue CLI 選擇 history 模式](https://i.imgur.com/MI86Ycm.png)

這邊要注意，通常我們為了求方便都會將 Vue Router 設為 hash 模式，也就是使用 `#` 來辨識不同的路由，但在 prerender-spa-plugin 中此模式是不被允許的，這樣會發生對應路由生成的 `index.html` 文件內容都一樣的問題，請將其改為 history 模式，這也是我推薦的模式，雖然還得再主機那邊設定重定向，但你不覺得這樣網址漂亮許多嗎？接著來看下一步：

新增 `vue.config.js` 檔案：

```diff
 prerender-demo/
 │
+└─── vue.config.js
```

對於某部分的人來講，Vue CLI v3+ 的配置可說是相當的友善，官方將 Vue CLI v2 存在的 Webpack 配置檔全部整合到了 package 內，我們只需要依造官方的配置文件撰寫對應的選項即可，但這對我來說就顯得有些麻煩，不能以傳統的 Webpack 配置方式進行配置，反而還得向官方文件查詢，這邊要新增 Plugin 必須使用以下方式撰寫：

```js
module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push();
    }
  },
};
```

這邊的 `config` 指向的是 Wbpack 配置檔本身，由於 Plugins 屬性是以陣列的方式存在，如果我們要將額外的 plugin 結合到現有的 plugins 中，自然就必須使用陣列的方式進行，這邊我習慣使用 `push` 方法新增至現有的 plugins 中，接著來看如何配置 prerender-spa-plugin：

```js
const path = require('path');
// 載入 prerender-spa-plugin (第一步)
const PrerenderSPAPlugin = require('prerender-spa-plugin');
// 載入 PuppeteerRenderer (第二步)
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        // 創建實例 (第三步)
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/', '/about'],
          renderer: new Renderer({
            renderAfterDocumentEvent: 'render-event',
          }),
        })
      );
    }
  },
};
```

配置 prerender-spa-plugin 的關鍵在於 `routes` 與 `renderer` 選項，這邊的 `routes` 傳遞的就是需預渲染的路由路徑，而 `renderer` 傳遞的對象為所使用的渲染器，在 `v3.4.0` 預設使用 renderer-puppeteer，接著我們需配置 `renderAfterDocumentEvent` 選項用以告知預渲染觸發的事件名稱，都完成後再來就是至 Vue 的實例中去觸發這個事件：

```js
new Vue({
  // ...
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  },
}).$mount('#app');
```

這邊我們選擇在 `mounted` 這個 hook 觸發事件，切記一定要加入觸發的時機，不然會卡在 puppeteer 等待觸發的環節，到這邊我們就完成配置了。

執行編譯指令：

```bash
npm run build
```

檢查傳遞的頁面路徑是否成功被預渲染：

```plain
dist/
│
├─── about
│   │
│   └─── index.html
│
├─── ... other
│
└─── index.html
```

從結果可以看出我們傳入的路由路徑已經成功被預渲染成對應的 `index.html` 檔案了，是不是很簡單？其實也就只是告訴 puppeteer 需預渲染的頁面路由而已，此時如果你開啟一個 localhost 服務，會發現操作上與傳統 SPA 在切換模組毫無差別，畢竟實際在運作的還是 JavaScript，這些預渲染形成的頁面最終 `#app` 節點下的內容還是會被覆蓋掉。

這邊要強調，Prerender 只適合用在小型的專案或是純靜態頁面的 SPA 專案上面，如果你打開這些預渲染的 HTML 檔案，會發現他只是將對應路由下的 DOM 元素以及內容給添加上去而已，這時候可能就有人問了，動態加載的內容也能夠實現嗎？答案是不行，你可以嘗試操作 AJAX 行為，並將獲取的內容添加到 DOM 元素看看，就算你把行為放在 `created` 這個 hook 去跑還是沒辦法成功，預渲染最後只會添加這一個 DOM 元素，並不會添加內容。

還有一點是關於動態路由預渲染的問題，就像是 `/user/:id` 這樣的路由路徑，我們很常使用此方式來渲染對應的內容，這點在 Prerender 同樣也行不通，畢竟預渲染的實現方法就是獲取已存在的元素對象，既然元素狀態都處於未知，爬蟲自然也就爬取不到對應內容。

## prerender-spa-plugin 可傳遞選項

可參考 [prerender-spa-plugin Options](https://www.npmjs.com/package/prerender-spa-plugin#plugin-options) 可傳遞參數列表，以下為常用的參數配置：

- staticDir：`String`
  預渲染輸出的位置，默認為 `none`

- minify：`Object`
  使用 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 最小化生成的 HTML，默認為 `none`

- headless：`Boolean`
  以 Headless 模式運行瀏覽器，此為 [puppeteer.launch](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v1.17.0&show=api-puppeteerlaunchoptions) 的可傳遞選項，默認為 `true`

```js
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/', '/about', '/admin/addProduct'],
          minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            keepClosingSlash: true,
            sortAttributes: true,
          },
          renderer: new Renderer({
            renderAfterDocumentEvent: 'render-event',
            headless: false,
          }),
        })
      );
    }
  },
};
```
