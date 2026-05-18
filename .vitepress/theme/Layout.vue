<script setup>
import DefaultTheme from 'vitepress/theme'
import SiteEnhancer from './SiteEnhancer.vue'

const { Layout } = DefaultTheme

console.log('[CUSTOM LAYOUT] My Layout.vue is being used!')
</script>

<template>
  <Layout />
  <SiteEnhancer />
</template>
