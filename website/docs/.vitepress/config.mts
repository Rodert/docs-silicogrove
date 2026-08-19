import { defineConfig } from 'vitepress'

const siteUrl = 'https://docs.silicogrove.com'
const apiSourcePages = /^(api|zh-cn\/api)\/(quickstart|models|text|images|videos|assets|audio|troubleshooting|relay)\.md$/

function pageUrl(relativePath: string) {
  const path = relativePath
    .replace(/index\.md$/, '')
    .replace(/\.md$/, '')
  return `${siteUrl}/${path}`
}

const englishNav = [
  { text: 'API', link: '/api/' },
  { text: 'Tutorials', link: '/tutorials/' },
  { text: 'Skills', link: '/skills/' },
  { text: 'FAQ', link: '/faq/' }
]

const englishApiSidebar = [
  {
    text: 'Get started',
    items: [
      { text: 'Overview', link: '/api/#overview' },
      { text: 'Quick start', link: '/api/#quickstart' },
      { text: 'Models and access', link: '/api/#models' }
    ]
  },
  {
    text: 'API capabilities',
    items: [
      { text: 'Text', link: '/api/#text' },
      { text: 'Images', link: '/api/#images' },
      { text: 'Video', link: '/api/#videos' },
      { text: 'Reference assets', link: '/api/#assets' },
      { text: 'Audio', link: '/api/#audio' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'Troubleshooting', link: '/api/#troubleshooting' },
      { text: 'Relay integrations', link: '/api/#relay' }
    ]
  }
]

const chineseApiSidebar = [
  {
    text: '开始使用',
    items: [
      { text: '概览', link: '/zh-cn/api/#overview' },
      { text: '快速接入', link: '/zh-cn/api/#quickstart' },
      { text: '模型与权限', link: '/zh-cn/api/#models' }
    ]
  },
  {
    text: '能力接口',
    items: [
      { text: '文本聊天', link: '/zh-cn/api/#text' },
      { text: '图片生成与编辑', link: '/zh-cn/api/#images' },
      { text: '视频生成', link: '/zh-cn/api/#videos' },
      { text: '上传参考素材', link: '/zh-cn/api/#assets' },
      { text: '音频', link: '/zh-cn/api/#audio' }
    ]
  },
  {
    text: '参考',
    items: [
      { text: '常见错误', link: '/zh-cn/api/#troubleshooting' },
      { text: '二次中转', link: '/zh-cn/api/#relay' }
    ]
  }
]

const supplementalLocaleThemes = {
  'zh-tw': {
    nav: [{ text: 'API 文件', link: '/zh-tw/api/' }, { text: '教學', link: '/zh-tw/tutorials/' }, { text: 'Skills', link: '/zh-tw/skills/' }, { text: '常見問題', link: '/zh-tw/faq/' }],
    sidebar: { '/zh-tw/api/': [{ text: 'API 文件', items: [{ text: '概覽', link: '/zh-tw/api/' }] }], '/zh-tw/tutorials/': [{ text: '教學', items: [{ text: '全部教學', link: '/zh-tw/tutorials/' }] }], '/zh-tw/skills/': [{ text: 'Skills', items: [{ text: '推薦 Skills', link: '/zh-tw/skills/' }] }], '/zh-tw/faq/': [{ text: '常見問題', items: [{ text: '常見問題', link: '/zh-tw/faq/' }] }] }
  },
  ja: {
    nav: [{ text: 'API ドキュメント', link: '/ja/api/' }, { text: 'チュートリアル', link: '/ja/tutorials/' }, { text: 'Skills', link: '/ja/skills/' }, { text: 'よくある質問', link: '/ja/faq/' }],
    sidebar: { '/ja/api/': [{ text: 'API ドキュメント', items: [{ text: '概要', link: '/ja/api/' }] }], '/ja/tutorials/': [{ text: 'チュートリアル', items: [{ text: 'すべてのチュートリアル', link: '/ja/tutorials/' }] }], '/ja/skills/': [{ text: 'Skills', items: [{ text: 'おすすめ Skills', link: '/ja/skills/' }] }], '/ja/faq/': [{ text: 'よくある質問', items: [{ text: 'よくある質問', link: '/ja/faq/' }] }] }
  },
  ru: {
    nav: [{ text: 'API', link: '/ru/api/' }, { text: 'Руководства', link: '/ru/tutorials/' }, { text: 'Skills', link: '/ru/skills/' }, { text: 'Частые вопросы', link: '/ru/faq/' }],
    sidebar: { '/ru/api/': [{ text: 'API', items: [{ text: 'Обзор', link: '/ru/api/' }] }], '/ru/tutorials/': [{ text: 'Руководства', items: [{ text: 'Все руководства', link: '/ru/tutorials/' }] }], '/ru/skills/': [{ text: 'Skills', items: [{ text: 'Рекомендуемые Skills', link: '/ru/skills/' }] }], '/ru/faq/': [{ text: 'Частые вопросы', items: [{ text: 'Частые вопросы', link: '/ru/faq/' }] }] }
  },
  fr: {
    nav: [{ text: 'API', link: '/fr/api/' }, { text: 'Tutoriels', link: '/fr/tutorials/' }, { text: 'Skills', link: '/fr/skills/' }, { text: 'FAQ', link: '/fr/faq/' }],
    sidebar: { '/fr/api/': [{ text: 'API', items: [{ text: 'Vue d’ensemble', link: '/fr/api/' }] }], '/fr/tutorials/': [{ text: 'Tutoriels', items: [{ text: 'Tous les tutoriels', link: '/fr/tutorials/' }] }], '/fr/skills/': [{ text: 'Skills', items: [{ text: 'Skills recommandés', link: '/fr/skills/' }] }], '/fr/faq/': [{ text: 'FAQ', items: [{ text: 'Questions fréquentes', link: '/fr/faq/' }] }] }
  },
  es: {
    nav: [{ text: 'API', link: '/es/api/' }, { text: 'Tutoriales', link: '/es/tutorials/' }, { text: 'Skills', link: '/es/skills/' }, { text: 'Preguntas frecuentes', link: '/es/faq/' }],
    sidebar: { '/es/api/': [{ text: 'API', items: [{ text: 'Descripción general', link: '/es/api/' }] }], '/es/tutorials/': [{ text: 'Tutoriales', items: [{ text: 'Todos los tutoriales', link: '/es/tutorials/' }] }], '/es/skills/': [{ text: 'Skills', items: [{ text: 'Skills recomendados', link: '/es/skills/' }] }], '/es/faq/': [{ text: 'Preguntas frecuentes', items: [{ text: 'Preguntas frecuentes', link: '/es/faq/' }] }] }
  }
}

export default defineConfig({
  title: 'SilicoGrove Docs',
  description: 'API documentation, tutorials, and skills for SilicoGrove.',
  titleTemplate: ':title | SilicoGrove Docs',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#087f5b' }],
    ['meta', { property: 'og:site_name', content: 'SilicoGrove Docs' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/silicogrove-logo.png` }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],
  transformHead: ({ pageData }) => {
    const url = pageUrl(pageData.relativePath)
    const tags: [string, Record<string, string>][] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }]
    ]

    if (apiSourcePages.test(pageData.relativePath)) {
      tags.push(['meta', { name: 'robots', content: 'noindex, follow' }])
    }

    return tags
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: englishNav,
        sidebar: {
          '/api/': englishApiSidebar,
          '/tutorials/': [{ text: 'Tutorials', items: [{ text: 'All tutorials', link: '/tutorials/' }] }],
          '/skills/': [{
            text: 'Skills',
            items: [
              { text: 'Recommended skills', link: '/skills/' },
              { text: 'SilicoGrove Video', link: '/skills/silicogrove-video' },
              { text: 'SilicoGrove Image', link: '/skills/silicogrove-image' }
            ]
          }],
          '/faq/': [{ text: 'FAQ', items: [{ text: 'Frequently asked questions', link: '/faq/' }] }]
        }
      }
    },
    'zh-cn': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-cn/',
      themeConfig: {
        nav: [
          { text: 'API 文档', link: '/zh-cn/api/' },
          { text: '教程', link: '/zh-cn/tutorials/' },
          { text: 'Skills', link: '/zh-cn/skills/' },
          { text: '常见问题', link: '/zh-cn/faq/' }
        ],
        sidebar: {
          '/zh-cn/api/': chineseApiSidebar,
          '/zh-cn/tutorials/': [{ text: '教程', items: [{ text: '全部教程', link: '/zh-cn/tutorials/' }] }],
          '/zh-cn/faq/': [{ text: '常见问题', items: [{ text: '常见问题', link: '/zh-cn/faq/' }] }],
          '/zh-cn/skills/': [{
            text: 'Skills',
            items: [
              { text: '推荐 Skills', link: '/zh-cn/skills/' },
              { text: 'SilicoGrove Video', link: '/zh-cn/skills/silicogrove-video' },
              { text: 'SilicoGrove Image', link: '/zh-cn/skills/silicogrove-image' }
            ]
          }]
        }
      }
    },
    'zh-tw': { label: '繁體中文', lang: 'zh-TW', link: '/zh-tw/', themeConfig: supplementalLocaleThemes['zh-tw'] },
    ja: { label: '日本語', lang: 'ja-JP', link: '/ja/', themeConfig: supplementalLocaleThemes.ja },
    ru: { label: 'Русский', lang: 'ru-RU', link: '/ru/', themeConfig: supplementalLocaleThemes.ru },
    fr: { label: 'Français', lang: 'fr-FR', link: '/fr/', themeConfig: supplementalLocaleThemes.fr },
    es: { label: 'Español', lang: 'es-ES', link: '/es/', themeConfig: supplementalLocaleThemes.es }
  },
  themeConfig: {
    logo: '/silicogrove-logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
  }
})
