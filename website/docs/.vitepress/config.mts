import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SilicoGrove Docs',
  description: 'API documentation, tutorials, and skills for SilicoGrove.',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'API', link: '/api/' },
      { text: 'Tutorials', link: '/tutorials/' },
      { text: 'Skills', link: '/skills/' }
    ],
    sidebar: {
      '/api/': [
        {
          text: '开始使用',
          items: [
            { text: '概览', link: '/api/' },
            { text: '快速接入', link: '/api/quickstart' },
            { text: '模型与权限', link: '/api/models' }
          ]
        },
        {
          text: '能力接口',
          items: [
            { text: '文本聊天', link: '/api/text' },
            { text: '图片生成与编辑', link: '/api/images' },
            { text: '视频生成', link: '/api/videos' },
            { text: '上传参考素材', link: '/api/assets' },
            { text: '音频', link: '/api/audio' }
          ]
        },
        {
          text: '参考',
          items: [
            { text: '常见错误', link: '/api/troubleshooting' },
            { text: '二次中转', link: '/api/relay' }
          ]
        }
      ],
      '/tutorials/': [
        {
          text: 'Tutorials',
          items: [{ text: 'All tutorials', link: '/tutorials/' }]
        }
      ],
      '/skills/': [
        {
          text: 'Skills',
          items: [{ text: 'Recommended skills', link: '/skills/' }]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
  }
})
