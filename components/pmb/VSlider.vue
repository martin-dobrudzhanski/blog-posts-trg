<template>
  <div class="v-slider">
    <transition
      name="slide"
      tag="div"
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      class="v-slider__content"
    >
      <slot></slot>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    currentIndex: 0
  }),
  methods: {
    nextSlide() {
      this.currentIndex += 1
    },
    beforeEnter(el) {
      this.$velocity(el, { opacity: 0, translateX: '20%' })
    },
    enter(el, done) {
      this.$velocity(el, { opacity: 1, translateX: '0%' }, { complete: done })
    },
    leave(el, done) {
      this.$velocity(el, { opacity: 0, translateX: '-20%' }, { complete: done })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.v-slider {
  // display: flex;
  flex: 1;
  overflow: hidden;
  // width: 100%;
  // height: 100%;

  &__content {
    display: block;
  }
}
</style>
