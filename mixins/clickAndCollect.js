import get from 'lodash.get';

export default {
  computed: {
    clickAndCollectEnabled() {
      const enabled =
        this.content &&
        this.content.restaurant &&
        this.content.restaurant.fields &&
        this.content.restaurant.fields.clickAndCollect;

      const globallyEnabled = this.content && this.content.globallyEnabled;

      const isCovidOpen =
        this.content &&
        this.content.restaurant &&
        this.content.restaurant.fields &&
        this.content.restaurant.fields.covidOpen;

      return isCovidOpen && enabled && globallyEnabled === 'enabled';
    },
    getSiteId() {
      const siteId =
        this.content &&
        this.content.restaurant &&
        this.content.restaurant.fields &&
        this.content.restaurant.fields.siteId;

      return siteId;
    },
    displayInSiteDirectory() {
      return get(this.content, 'restaurant.fields.displayInSiteDirectory');
    }
  },
  methods: {
    hasValidations() {
      if (!this.clickAndCollectEnabled) {
        this.$store.dispatch('clickAndCollect/showError', {
          heading: 'Oops, sorry about that',
          message:
            'Click and Collect is not available right now. (code: cmskill)'
        });
        return;
      }
      if (!this.$store.getters['clickAndCollect/hasNecessaryDataToProceed']) {
        this.$router.push('/takeaway')
        return;
      }
      return true;
    }
  }
};
