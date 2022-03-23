import SmartBanner from 'smart-app-banner'

const inapplicablePages = [
  'order',
  'order-all',
  'order-error',
  'restaurants-slug-order',
  'restaurants-slug-order-menus',
  'restaurants-slug-order-menus-menuLabel',
  'restaurants-slug-order-basket',
  'restaurants-slug-order-success',
  'restaurants-slug-order-failure',
  'pay',
  'pay-result',
  'restaurants-slug-pay',
  'restaurants-slug-pay-id'
]

export default ({ store, route }) => {
  // Only run on client-side and only in production mode
  // if (process.env.NODE_ENV !== 'production') return;
  // on each page change
  // app.router.afterEach((to, from) => {
  // console.log('New SmartBanner');
  if (store.state.ui.isApp) {
    return false
  } else if (inapplicablePages.includes(route.name)) {
    return false
  } else {
    return new SmartBanner({
      // days to hide banner after close button is clicked (defaults to 15)
      daysHidden: 15,
      // days to hide banner after "VIEW" button is clicked (defaults to 90)
      daysReminder: 90,
      // language code for the App Store (defaults to user's browser language)
      appStoreLanguage: 'gb',
      title: 'Chiquito',
      author: 'TRG',
      button: 'VIEW',
      store: {
        android: 'In Google Play'
      },
      price: {
        ios: 'FREE',
        android: 'FREE',
        windows: 'FREE'
      },
      icon: require('@/assets/img/icons/app-icon.png')
      // put platform type ('ios', 'android', etc.) here to force single theme on all device
      // , theme: ''
      // Uncomment for platform emulation
      // , force: 'ios'
    })
  }
}
