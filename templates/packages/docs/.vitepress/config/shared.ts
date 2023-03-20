import { defineConfig, HeadConfig } from 'vitepress'

// TODO:
// export const META_IMAGE = 'https://router.vuejs.org/social.png'
export const META_IMAGE = null
export const isProduction =
  process.env.NETLIFY && process.env.CONTEXT === 'production'

if (process.env.NETLIFY) {
  console.log('Netlify build', process.env.CONTEXT)
}

const productionHead: HeadConfig[] = [
  // [
  //   'script',
  //   {
  //     src: 'https://unpkg.com/thesemetrics@latest',
  //     async: '',
  //     type: 'text/javascript',
  //   },
  // ],
]
  type getIconType=(imgUrl:HTMLImageElement['src'],title:string)=>({
    svg:string
  })
  const getIcon:getIconType=function(imgUrl,title){
    return{
      svg:`<img width="20px" alt="${title}" title="${title}" src="${imgUrl}"/>`
    }
      }
export const sharedConfig = defineConfig({
  title: 'Watermark Page',
  appearance: 'dark',

  markdown: {
    theme: {
      dark: 'one-dark-pro',
      light: 'github-light',
    },

    attrs: {
      leftDelimiter: '%{',
      rightDelimiter: '}%',
    },
  },

  head: [
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    // ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],

    [
      'meta',
      { name: 'wwads-cn-verify', content: '7e7757b1e12abcb736ab9a754ffb617a' },
    ],

    [
      'meta',
      {
        property: 'og:type',
        content: 'website',
      },
    ],

    [
      'meta',
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    // [
    //   'meta',
    //   {
    //     property: 'twitter:image',
    //     content: META_IMAGE,
    //   },
    // ],

    // Vue School Top banner
    // [
    //   'script',
    //   {
    //     src: 'https://vueschool.io/banner.js?affiliate=vuerouter&type=top',
    //     // @ts-expect-error: vitepress bug
    //     async: true,
    //     type: 'text/javascript',
    //   },
    // ],

    ...(isProduction ? productionHead : []),
  ],
  themeConfig: {
    // logo: '/logo.svg',
    outline: [2, 3],

    socialLinks: [
      // { icon: 'twitter', link: 'https://twitter.com/posva' },
      {
        icon: 'github',
        link: 'https://github.com/140948940/${template---name}',
      },
      // {
      //   icon: getIcon("https://t7.baidu.com/it/u=3297880991,3632319069&fm=74&app=80&size=f256,256&n=0&f=JPEG&fmt=auto?sec=1678554000&t=0ffd5794ff2511d0a99fc340854b4aea","gitee"),
      //   link: '',
      // },
    ],

    footer: {
      copyright: 'Copyright © 2023-present A SOUL',
      message: 'Released under the MIT License.',
    },

    editLink: {
      pattern: 'https://github.com/140948940/${template---name}/edit/main/packages/docs/:path',
      text: 'Suggest changes',
    },

    // algolia: {
    //   appId: 'BTNTW3I1XP',
    //   apiKey: '771d10c8c5cc48f7922f15048b4d931c',
    //   indexName: 'next_router_vuejs',
    // },

    // carbonAds: {
    //   code: 'CEBICK3I',
    //   // custom: 'CEBICK3M',
    //   placement: 'routervuejsorg',
    // },
  },
})
