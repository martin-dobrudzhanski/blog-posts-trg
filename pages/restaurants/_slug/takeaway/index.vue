<template>
  <NoSSR>
    <section class="restaurant-slug-takeaway" data-nofooter-fullscreen>
      <Spinner />
    </section>
  </NoSSR>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js';
import NoSSR from 'vue-no-ssr';
import meta from '~/mixins/meta';
import hidefooter from '~/mixins/hidefooter';
import clickAndCollect from '~/mixins/clickAndCollect';
import iOrderConfig from '~/mixins/iOrderConfig';

import Spinner from '~/components/iOrder-core/ui/Spinner.vue';

export default {
  layout: 'clickAndCollect',
  mixins: [meta, hidefooter, clickAndCollect, iOrderConfig],
  data() {
    return {
      content: null,
    };
  },
  components: { NoSSR, Spinner },
  async asyncData({ store, params, error, query, redirect }) {
    return getContent(store, `click-and-collect/${params.slug}`, error);
  },
  methods: {
    async init() {
      if (!this.displayInSiteDirectory) {
        return this.$nuxt.$router.replace({ path: '/takeaway' });
      }

      const validationOutput = await this.$store.dispatch(
        'clickAndCollect/validateVenueAndMenu',
        { siteId: this.getSiteId }
      );
      if (!validationOutput.success) {
        return this.$nuxt.$router.replace({ path: `/takeaway` });
      }

      const canProceed = this.hasValidations();
      if (!canProceed) {
        return;
      }

      this.setIorderConfigs('clickAndCollect');
      this.$nuxt.$router.replace({
        path: `/restaurants/${this.$route.params.slug}/takeaway/menu`,
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
