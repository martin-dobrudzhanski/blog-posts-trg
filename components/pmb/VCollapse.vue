<template>
  <div class="v-collapse">
    <button @click.stop="handleExpand" class="v-collapse__button">
      <span v-if="!expanded">{{ expandText || 'View more' }}</span>
      <span v-if="expanded">{{
        collapseText || expandText || 'View more'
      }}</span>
      <img
        src="@/assets/img/pmb/down.svg"
        alt="arrow"
        class="v-collapse__arrow"
        :class="{ '--expanded': expanded }"
      />
    </button>
    <div class="v-collapse__items">
      <transition
        name="staggered-fade"
        tag="div"
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div v-show="expanded">
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    expandText: {
      type: String,
      default: 'View more'
    },
    collapseText: {
      type: String,
      default: null
    }
  },
  data: () => ({
    expanded: false
  }),
  methods: {
    handleExpand() {
      this.expanded = !this.expanded
    },
    beforeEnter(el) {
      const array = [...el.children]
      array.forEach((item, index) => {
        item.style.opacity = 0
        item.style.height = 0
        item.style.overflow = 'hidden'
      })
    },
    enter(el, done) {
      const array = [...el.children]
      array.forEach((item, index) => {
        const delay = index * 150
        setTimeout(() => {
          this.$velocity(item, { opacity: 1, height: '100%' })
        }, delay)
      })
    },
    leave(el, done) {
      const array = [...el.children]
      array.forEach((item, index) => {
        const delay = (array.length - index) * 150
        setTimeout(() => {
          this.$velocity(item, { opacity: 0, height: 0 })
        }, delay)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.v-collapse {
  width: 100%;

  span {
    color: #2f2f2f;
    font-size: 16px;
    font-weight: 500;
  }

  img {
    width: 16px;
  }

  li {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__button {
    align-items: center;
    background-color: transparent;
    border: 0;
    display: flex;
    height: auto;
    justify-content: space-between;
    margin: 4px 0;
    outline: 0;
    padding: 0;

    span {
      color: $grey;
      font-size: 14px;
      font-weight: normal;
      line-height: 1;
      margin-right: 4px;
    }
  }

  &__arrow {
    transition: transform 0.5s;

    &.--expanded {
      transform: rotate(-180deg);
    }
  }
}
</style>
