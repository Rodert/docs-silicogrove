<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import LanguageSwitcher from './LanguageSwitcher.vue'
import SiteFooter from './SiteFooter.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <LanguageSwitcher />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>
