<template>
  <section class="nearest-me" data-fullscreen>
    <div key="loader" class="loader"></div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import { getContent } from '~/libs/templateHelpers.js';

export default {
  layout: 'menu',
  head() {
    const getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    return {
      title: 'Nearest Menu',
      bodyAttrs: {
        'data-pagecolor': 'white'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    };
  },

  data() {
    return {
      content: null
    };
  },

  async asyncData({ store, params, error }) {
    return getContent(store, 'nearest-me', error);
  },

  methods: {
    ...mapActions({ getLocalRestaurants: 'location/getLocalRestaurants' }),
    ...mapActions('ui', ['flash']),
    handleSuccess(closestVenues) {
      const venue = closestVenues[0].fields;
      this.$router.push(`/restaurants/${venue.slug}/menu`);
    },
    handleError(err) {
      console.info(err);
      this.$router.push('/menu', () => {
        this.flash({
          message:
            'We couldn’t locate you, please search for your local restaurant instead',
          autoHide: true
        });
      });
    }
  },

  beforeMount() {
    const query = this.$route.query.lookup;
    this.getLocalRestaurants({
      query,
      restaurantList: this.content.restaurants.fields.list
    })
      .then(this.handleSuccess)
      .catch(this.handleError);
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
.nearest-me {
  overflow: hidden;
  .loader {
    margin: 30px auto 0;
  }
}
</style>
