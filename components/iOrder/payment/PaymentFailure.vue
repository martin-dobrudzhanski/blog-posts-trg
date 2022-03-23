<template>
  <div class="payment-failure">
    <Icon class="skull-icon" :icon="'skull-failure'" />
    <div class="text-container">
      <h1 class="payment-failure--heading">Payment Failure</h1>
      <p class="payment-failure--text">
        Sorry, your payment did not go through.
      </p>
      <p class="payment-failure--message">
        {{ $store.state.iorderCheckout.failureData.message }}
      </p>
      <BaseButton class="button" @click.native="renderBasketPage"
        >Try again</BaseButton
      >
    </div>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'PaymentFailure',
  components: {
    Icon,
    BaseButton
  },
  methods: {
    renderBasketPage() {
      const slug = this.$route.params.slug;
      this.$nuxt.$router.push({ path: `/restaurants/${slug}/takeaway/basket` });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.payment-failure {
  margin: 100px 1rem;
  text-align: center;
  color: $greyish-brown;

  .skull-icon {
    position: relative;
    height: 146px;
    width: 103px;
  }

  .text-container {
    width: 450px;
    height: 305px;
    background-color: $light-pink;
    margin: -5rem auto;
    padding: 6rem 2rem 56px;
    border-radius: 7px;

    @include whenScreenIs(xs) {
      width: 100%;
      height: auto;
      padding-bottom: 20px;
    }
  }

  &--heading {
    font-family: $heading-font;
    font-size: 48px;
    line-height: 1.04;
    color: $peacock-blue;
    margin-bottom: 16px;
  }

  &--text,
  &--message {
    font-family: $font;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .button {
    margin: 30px auto;
  }
}
</style>
