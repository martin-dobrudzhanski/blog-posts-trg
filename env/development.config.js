module.exports = {
  apps: [
    {
      name: 'chiquitowebserver',
      script: './build/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        APP_ENV: 'development',
        CC_ENV: 'development',
        OAT_ENV: 'development',
        OA_ENV: 'development',
        ALERTS_URL: 'https://alerts-api-dev.omnifitrgsites.co.uk',
        BOOKING_ENV: 'development',
        CONTENTFUL_TOKEN:
          '4a85c41cc8b54816fe96b367b0fac96e5e46657600d085f5ab45f9416dd0f53a',
        CONTENTFUL_HOST: 'preview.contentful.com',
        CONTENTFUL_SPACEID: 'w3qjq8no4dj7',
        CONTENTFUL_ENV: 'development',
        APPLICATION_NAME: 'chiquitoweb',
        VOUCHER_ENDPOINT:
          'https://vouchers-stage.omnifitrgsites.co.uk/v1-0/chiq',
        LOCATION_URL: 'http://localhost:3000',
        EMARSYS_API_KEY: 'chiquito002',
        EMARSYS_API_SECRET: 'rl98zvlkr6yVZtKXOIDB',
        EMARSYS_SOURCE_ID: 12,
        EMARSYS_GET_CONTACT_URL:
          'https://api.emarsys.net/api/v2/contact/getdata',
        EMARSYS_CREATE_CONTACT_URL: 'https://api.emarsys.net/api/v2/contact',
        EMARSYS_EVENT_PREFIX_URL: 'https://api.emarsys.net/api/v2/event',
        EMARSYS_BOOKING_CONFIRMATION_EVENT_ID: 1164,
        EMARSYS_BOOKING_UPDATE_EVENT_ID: 1165,
        EMARSYS_BOOKING_CANCELLATION_EVENT_ID: 1166,
        FACEBOOK_APP_ID: '649816015518153',
        LIVERES_URL: 'https://reservationsapi-stg02.liveres.co.uk',
        LIVERES_USERNAME: 'a1af8a75-a48d-4dd4-afff-408031645d95',
        LIVERES_PASSWORD: 'mU1AwKjQn+KG',
        UTIL_ENDPOINT: 'https://util.omnifitrgsites.co.uk',
        PMB_GATEWAY_URL: 'https://ts-gw-dev.omnifitrgsites.co.uk',
        GOOGLE_PAY_MERCHANT_ID: process.env.GOOGLE_PAY_MERCHANT_ID,
        EXPONEA_API_URL: process.env.EXPONEA_API_URL,
        EXPONEA_PROJECT_TOKEN: process.env.EXPONEA_PROJECT_TOKEN,
        EXPONEA_KEY_NAME: process.env.EXPONEA_KEY_NAME,
        EXPONEA_KEY_TOKEN: process.env.EXPONEA_KEY_TOKEN,
        MWS_VOUCHER_URL: 'https://employee-discounts.test-trg-api.co.uk',
        MWS_VOUCHER_TOKEN: 'mIleBnAq527S9n0jH5feGnBJ60MRH0aF',
        MWS_EXPONEA_URL:
          'https://test-trg-api.co.uk/exponea/send-event/chiquito',
        MWS_EXPONEA_TOKEN: 'W7ZOqBfucI',
        SHEER_ID_PROGRAM_ID:
          process.env.SHEER_ID_PROGRAM_ID || '61714689dd1b536f86a0692c'
      }
    }
  ]
};
