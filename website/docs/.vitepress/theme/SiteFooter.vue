<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const localePrefix = /^\/(zh-cn|zh-tw|ja|ru|fr|es)(?=\/|$)/

const labels = {
  en: { main: 'SilicoGrove Main Site', api: 'SilicoGrove API', terms: 'Terms of Service', privacy: 'Privacy Policy' },
  'zh-cn': { main: 'SilicoGrove 主站', api: 'SilicoGrove API 站点', terms: '用户协议', privacy: '隐私政策' },
  'zh-tw': { main: 'SilicoGrove 主站', api: 'SilicoGrove API 網站', terms: '使用者協議', privacy: '隱私政策' },
  ja: { main: 'SilicoGrove 公式サイト', api: 'SilicoGrove API サイト', terms: '利用規約', privacy: 'プライバシーポリシー' },
  ru: { main: 'Главный сайт SilicoGrove', api: 'SilicoGrove API', terms: 'Пользовательское соглашение', privacy: 'Политика конфиденциальности' },
  fr: { main: 'Site principal SilicoGrove', api: 'API SilicoGrove', terms: "Conditions d'utilisation", privacy: 'Politique de confidentialite' },
  es: { main: 'Sitio principal de SilicoGrove', api: 'API de SilicoGrove', terms: 'Terminos de servicio', privacy: 'Politica de privacidad' }
}

const locale = computed(() => route.path.match(localePrefix)?.[1] ?? 'en')
const copy = computed(() => labels[locale.value as keyof typeof labels])
const prefix = computed(() => (locale.value === 'en' ? '' : `/${locale.value}`))
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__content">
      <span>© {{ new Date().getFullYear() }} SilicoGrove</span>
      <nav aria-label="Footer navigation">
        <a href="https://silicogrove.com/" target="_blank" rel="noreferrer">{{ copy.main }}</a>
        <a href="https://api.silicogrove.com/" target="_blank" rel="noreferrer">{{ copy.api }}</a>
        <a :href="`${prefix}/legal/terms`">{{ copy.terms }}</a>
        <a :href="`${prefix}/legal/privacy`">{{ copy.privacy }}</a>
      </nav>
    </div>
  </footer>
</template>
