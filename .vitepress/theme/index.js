// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import confetti from './confetti.vue'

/** @type {import('vitepress').Theme} */

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('confetti', confetti)
  }
}
