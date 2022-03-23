<template>
  <div
    data-component="sticky-footer"
    :data-background-color="backgroundColor"
    :data-static-toggle="verticallyResponsiveStaticToggle"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['backgroundColor', 'verticallyResponsiveStaticToggle'],
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='sticky-footer'] {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: $rebrand-very-light-pink;
  display: flex;
  align-items: center;
  justify-content: center;
  -moz-box-shadow: 0 -2px 6px -1px hsla(0, 0%, 4%, 0.2);
  -webkit-box-shadow: 0 -2px 6px -1px hsla(0, 0%, 4%, 0.2);
  box-shadow: 0 -2px 6px -1px hsla(0, 0%, 4%, 0.2);
  @include whenScreenIs(sm) {
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  &[data-static-toggle] {
    @media only screen and (max-height: 542px) {
      position: static;
      margin-top: 40px;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
  &[data-modal] {
    padding: 8px 16px;
    @include whenScreenIs(sm) {
      background-color: $white-two;
      height: 64px;
      width: 400px;
      padding: 32px 0;
      position: absolute;
    }
  }
  &[guest-login] {
    background-color: $white-two;
    padding: 8px 16px;
    @media (min-width: 500px) {
      padding: 8px 32px;
    }
  }
  &[data-background-color='off-white'] {
    background-color: $white-two;
  }
  &.user-details {
    height: 64px;
  }
  &.alternative-times {
    height: 128px;
    padding: 0;
  }
}
</style>
