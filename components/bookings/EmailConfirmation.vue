<template>
  <div data-component="email-confirmation" :data-cancel="cancel">
    <p data-element="message" v-if="!cancel">
      A confirmation email has been sent to your address
    </p>
  </div>
</template>

<script>
export default {
  props: ['cancel']
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='email-confirmation'] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
  &[data-cancel] {
    align-items: left;
  }
  [data-element='message'] {
    font-family: $navigation-font;
    font-size: 18px;
    color: $greyish-brown;
    line-height: 1.23;
    @include whenScreenIs(xs) {
      width: 328px;
    }
    @include whenScreenIs(sm) {
      width: 610px;
    }
  }
  padding: 16px;
  text-align: center;
}
</style>
