module.exports = {
  apps: [
    {
      name: 'chiquitowebserver',
      script: './build/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        CC_ENV: process.env.CC_ENV,
        OAT_ENV: process.env.OAT_ENV,
        OA_ENV: process.env.OA_ENV,
        ALERTS_URL: 'https://alerts-api.omnifitrgsites.co.uk',
        BOOKING_ENV: process.env.BOOKING_ENV,
        CONTENTFUL_TOKEN: process.env.CONTENTFUL_TOKEN,
        CONTENTFUL_HOST: process.env.CONTENTFUL_HOST,
        CONTENTFUL_SPACEID: process.env.CONTENTFUL_SPACEID,
        CONTENTFUL_ENV: process.env.CONTENTFUL_ENV,
        APPLICATION_NAME: process.env.APPLICATION_NAME,
        IOT_ENDPOINT: process.env.IOT_ENDPOINT,
        CACHE_TOPIC: process.env.CACHE_TOPIC,
        VOUCHER_ENDPOINT: process.env.VOUCHER_ENDPOINT,
        LOCATION_URL: process.env.LOCATION_URL,
        EMARSYS_API_KEY: process.env.EMARSYS_API_KEY,
        EMARSYS_API_SECRET: process.env.EMARSYS_API_SECRET,
        EMARSYS_SOURCE_ID: process.env.EMARSYS_SOURCE_ID,
        EMARSYS_GET_CONTACT_URL: process.env.EMARSYS_GET_CONTACT_URL,
        EMARSYS_CREATE_CONTACT_URL: process.env.EMARSYS_CREATE_CONTACT_URL,
        EMARSYS_EVENT_PREFIX_URL: process.env.EMARSYS_EVENT_PREFIX_URL,
        EMARSYS_BOOKING_CONFIRMATION_EVENT_ID:
          process.env.EMARSYS_BOOKING_CONFIRMATION_EVENT_ID,
        EMARSYS_BOOKING_UPDATE_EVENT_ID:
          process.env.EMARSYS_BOOKING_UPDATE_EVENT_ID,
        EMARSYS_BOOKING_CANCELLATION_EVENT_ID:
          process.env.EMARSYS_BOOKING_CANCELLATION_EVENT_ID,
        LIVERES_URL: process.env.LIVERES_URL,
        LIVERES_USERNAME: process.env.LIVERES_USERNAME,
        LIVERES_PASSWORD: process.env.LIVERES_PASSWORD,
        REDIS_DEBUG_MODE: process.env.REDIS_DEBUG_MODE,
        REDIS_CACHE_ENABLED: process.env.REDIS_CACHE_ENABLED,
        REDIS_CACHE_URL: process.env.REDIS_CACHE_URL,
        WAF_CACHE_URL: process.env.WAF_CACHE_URL,
        UTIL_ENDPOINT: 'https://util.omnifitrgsites.co.uk',
        FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
        PMB_GATEWAY_URL: process.env.PMB_GATEWAY_URL,
        PMB_ENV: process.env.PMB_ENV,
        GOOGLE_PAY_MERCHANT_ID: process.env.GOOGLE_PAY_MERCHANT_ID,
        EXPONEA_API_URL: process.env.EXPONEA_API_URL,
        EXPONEA_PROJECT_TOKEN: process.env.EXPONEA_PROJECT_TOKEN,
        EXPONEA_KEY_NAME: process.env.EXPONEA_KEY_NAME,
        EXPONEA_KEY_TOKEN: process.env.EXPONEA_KEY_TOKEN,
        MWS_VOUCHER_URL: process.env.MWS_VOUCHER_URL,
        MWS_VOUCHER_TOKEN: process.env.MWS_VOUCHER_TOKEN,
        MWS_EXPONEA_URL: process.env.MWS_EXPONEA_URL,
        MWS_EXPONEA_TOKEN: process.env.MWS_EXPONEA_TOKEN,
        SHEER_ID_PROGRAM_ID: process.env.SHEER_ID_PROGRAM_ID
      }
    }
  ]
};
