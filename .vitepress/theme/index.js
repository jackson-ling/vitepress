// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './styles/index.css'

/** @type {import('vitepress').Theme} */

export default {
  extends: DefaultTheme,
  Layout,
}
