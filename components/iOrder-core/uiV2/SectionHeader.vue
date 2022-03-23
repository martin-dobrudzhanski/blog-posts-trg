<template>
  <div
    data-component="section-header"
    :data-inverse="inverse"
    :data-modal-header="modalHeader"
    :data-borderbottom="borderBottom"
    :data-background="background"
    :data-choices="choices"
  >
    <h2
      data-element="text"
      :data-size="size"
      :data-inverse="inverse"
      :data-modal-header="modalHeader"
      :data-success="successPage"
      :data-width="textWidth"
    >
      {{ text }}
    </h2>
  </div>
</template>

<script>
export default {
  props: [
    'text',
    'size',
    'inverse',
    'modalHeader',
    'borderBottom',
    'background',
    'successPage',
    'transparent',
    'textWidth',
    'choices',
  ],
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='section-header'] {
  background: $rebrand-blue;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  &[data-inverse] {
    background: #fff;
  }
  &[data-modal-header] {
    background-color: $white-two;
    padding-top: 20px;
    @include whenScreenIs(sm) {
      padding-top: 32px;
    }
    @media only screen and (max-height: 535px) {
      padding: 8px;
    }
  }
  &[data-choices] {
    @include whenScreenIs(sm) {
      padding-top: 32px;
      padding-bottom: 32px;
    }
  }
  &[data-background='white'] {
    background-color: $white;
  }
  &[data-background='blue'] {
    background-color: $rebrand-blue;
    [data-element='text'] {
      &[data-modal-header] {
        color: $white;
      }
    }
  }
  &[data-background='transparent'] {
    background: transparent;
  }
  &:not([data-modal-header]) {
    @include whenScreenIs(sm) {
      padding: 24px;
    }
  }
  &[data-borderbottom] {
    @include whenScreenIs(mdx) {
      border-bottom: 1px solid $white-two;
    }
  }
  [data-element='text'] {
    font-family: $display-font;
    text-transform: uppercase;
    width: 70%;
    color: #fff;
    font-size: 28px;
    font-weight: normal;
    line-height: 1.33;
    text-align: center;
    @include whenScreenIs(sm) {
      font-size: 38px;
      line-height: 1.09;
      width: 328px;
    }
    &[data-width='lg'] {
      width: 80%;
    }
    &[data-modal-header] {
      color: $rebrand-orange;
      width: 85%;
    }
    &[data-inverse] {
      color: $rebrand-orange;
    }
    &[data-size='sm'] {
      @include whenScreenIs(sm) {
        width: 432px;
      }
    }
    &[data-size='md'] {
      font-size: 20px;
      width: 280px;
      @include whenScreenIs(sm) {
        width: 432px;
      }
    }
    &[data-size='lg'] {
      font-size: 22px;
      line-height: 24px;
      width: 100%;
    }
    &[data-size='xl'] {
      font-size: 22px;
      line-height: 24px;
      width: 100%;
      @include whenScreenIs(sm) {
        font-size: 24px;
        line-height: 1.14;
      }
    }
    &[data-width='lg'] {
      width: 90%;
    }
    &[data-success] {
      font-size: 28px;
      @include whenScreenIs(sm) {
        font-size: 38px;
      }
    }
  }
}
</style>
