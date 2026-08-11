<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const supportedLocales = [
  { code: 'en', label: 'English' },
  { code: 'zh-cn', label: '简体中文' }
]
const localePrefix = /^\/(zh-cn|zh-tw|ja|ru|fr|es)(?=\/|$)/

const currentLocale = computed(() => route.path.match(localePrefix)?.[1] ?? 'en')

function destination(locale: string) {
  const pathname = route.path.replace(localePrefix, '') || '/'
  return locale === 'en' ? pathname : `/${locale}${pathname}`
}

function changeLocale(event: Event) {
  const locale = (event.target as HTMLSelectElement).value
  document.cookie = `docs_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
  window.location.assign(destination(locale))
}
</script>

<template>
  <label class="language-switcher">
    <span class="sr-only">Language</span>
    <select :value="currentLocale" aria-label="Language" @change="changeLocale">
      <option v-for="locale in supportedLocales" :key="locale.code" :value="locale.code">
        {{ locale.label }}
      </option>
    </select>
  </label>
</template>
