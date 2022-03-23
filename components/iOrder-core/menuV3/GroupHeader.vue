<template>
  <div data-component="group-header" :data-expanded="expanded">
    <h2 data-element="group-name" :data-bold="expanded" :data-size="size">
      {{ text }}:
    </h2>
  </div>
</template>

<script>
export default {
  props: ['handleClick', 'expanded', 'text', 'size', 'modal']
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='group-header'] {
  position: relative;
  display: flex;
  align-items: center;
  font-family: $navigation-font;
  color: $greyish-brown;
  font-size: 18px;
  line-height: 1.33;
  transition: 1s border-color ease;
  &[data-expanded] {
    border-color: #fff;
  }
  [data-element='icon'] {
    -webkit-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    &[data-size='md'] {
      @include whenScreenIs(mdx) {
        display: none;
      }
    }
    &.rotated {
      -webkit-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -o-transform: rotate(180deg);
      transform: rotate(180deg);
    }
  }
  [data-element='icon-container'] {
    position: absolute;
    display: inline-block;
    &:not([data-modal]) {
      @include whenScreenIs(mdx) {
        display: none;
      }
    }
    &[data-position='right'] {
      right: 16px;
      top: 13px;
    }
    &[data-modal] {
      right: 0;
    }
  }
  [data-element='group-name'] {
    font-family: $font;
    margin: 0.5rem 0;
    &[data-size='md'] {
      @include whenScreenIs(mdx) {
        font-size: 18px;
        font-weight: 800;
      }
    }
    &[data-bold] {
      font-weight: bold;
    }
  }
}
</style>
