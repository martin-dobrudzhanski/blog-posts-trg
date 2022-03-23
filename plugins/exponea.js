import { postBookingData } from '../libs/mwsNetworkRequests';

/* global exponea */
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

/* eslint-disable */
// Please make sure not to remove prettier ignore, it only affect the pasted code below and not the code in the whole file
// prettier-ignore
!function(e,n,t,i,o,r){function c(e){if("number"!=typeof e)return e;var n=new Date;return new Date(n.getTime()+1e3*e)}var a=4e3,s="xnpe_async_hide";function p(e){return e.reduce((function(e,n){return e[n]=function(){e._.push([n.toString(),arguments])},e}),{_:[]})}function m(e,n,t){var i=t.createElement(n);i.src=e;var o=t.getElementsByTagName(n)[0];return o.parentNode.insertBefore(i,o),i}function u(e){return"[object Date]"===Object.prototype.toString.call(e)}r.target=r.target||"https://api.exponea.com",r.file_path=r.file_path||r.target+"/js/exponea.min.js",o[n]=p(["anonymize","initialize","identify","update","track","trackLink","trackEnhancedEcommerce","getHtml","showHtml","showBanner","showWebLayer","ping","getAbTest","loadDependency","getRecommendation","reloadWebLayers"]),o[n].notifications=p(["isAvailable","isSubscribed","subscribe","unsubscribe"]),o[n]["snippetVersion"]="v2.3.0",function(e,n,t){e[n]["_"+t]={},e[n]["_"+t].nowFn=Date.now,e[n]["_"+t].snippetStartTime=e[n]["_"+t].nowFn()}(o,n,"performance"),function(e,n,t,i,o,r){e[o]={sdk:e[i],sdkObjectName:i,skipExperiments:!!t.new_experiments,sign:t.token+"/"+(r.exec(n.cookie)||["","new"])[1],path:t.target}}(o,e,r,n,i,RegExp("__exponea_etc__"+"=([\\w-]+)")),function(e,n,t){m(e.file_path,n,t)}(r,t,e),function(e,n,t,i,o,r,p){if(e.new_experiments){!0===e.new_experiments&&(e.new_experiments={});var f,l=e.new_experiments.hide_class||s,_=e.new_experiments.timeout||a,d=encodeURIComponent(r.location.href.split("#")[0]);e.cookies&&e.cookies.expires&&("number"==typeof e.cookies.expires||u(e.cookies.expires)?f=c(e.cookies.expires):e.cookies.expires.tracking&&("number"==typeof e.cookies.expires.tracking||u(e.cookies.expires.tracking))&&(f=c(e.cookies.expires.tracking))),f&&f<new Date&&(f=void 0);var x=e.target+"/webxp/"+n+"/"+r[t].sign+"/modifications.min.js?http-referer="+d+"&timeout="+_+"ms"+(f?"&cookie-expires="+Math.floor(f.getTime()/1e3):"");"sync"===e.new_experiments.mode&&r.localStorage.getItem("__exponea__sync_modifications__")?function(e,n,t,i,o){t[o][n]="<"+n+' src="'+e+'"></'+n+">",i.writeln(t[o][n]),i.writeln("<"+n+">!"+o+".init && document.writeln("+o+"."+n+'.replace("/'+n+'/", "/'+n+'-async/").replace("><", " async><"))</'+n+">")}(x,n,r,p,t):function(e,n,t,i,o,r,c,a){r.documentElement.classList.add(e);var s=m(t,i,r);function p(){o[a].init||m(t.replace("/"+i+"/","/"+i+"-async/"),i,r)}function u(){r.documentElement.classList.remove(e)}s.onload=p,s.onerror=p,o.setTimeout(u,n),o[c]._revealPage=u}(l,_,x,n,r,p,o,t)}}(r,t,i,0,n,o,e),function(e,n,t){e[n].start=function(i){i&&Object.keys(i).forEach((function(e){return t[e]=i[e]})),e[n].initialize(t)}}(o,n,r)}(document,"exponea","script","webxpClient",window,{
  target: process.env.EXPONEA_API_URL,
  token: process.env.EXPONEA_PROJECT_TOKEN,
  track: {
    visits: true
  }
});

exponea.start();
/* eslint-enable */

const getTimestamp = () => Math.floor(new Date().getTime() / 1000);

export const identifyExponea = function({ username, useremail }) {
  if (!exponea || !exponea.identify || !useremail) {
    console.error('Exponea identification error');
    return;
  }
  exponea.identify(
    {
      email_id: useremail.toLowerCase().trim()
    },
    {
      name: username,
      email: useremail
    }
  );
};

export const logExponeaConsent = function({ action }) {
  exponea.track('consent', {
    category: 'marketing',
    action: action,
    valid_until: 'unlimited',
    timestamp: getTimestamp()
  });
};

export const logExponeaPasswordReset = function({ email }) {
  identifyExponea({ username: null, useremail: email });
  exponea.track('password_reset', {
    email,
    timestamp: getTimestamp(),
    date: dayjs(new Date())
      .tz('Europe/London')
      .format('YYYY-DD-MM HH:mm')
  });
};

export const logExponeaWalletAction = function({ action, extraProperties }) {
  const properties = {
    action: action,
    timestamp: Math.floor(new Date().getTime() / 1000)
  };

  if (extraProperties instanceof Object) {
    if (extraProperties.hasOwnProperty('password')) {
      delete extraProperties.password;
    }
    Object.assign(properties, extraProperties);
  }

  if (properties.hasOwnProperty('email')) {
    identifyExponea({ useremail: properties.email });
  }

  if (properties.hasOwnProperty('optIn')) {
    logExponeaConsent({ action: properties.optIn ? 'accept' : 'reject' });
  }

  exponea.track('wallet', properties);
};

export const logExponeaOrder = function({
  id,
  total,
  items,
  username,
  useremail,
  timeslot,
  siteId,
  siteName,
  paymentMethod,
  collectionMethod,
  actionType,
  discount,
  voucherCode
}) {
  identifyExponea({ username, useremail });
  const orderTime = new Date();
  console.log(
    dayjs(orderTime)
      .tz('Europe/London')
      .format('YYYY-DD-MM HH:mm:ss')
  );

  const properties = {
    discount: Math.abs(discount || 0),
    order_id: id,
    site_id: siteId,
    site_name: siteName,
    items: items,
    order_time: dayjs(orderTime)
      .tz('Europe/London')
      .format('HH:mm:ss'),
    order_date: dayjs(orderTime)
      .tz('Europe/London')
      .format('YYYY-DD-MM HH:mm:ss'),
    order_value: total,
    used_voucher_code: voucherCode || 'none',
    payment_method: paymentMethod,
    visit_type: actionType
  };

  if (collectionMethod) {
    Object.assign(properties, {
      collection_method: collectionMethod
    });
  }

  if (actionType === 'collection') {
    Object.assign(properties, {
      order_date: dayjs(timeslot).format('YYYY-MM-DD'),
      collection_time: dayjs(timeslot).format('HH:mm'),
      epoch_datetime: dayjs(timeslot).unix()
    });
  }

  exponea.track('order', { ...properties });
};

export const logExponeaBooking = function({
  id,
  timeslot,
  username,
  useremail,
  siteId,
  siteName,
  covers,
  specialRequest,
  specialOccasion,
  actionType,
  amendedBookingDetails,
  amendUrl,
  cancelUrl,
  agreedRegionalTerms
}) {
  const now = new Date();

  const timeslotUKtime = timeslot && dayjs(timeslot).tz('Europe/London');

  const properties = {
    userName: username,
    userEmail: useremail,
    eventData: {
      method: 'table-booking',
      booking_id: id,
      booking_status: actionType.split('_')[1],
      site_id: parseInt(siteId),
      site_name: siteName,
      execution_time: dayjs(now)
        .tz('Europe/London')
        .format('DD-MM-YYYY HH:mm'),
      name: username,
      email: useremail
    }
  };

  switch (actionType) {
    case 'booking_confirm':
      properties.eventData.booking_date = timeslotUKtime.format('DD-MM-YYYY');
      properties.eventData.booking_time = timeslotUKtime.format('HH:mm');
      properties.eventData.booking_datetime = timeslotUKtime.format('DD-MM-YYYY HH:mm');
      properties.eventData.booking_epoch = timeslotUKtime.unix();
      properties.eventData.covers = covers;
      properties.eventData.booking_special_request = specialRequest;
      properties.eventData.booking_special_occasion = specialOccasion;
      properties.eventData.amend_url = amendUrl;
      properties.eventData.cancel_url = cancelUrl;
      properties.eventData.agreed_regional_terms = agreedRegionalTerms;
      break;
    case 'booking_update':
      properties.eventData.new_booking_date = timeslotUKtime.format('DD-MM-YYYY');
      properties.eventData.new_booking_time = timeslotUKtime.format('HH:mm');
      properties.eventData.new_booking_datetime = timeslotUKtime.format(
        'DD-MM-YYYY HH:mm'
      );
      properties.eventData.new_booking_epoch = timeslotUKtime.unix();
      properties.eventData.new_booking_special_request = specialRequest;
      properties.eventData.new_booking_special_occasion = specialOccasion;
      properties.eventData.new_covers = covers;
      properties.eventData.amend_url = amendUrl;
      properties.eventData.cancel_url = cancelUrl;
      properties.eventData.agreed_regional_terms = agreedRegionalTerms;
      if (amendedBookingDetails) {
        const abt = amendedBookingDetails.timeslot.split(' ');
        properties.eventData.original_booking_date = abt[0];
        properties.eventData.original_booking_time = abt[1];
        properties.eventData.original_booking_epoch = dayjs(
          amendedBookingDetails.timeslot
        ).unix();
        properties.eventData.original_booking_special_request =
          amendedBookingDetails.specialRequest;
        properties.eventData.original_booking_special_occasion =
          amendedBookingDetails.specialOccasion;
        properties.eventData.original_covers = amendedBookingDetails.numPeople;
      }
      break;
    case 'booking_cancel':
      properties.eventData.canceled_booking_date = dayjs(timeslot).format('DD-MM-YYYY');
      properties.eventData.canceled_booking_time = dayjs(timeslot).format('HH:mm');
      properties.eventData.canceled_booking_datetime = dayjs(timeslot).format(
        'DD-MM-YYYY HH:mm'
      );
      properties.eventData.canceled_booking_epoch = dayjs(timeslot).unix();
      properties.eventData.canceled_covers = covers;
      break;
  }

  postBookingData({ ...properties });
};

export const logExponeaWebsiteSignup = function({ email }) {
  const payload = {
    email,
    date: dayjs(new Date())
      .tz('Europe/London')
      .format('YYYY-DD-MM HH:mm')
  };
  exponea.track('website_signup', payload);
};

export default (context, inject) => {
  inject('identifyExponea', identifyExponea);
  inject('logExponeaConsent', logExponeaConsent);
  inject('logExponeaOrder', logExponeaOrder);
  inject('logExponeaBooking', logExponeaBooking);
  inject('logExponeaWalletAction', logExponeaWalletAction);
  inject('logExponeaWebsiteSignup', logExponeaWebsiteSignup);
  inject('logExponeaPasswordReset', logExponeaPasswordReset);
  context.$identifyExponea = identifyExponea;
  context.$logExponeaConsent = logExponeaConsent;
  context.$logExponeaOrder = logExponeaOrder;
  context.$logExponeaBooking = logExponeaBooking;
  context.$logExponeaWalletAction = logExponeaWalletAction;
  context.$logExponeaWebsiteSignup = logExponeaWebsiteSignup;
  context.$logExponeaPasswordReset = logExponeaPasswordReset;
};
