<template>
  <div
    id="menuTabsContainer"
    ref="wrapper"
    class="menu-tabs__wrapper"
    :class="{ sticky: isSticky, relative: !isSticky, fixed: isFixed }"
  >
    <div class="menu-tabs__container" :class="{ centered: withSelect }">
      <ul
        class="menu-tabs"
        ref="menuRef"
        @scroll="onScroll"
        :class="{
          'not-scrollable': withSelect
        }"
      >
        <li
          @click="$emit('selected', item)"
          class="menu-tabs__item"
          :class="{
            'menu-tabs__item--selected': item.groupId === selected.groupId
          }"
          v-for="(item, index) in items"
          :key="index"
          :title="item.groupName"
          :ref="`menuItem_${index}`"
          :data-index="index"
        >
          {{ item.groupName }}
        </li>
      </ul>
      <transition-group v-if="!withSelect" name="fade">
        <div
          v-show="hasLeftArrow"
          key="left"
          class="menu-tabs__arrow left"
        ></div>
        <div
          v-show="hasRightArrow"
          key="right"
          class="menu-tabs__arrow right"
        ></div>
      </transition-group>
      <div v-if="withSelect" class="menu-tabs__select--wrapper">
        <select
          ref="catSelect"
          @change="setCategoryTab"
          class="menu-tabs__select"
          :class="{
            'min-size': isInitial
          }"
        >
          <option :selected="!categoriesList || !categoriesList.length"
            >More</option
          >
          <option
            v-for="(option, index) in categoriesList"
            :key="index"
            :selected="selected.groupName === option"
            >{{ option }}</option
          >
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuTabs',
  props: {
    items: {
      type: Array,
      required: true
    },
    selected: {
      type: [Object],
      default: null
    },
    isSticky: {
      type: Boolean,
      default: false
    },
    withSelect: {
      type: Boolean,
      default: false
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasLeftArrow: false,
      hasRightArrow: false,
      categoriesList: [],
      isInitial: true
    };
  },
  mounted() {
    this.checkArrowVisability();
    this.onResize(undefined, true);
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  computed: {
    menuLabel() {
      return this.$route.params.menuLabel === 'drinks' ? 'drinks' : 'food';
    }
  },
  methods: {
    onScroll({ target: { scrollLeft, clientWidth, scrollWidth } }) {
      if (!this.withSelect) {
        this.hasRightArrow = scrollLeft + clientWidth < scrollWidth;
        this.hasLeftArrow = scrollLeft > 0;
      }
    },
    onResize(e, isInitial = false) {
      this.$nextTick(() => {
        const menuRef = this.$refs.menuRef.getBoundingClientRect();
        this.isInitial = isInitial;
        for (const key in this.$refs) {
          if (this.$refs[key] && this.$refs[key].length) {
            const categoryEl = this.$refs[key][0];
            const rectangle = categoryEl.getBoundingClientRect();
            const margin = isInitial ? 20 : 0;
            if (rectangle.right) {
              if (rectangle.right + margin >= menuRef.right) {
                categoryEl.classList.add('hidden');
                if (!this.categoriesList.includes(categoryEl.innerText))
                  if (!isInitial) {
                    this.categoriesList.unshift(categoryEl.innerText);
                  } else {
                    this.categoriesList.push(categoryEl.innerText);
                  }
              } else {
                categoryEl.classList.remove('hidden');
                var index = this.categoriesList.indexOf(categoryEl.innerText);
                if (index !== -1) {
                  this.categoriesList.splice(index, 1);
                }
              }
            }
          }
        }
      });
    },
    setCategoryTab(e) {
      if (e.target.value !== 'More') {
        if (this.items && this.items.length) {
          const item = this.items.find(it => it.groupName === e.target.value);
          if (item) {
            this.$emit('selected', item);
          }
        }
      }
    },
    selectItem(item) {
      this.$emit('selected', item);
    },
    selectNextItem() {
      if (
        this.selected &&
        this.selected.groupId &&
        this.items &&
        this.items.length
      ) {
        const isSelectedItem = element =>
          element.groupId === this.selected.groupId;
        const selectedItemIndex = this.items.findIndex(isSelectedItem);
        this.selectItem(this.items[selectedItemIndex + 1] || this.items[0]);
      }
    },
    checkArrowVisability() {
      const $menu = this.$refs.menuRef;

      if ($menu) this.hasRightArrow = $menu.scrollWidth > $menu.offsetWidth;
    }
  },
  watch: {
    menuLabel: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        setTimeout(() => this.checkArrowVisability(), 150);
      }
    },
    selected: function(newVal, oldVal) {
      this.onResize();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.menu-tabs {
  width: 100%;
  background-color: $light-pink;
  display: flex;
  overflow-x: auto;
  align-items: center;
  height: 3.5rem;
  position: relative;
  justify-content: space-between;
  &.not-scrollable {
    overflow-x: hidden;
    flex-wrap: nowrap;
  }
}
.menu-tabs__wrapper {
  background-color: $light-pink;

  &.fixed {
    position: fixed;
    width: 100%;
    z-index: 100;
    top: 139px;
    @include whenScreenIs(xs) {
      top: 80px;
    }
  }
}
.menu-tabs__container {
  max-width: $max-width-desktop;
  display: flex;
  justify-content: center;
  margin: auto;
  &.centered {
    align-items: center;
  }
}
.menu-tabs__item {
  color: $greyish-brown;
  display: inline-block;
  white-space: nowrap;
  font-family: $navigation-font;
  font-size: 18px;
  margin-right: 30px;
  text-decoration-color: transparent;
  transition: color 0.25s ease-in-out, text-decoration-color 0.25s ease-in-out;

  &.hidden {
    color: $light-pink;
  }

  &:before {
    display: block;
    content: attr(title);
    font-weight: bold;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }

  &:first-child {
    margin-left: 16px;
  }

  &:hover {
    &:not(.hidden) {
      cursor: pointer;
      border-bottom: 2px solid $sky-blue;
    }
  }

  &--selected {
    &:not(.hidden) {
      border-bottom: 2px solid $sky-blue;
    }
  }
}
.menu-tabs__arrow {
  position: absolute;
  width: 40px;
  height: 41px;
  top: 0;

  &.left {
    left: 0;
    background-image: linear-gradient(
      -90deg,
      rgba(250, 224, 229, 0) 14%,
      $light-pink 39%
    );
  }

  &.right {
    right: 0;
    background-image: linear-gradient(
      90deg,
      rgba(250, 224, 229, 0) 14%,
      $light-pink 39%
    );
  }
}
.sticky {
  position: sticky;
  z-index: 98;
  top: 129px;
}
.relative {
  position: relative;
}
.menu-tabs__select {
  display: block;
  height: 2.25rem;
  border-radius: 1.85rem;
  line-height: 1.5;
  padding: 0 40px 0 1rem;
  appearance: none;
  color: $greyish-brown;
  background-color: $true-white;
  border: none;
  font-family: $font;
  font-size: 0.875rem;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  &.min-size {
    width: 150px;
  }

  &--wrapper {
    position: relative;
    margin-right: 1rem;
    &:after {
      content: '';
      position: absolute;
      right: 1rem;
      top: 50%;
      width: 1rem;
      height: 1rem;
      transform: translateY(-50%);
      background: url('~/assets/img/icons/icon-down-arrow-grey.svg') center
        no-repeat;
    }
  }

  &::placeholder {
    color: rgba($true-black, 0.625);
  }

  &:disabled {
    opacity: 0.3;
  }
}
</style>
