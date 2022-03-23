<template>
  <div class="card offer-card">
    <section v-if="showCampaigns" class="offers">
      <OfferCoupon
        v-for="(offer, index) in currentOffers"
        :key="`${index}-current-global`"
        :offer="offer"
      />
    </section>
    <section v-else-if="showLogin">
      <LoginForm :content="loginContent" />
    </section>
  </div>
</template>

<script>
import OfferCoupon from '@/components/OfferCoupon.vue';
import LoginForm from '@/components/account/LoginForm.vue';
export default {
  props: ['card'],
  components: {
    OfferCoupon,
    LoginForm
  },
  data() {
    return {
      showCampaigns: false,
      showLogin: false,
      campaigns: [],
      loginContent: {
        pageHeaderText: 'Login or register to get your voucher!',
        showFacebookLogin: true
      }
    };
  },
  computed: {
    currentOffers() {
      return this.campaigns
        .filter(campaign => campaign.type === 'GLOBAL')
        .filter(campaign => {
          return (
            this.card.fields.zonalCampaignIds.indexOf(
              campaign.zonalCampaignId
            ) !== -1
          );
        });
    }
  },
  created() {
    this.$store
      .dispatch('auth/getVouchers')
      .then(campaigns => {
        this.campaigns = campaigns;
        if (this.currentOffers.length) {
          this.showCampaigns = true;
        }
      })
      .catch(err => {
        this.showLogin = true;
      });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/elements/card.scss';

.offer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 16px;
  @include whenScreenIs(mdx) {
    padding: 48px;
  }
  .offers {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
  }
}
</style>
