import Vue from 'vue';
import dayjs from 'dayjs';

Vue.filter('capitalize', val => {
  val = val.toLowerCase();
  return val.charAt(0).toUpperCase() + val.slice(1);
});

Vue.filter('gb-price', val => {
  return val.length ? '£' + val : '';
});

Vue.filter('distance', val => {
  return val ? val.toFixed(1) : val;
});

Vue.filter('stripBrandFromSiteTitle', val => {
  return val.replace(/Chiquito/gi, '');
});

Vue.filter('title', val => {
  return val.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
});

Vue.filter('remove-fb', val => {
  return val.replace(/[^,]*,/, '');
});

Vue.filter('sentance', val => {
  return val.length ? val.replace(/-/g, ' ') : val;
});

Vue.filter('readable-date', val => {
  return val.length ? dayjs(val).format('DD/MM/YYYY') : val;
});

Vue.filter('openingHours', val => {
  return val.length ? val.replace('.00', '') : '';
});

Vue.filter('voucher-remaining', val => {
  if (val === 999999) {
    return 'Unlimited';
  }
  return val;
});

Vue.filter('fixedPrice', val => {
  if (typeof val === 'number' || typeof val === 'string') {
    return Number(val).toFixed(2);
  }
  return val;
});
