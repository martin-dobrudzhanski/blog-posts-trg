const contentful = require('contentful');

const config = {
  contentful: {
    SPACE_ID: process.env.CONTENTFUL_SPACEID || 'w3qjq8no4dj7',
    ACCESS_TOKEN:
      process.env.CONTENTFUL_TOKEN ||
      '4a85c41cc8b54816fe96b367b0fac96e5e46657600d085f5ab45f9416dd0f53a',
    CONTENTFUL_HOST: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
    CONTENTFUL_ENV: process.env.CONTENTFUL_ENV || 'development',
    client: ''
  }
};
console.log({ contentfulEnv: config.contentful.CONTENTFUL_ENV });
config.contentful.client = contentful.createClient({
  space: config.contentful.SPACE_ID,
  accessToken: config.contentful.ACCESS_TOKEN,
  host: config.contentful.CONTENTFUL_HOST,
  environment: config.contentful.CONTENTFUL_ENV,
  cache: true
});

module.exports = config;
