const siteMap = require('./libs/siteMapGenerator');

const timeslotsApiUrl =
  process.env.TIMESLOTS_API ||
  `https://trg-leisure-order-limits-stage.omnifitrgsites.co.uk/timeslots/`;

module.exports = {
  env: {
    timeslotsApiUrl,
    NODE_ENV: process.env.NODE_ENV,
    EXPONEA_API_URL: process.env.EXPONEA_API_URL,
    EXPONEA_PROJECT_TOKEN: process.env.EXPONEA_PROJECT_TOKEN,
    MWS_VOUCHER_URL: process.env.MWS_VOUCHER_URL,
    MWS_VOUCHER_TOKEN: process.env.MWS_VOUCHER_TOKEN,
    CONTENTFUL_ENV: process.env.CONTENTFUL_ENV,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    MWS_EXPONEA_URL: process.env.MWS_EXPONEA_URL,
    MWS_EXPONEA_TOKEN: process.env.MWS_EXPONEA_TOKEN,
    SHEER_ID_PROGRAM_ID:
      process.env.SHEER_ID_PROGRAM_ID || '61714689dd1b536f86a0692c'
  },
  generate: {
    interval: 100,
    minify: {
      collapseWhitespace: false
    }
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  },
  head: {
    titleTemplate: 'Chiquito - %s',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      },
      {
        name: 'apple-itunes-app',
        content: 'app-id=1112587268'
      },
      {
        name: 'google-play-app',
        content: 'app-id=uk.co.trg.chiquito'
      },
      {
        name: 'google-site-verification',
        content: '3WX_t4kbxj57dSrJ76GfDeRRoTqszhpZF7eY5qYsnmU'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico?v=4'
      }
    ],
    script: [
      {
        src: 'https://cdn.scarabresearch.com/js/1DB5494A738733E6/scarab-v2.js',
        type: 'text/javascript'
      },
      {
        src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js',
        type: 'text/javascript'
      },
      {
        src: 'https://bda.bookatable.com/deploy/lbui.direct.min.js',
        type: 'text/javascript'
      }
    ]
  },

  css: [
    'node_modules/smart-app-banner/dist/smart-app-banner.css',
    '@/assets/css/site.scss'
  ],

  modules: [
    '@nuxtjs/sitemap',
    ['@nuxtjs/google-tag-manager', { id: 'GTM-PM62CJ3' }],
    [
      'nuxt-robots-module',
      {
        UserAgent: '*',
        Disallow: ''
      }
    ],
    '@nuxtjs/toast',
    'nuxt-basic-auth-module'
  ],

  robots: [
    {
      UserAgent: '*',
      Disallow: '/star-review-rating-*'
    },
    {
      UserAgent: '*',
      Disallow: '/terms'
    },
    {
      UserAgent: '*',
      Disallow: '/unsubscribe'
    }
  ],

  basic: {
    name: process.env.BASIC_AUTH_USER,
    pass: process.env.BASIC_AUTH_PASS,
    enabled: process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS
  },

  plugins: [
    { src: '~plugins/vue-awesome-swiper.js', ssr: false },
    { src: '~plugins/vue-awesome-countdown.js', ssr: false },
    { src: '~plugins/maps.js', ssr: false },
    { src: '~plugins/validate.js', ssr: true },
    { src: '~plugins/filters.js' },
    { src: '~plugins/directives.js' },
    { src: '~plugins/app-banners.js', ssr: false },
    { src: '~plugins/analytics.js', ssr: false },
    { src: '~plugins/tooltips.js', ssr: false },
    { src: '~plugins/auth-route-protector.js', ssr: false },
    { src: '~plugins/persistedstate.js', ssr: false },
    { src: '~/plugins/v-calendar.js', ssr: false },
    { src: '~/plugins/iOrder.js' },
    { src: '~/plugins/vueScrollTo.js', ssr: false },
    { src: '~/plugins/scrollActive.js', ssr: false },
    { src: '~/plugins/vueAffix.js', ssr: false },
    { src: '~/plugins/vue-uuid.js', ssr: true },
    { src: '~/plugins/rakuten-global-tag.js', ssr: false },
    { src: '~/plugins/emarsys-cart-tracker.js', ssr: false },
    { src: '~/plugins/vueClipboard.js', ssr: false },
    { src: '~/plugins/velocity.js', ssr: false },
    { src: '~/plugins/exponea.js', ssr: false },
    { src: '~/plugins/gsap.client.js', ssr: false }
  ],

  router: {
    middleware: [
      'hideFlash',
      'hideNav',
      'hideModal',
      'setAppPlatform',
      'redirect',
      'resetMenuSearch'
    ]
  },

  build: {
    vendor: ['babel-polyfill', 'axios'],
    http2: {
      push: true
    },
    plugins: [],
    extend(config, ctx) {
      const babelLoader = config.module.rules.find(
        rule => rule.loader === 'babel-loader'
      );
      babelLoader.exclude = /node_modules\/(?!(vue2-google-maps|vue-frame))/;
    }
  },
  sitemap: siteMap
};
