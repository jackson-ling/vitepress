// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import confetti from './confetti.vue';  // 导入插件，主页烟花效果
import './vp-code.css'; // 代码块样式美化
import './rainbow.css'; // 首页图标背景渐变色
import HomeUnderline from "./HomeUnderline.vue" // 首页标题下划线
import './sidebarIcon.css'; // 侧边栏样式美化
import './style/index.css'


/** @type {import('vitepress').Theme} */

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('confetti', confetti);  // 注册组件
    // app.component('HomeUnderline' , HomeUnderline);
    }
}

// 外界安装的主题插件，使用前需要注释掉默认主题

// // 1. import vitepress theme
// import Theme from '@escook/vitepress-theme'
// // 2. import matching CSS styles (this step cannot be omitted)
// import '@escook/vitepress-theme/style.css'
//
// // 3. simply set the theme of "import" to "export default"
// export default Theme