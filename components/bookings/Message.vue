<template lang="html">
  <section class="book-message">
    <booking-header inverse :text="heading" />
    <BaseButton
      size="medium"
      class="book-message__cta"
      :to="btnLink"
      @click.native="clickBtn"
    >
      {{ btnText }}
    </BaseButton>
    <div data-element="link-row" data-center="true">
      <BaseLink new-tab :to="$store.state.booking.termsAndConditionsUrl">
        Terms and conditions
      </BaseLink>
    </div>
  </section>
</template>

<script>
import BookingHeader from '@/components/bookings/ui/BookingHeader';
import BaseButton from '@/components/buttons/BaseButton';
import BaseLink from '@/components/ui/BaseLink';

export default {
  props: ['heading', 'text', 'btnText', 'btnBack', 'btnLink'],
  components: {
    BookingHeader,
    BaseButton,
    BaseLink
  },
  methods: {
    clickBtn() {
      if (!this.btnBack) {
        return;
      }
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.book-message {
  min-height: calc(100vh - 272px);

  @include whenScreenIs(mdx) {
    min-height: calc(100vh - 384px);
  }

  &__cta {
    min-width: 20rem;
  }
}

.book-message {
  background: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;

  [data-component='booking-header'] {
    @include whenScreenIs(sm) {
      margin-bottom: 24px;
    }
  }
  [data-element='error-text'] {
    width: 328px;
    height: 60px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.25;
    margin-bottom: 24px;
    text-align: center;
    @include whenScreenIs(sm) {
      width: 476px;
      height: 40px;
      margin-bottom: 40px;
    }
  }
  &__btn {
    margin: 0 auto;
    @include whenScreenIs(sm) {
      margin-top: 16px;
    }
  }
  [data-element='link-row'] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    padding-top: 24px;
    width: 296px;
    @include whenScreenIs(sm) {
      width: 448px;
    }
    &[data-center] {
      justify-content: center;
    }
  }
}
</style>
