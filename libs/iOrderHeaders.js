const production = userAgent => {
  return {
    iOrderUrl: 'https://iopapi.zonalconnect.com/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'X-Auth-BrandToken':
        'dHJnLWpvZXMta2l0Y2hlbjplbnNlbWJsZS1jdWlzaW5lci1wcm90ZWN0b3JhdGU=',
      'X-iOrder-User-Agent': `WLWO - OmnifiTRG - ${userAgent}`
    }
  };
};

const staging = userAgent => {
  return {
    iOrderUrl: 'https://iopapi.znl-stg01.com/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'X-Auth-BrandToken':
        'dHJnLXdlYi10ZXN0ZXI6d2VzdGVyb3Mtc2llbnRvLWFydGlzYW4=',
      'X-iOrder-User-Agent': `WLWO - OmnifiTRG - ${userAgent}`
    }
  };
};

module.exports = function(env = '', userAgent = '') {
  return env === 'production' ? production(userAgent) : staging(userAgent);
};
