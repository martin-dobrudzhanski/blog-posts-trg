<template>
  <section class="profile-wallet">
    <div v-if="!isLoading && vouchers.length" class="profile-wallet__container">
      <offer-coupon
        v-for="(offer, index) in visibleVouchers"
        :key="index"
        :offer="offer"
      />
    </div>
    <spinner v-else-if="isLoading && !vouchers.length" />
    <div v-else-if="!isLoading && !vouchers.length" class="empty-wallet">
      <h1 class="heading" data-weight="normal" data-size="xl">
        You don't have any vouchers in your wallet right now
      </h1>
    </div>
  </section>
</template>

<script>
import Spinner from '@/components/iOrder-core/ui/GenericLoader';
import OfferCoupon from '@/components/OfferCoupon';
import { mapActions } from 'vuex';

export default {
  components: {
    OfferCoupon,
    Spinner
  },
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  head() {
    const getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    return {
      title: 'Wallet',
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
      vouchers: [],
      isLoading: true
    };
  },
  computed: {
    getImgStyle() {
      const graphicUrl =
        this.content &&
        this.content.walletGraphic &&
        this.content.walletGraphic.fields &&
        this.content.walletGraphic.fields.file &&
        this.content.walletGraphic.fields.file.url;

      return {
        'background-image': `url(${graphicUrl}?w=672&h=624&q=100)`
      };
    },
    visibleVouchers() {
      // filter out GAME voucher campaigns if they have no voucher code
      return this.vouchers.filter(voucher => {
        return (
          voucher.type !== 'GAME' ||
          (voucher.type === 'GAME' && voucher.voucherCode)
        );
      });
    }
  },
  beforeMount() {
    if (!this.$store.getters['auth/userAuthenticated']) {
      this.$router.replace({ path: `/login` }, () => {
        this.flash({ message: 'Oops, you must be logged in to see this page' });
      });
      return;
    }
    if (this.$route.query.firstLogin) {
      this.$store.commit('ui/showModal', {
        modal: 'OptIn',
        modalOptions: {
          heading: 'Offers'
        }
      });
    }
    this.getVouchers()
      .then(this.handleSuccess)
      .catch(this.handleFailure);
  },
  methods: {
    ...mapActions({
      getVouchers: 'auth/getVouchers',
      logout: 'auth/logout',
      flash: 'ui/flash'
    }),

    handleSuccess(res) {
      this.isLoading = false;
      this.vouchers = res;
    },
    handleFailure(err) {
      this.isLoading = false;

      if (err.code === 'ECONNABORTED') {
        this.flash({
          message:
            'Hmm, its taking a too long to access your account, please try again shortly'
        });
        return;
      }

      if (/401|403|400/.test(err.response.status)) {
        this.logout();
        this.$router.replace({ path: `/login` }, () => {
          this.flash({
            message: 'Oops, something went wrong! Please try again'
          });
        });
        return;
      }
      this.flash({ message: 'Oops, something went wrong! Please try again' });
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.profile-wallet {
  background-color: $light-beige;
  padding: 1rem;

  &__container {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;

    @include whenScreenIs(mdx) {
      padding: 3rem 2rem;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      margin: auto;
      max-width: 746px;
    }

    @include whenScreenIs(lg) {
      grid-template-columns: 1fr 1fr 1fr;
      margin: 0;
      max-width: unset;
    }
  }

  .loader {
    margin: 30px 0;
  }
}
</style>
