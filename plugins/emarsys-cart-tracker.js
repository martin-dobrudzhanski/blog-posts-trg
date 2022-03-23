export default ({ store, app }) => {
  app.router.afterEach((to, from) => {
    if (!/restaurants-slug-takeaway-basket|restaurants-slug-takeaway-checkout-success/.test(to.name)) {
      store.dispatch('iorderCheckout/submitWebExtendConversionTracking', { });  
    }
  });
}