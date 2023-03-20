import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://router.vuejs.org'
export const META_TITLE = 'Watermark Page'
export const META_DESCRIPTION = '为html元素一键生产水印'

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ['meta', { property: 'og:url', content: META_URL }],
    ['meta', { property: 'og:description', content: META_DESCRIPTION }],
    ['meta', { property: 'twitter:url', content: META_URL }],
    ['meta', { property: 'twitter:title', content: META_TITLE }],
    ['meta', { property: 'twitter:description', content: META_DESCRIPTION }],
  ],

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/140948940/${template---name}/edit/main/packages/docs/:path',
      text: '对本页提出修改建议',
    },

    outlineTitle: '本页内容',

    nav: [
      {
        text: '教程',
        link: '/guide/',
        activeMatch: '^/guide/',
      },
      {
        text: 'API 参考',
        link: '/api/',
        activeMatch: '^/api/',
      },
      // {
      //   text: '相关链接',
      //   items: [
      //     {
      //       text: 'Discussions',
      //       link: 'https://github.com/140948940/${template---name}/discussions',
      //     },
      //     {
      //       text: '更新日志',
      //       link: 'https://github.com/140948940/${template---name}/blob/main/packages/router/CHANGELOG.md',
      //     },
      //   ],
      // },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'packages',
          items: [{ text: '${template---name}', link: '/api/' }],
        },
      ],

      '/': [
        {
          items: [
            {
              text: '介绍',
              link: '/introduction.html',
            },
            {
              text: '安装',
              link: '/installation.html',
            },
          ],
        },
        {
          text: '基础',
          collapsible: false,
          items: [
            {
              text: '入门',
              link: '/guide/',
            }
          ],
        },
      ],
    },
  },
}
