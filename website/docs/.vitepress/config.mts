import { defineConfig } from 'vitepress'

const englishNav = [
  { text: 'API', link: '/api/' },
  { text: 'Tutorials', link: '/tutorials/' },
  { text: 'Skills', link: '/skills/' }
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

export default defineConfig({
  title: 'SilicoGrove Docs',
  description: 'API documentation, tutorials, and skills for SilicoGrove.',
  cleanUrls: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: englishNav,
        sidebar: {
          '/api/': englishApiSidebar,
          '/tutorials/': [{ text: 'Tutorials', items: [{ text: 'All tutorials', link: '/tutorials/' }] }],
          '/skills/': [{ text: 'Skills', items: [{ text: 'Recommended skills', link: '/skills/' }] }]
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
          { text: 'Skills', link: '/zh-cn/skills/' }
        ],
        sidebar: { '/zh-cn/api/': chineseApiSidebar }
      }
    },
    'zh-tw': { label: '繁體中文', lang: 'zh-TW', link: '/zh-tw/' },
    ja: { label: '日本語', lang: 'ja-JP', link: '/ja/' },
    ru: { label: 'Русский', lang: 'ru-RU', link: '/ru/' },
    fr: { label: 'Français', lang: 'fr-FR', link: '/fr/' },
    es: { label: 'Español', lang: 'es-ES', link: '/es/' }
  },
  themeConfig: {
    logo: '/silicogrove-logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
  }
})
