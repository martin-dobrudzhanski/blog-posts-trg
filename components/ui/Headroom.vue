<template>
  <div :class="cls" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import raf from 'raf';
import { elScrolled } from '@/libs/templateHelpers.js';

function checkActions(states) {
  const direction = states.currentScrollY >= states.lastScrollY ? 'down' : 'up';
  const distanceScrolled = Math.abs(states.currentScrollY - states.lastScrollY);

  var action;

  // disabled the action on scroll on these pages.
  if (
    states.$route.name === 'restaurants-slug-takeaway-menu' ||
    states.$route.name === 'restaurants-slug-menu'
  ) {
    return;
  }

  // Scrolling down and past the offset.
  // Unpinned the header.
  if (
    direction === 'down' &&
    states.currentScrollY >= states.offset &&
    distanceScrolled > states.downTolerance
  ) {
    action = 'unpin';

    // Now, it's time to up.
    // Pin the header.
  } else if (
    (direction === 'up' && distanceScrolled > states.upTolerance) ||
    states.currentScrollY <= states.offset
  ) {
    action = 'pin';
  }

  return action;
}

function support3d() {
  const div = document.createElement('div');
  let ret = false;
  const properties = ['perspectiveProperty', 'WebkitPerspective'];

  for (let i = properties.length - 1; i >= 0; i--) {
    ret = ret || div.style[properties[i]] !== undefined;
  }

  if (ret) {
    const st = document.createElement('style');

    st.textContent =
      '#modernizr{width:0;height:0} @media (transform-3d),(-webkit-transform-3d){#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}';
    document.getElementsByTagName('head')[0].appendChild(st);
    div.id = 'modernizr';
    document.body.appendChild(div);

    ret = div.offsetWidth === 7 && div.offsetHeight === 18;

    st.parentNode.removeChild(st);
    div.parentNode.removeChild(div);
  }

  return ret;
}

const defaultCls = {
  pinned: 'headroom--pinned',
  unpinned: 'headroom--unpinned',
  top: 'headroom--top',
  notTop: 'headroom--not-top',
  bottom: 'headroom--bottom',
  notBottom: 'headroom--not-bottom',
  initial: 'headroom',
  takeoutMenu: 'headroom--not-sticky'
};

export default {
  name: 'vueHeadroom',

  data() {
    return {
      isTop: false,
      isNotTop: false,
      isBottom: false,
      isNotBottom: false,
      isPinned: false,
      isUnpinned: false,
      currentScrollY: 0,
      lastScrollY: 0,
      state: '',
      translate: 0,
      isSupport3d: false,
      isTakeoutSticky: true
    };
  },

  props: {
    scroller: {
      type: Function,
      default: () => window
    },

    disabled: {
      type: Boolean,
      default: false
    },

    upTolerance: {
      type: Number,
      default: 5
    },

    downTolerance: {
      type: Number,
      default: 0
    },

    speed: {
      type: Number,
      default: 250
    },

    easing: {
      type: String,
      default: 'ease-in-out'
    },

    zIndex: {
      type: Number,
      default: 9997
    },

    onPin: Function,
    onUnpin: Function,
    onTop: Function,
    onNotTop: Function,
    onBottom: Function,
    onNotBottom: Function,

    offset: {
      type: Number,
      default: 0
    },

    classes: {
      type: Object,
      default() {
        return defaultCls;
      }
    }
  },

  watch: {
    disabled(newVal) {
      if (newVal) {
        this.scroller().removeEventListener('scroll', this._handleScroll);
        this.pin();
      } else {
        this.scroller().addEventListener('scroll', this._handleScroll);
      }
    }
  },

  mounted() {
    this.isSupport3d = support3d();

    if (!this.disabled) {
      this.scroller().addEventListener('scroll', this._handleScroll);
    }

    // When headroom is mounted, call handleScroll to set initial state.
    this._handleScroll();
  },

  beforeDestroy() {
    this.scroller().removeEventListener('scroll', this._handleScroll);
  },

  computed: {
    style() {
      const styles = {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        'z-index': this.zIndex
      };

      // SSR cannot detect scroll position. To prevent flash when component mounted,
      // just add transition styles in browser.
      if (!this.$isServer) {
        styles.transition = this.isInTop
          ? `all ${this.speed}ms ${this.easing}`
          : null;
      }

      return styles;
    },

    clsOpts() {
      return {
        ...defaultCls,
        ...this.classes
      };
    },

    cls() {
      const cls = this.clsOpts;
      return this.disabled
        ? {}
        : {
            [cls.top]: this.isTop,
            [cls.notTop]: this.isNotTop,
            [cls.bottom]: this.isBottom,
            [cls.notBottom]: this.isNotBottom,
            [cls.pinned]: this.isPinned,
            [cls.unpinned]: this.isUnpinned,
            [cls.initial]: true,
            [cls.takeoutMenu]: !this.isTakeoutSticky
          };
    },

    isInTop() {
      return this.state === 'pinned' || this.state === 'unpinned';
    }
  },

  methods: {
    _getViewportHeight: () => {
      return (
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      );
    },

    _getElementPhysicalHeight: elm =>
      Math.max(elm.offsetHeight, elm.clientHeight),

    _getDocumentHeight: () => {
      const body = document.body;
      const documentElement = document.documentElement;

      return Math.max(
        body.scrollHeight,
        documentElement.scrollHeight,
        body.offsetHeight,
        documentElement.offsetHeight,
        body.clientHeight,
        documentElement.clientHeight
      );
    },

    _getElementHeight: elm =>
      Math.max(elm.scrollHeight, elm.offsetHeight, elm.clientHeight),

    _getScrollerPhysicalHeight() {
      const parent = this.scroller();

      return parent === window || parent === document.body
        ? this._getViewportHeight()
        : this._getElementPhysicalHeight(parent);
    },

    _getScrollerHeight() {
      const parent = this.scroller();

      return parent === window || parent === document.body
        ? this._getDocumentHeight()
        : this._getElementHeight(parent);
    },

    _isOutOfBound(currentScrollY) {
      const pastTop = currentScrollY < 0;

      const scrollerPhysicalHeight = this._getScrollerPhysicalHeight();
      const scrollerHeight = this._getScrollerHeight();

      const pastBottom =
        currentScrollY + scrollerPhysicalHeight > scrollerHeight;

      return pastTop || pastBottom;
    },

    _handleScroll() {
      raf(this.update);
    },

    _getScrollY() {
      let top;
      if (this.scroller().pageYOffset !== undefined) {
        top = this.scroller().pageYOffset;
      } else if (this.scroller().scrollTop !== undefined) {
        top = this.scroller().scrollTop;
      } else {
        top = (
          document.documentElement ||
          document.body.parentNode ||
          document.body
        ).scrollTop;
      }
      return top;
    },

    update() {
      this.currentScrollY = this._getScrollY();

      if (this._isOutOfBound(this.currentScrollY)) {
        return;
      }

      if (this.currentScrollY <= this.offset) {
        this.top();
      } else {
        this.notTop();
      }

      if (
        this.currentScrollY + this._getViewportHeight() >=
        this._getScrollerHeight()
      ) {
        this.bottom();
      } else {
        this.notBottom();
      }

      const action = checkActions(this);

      if (action === 'pin') {
        this.pin();
      } else if (action === 'unpin') {
        this.unpin();
      }

      if (this.$route.name === 'restaurants-slug-takeaway-menu') {
        const $el = document.querySelector('[data-component="hero__wrapper"]');
        this.isTakeoutSticky = !elScrolled($el, this.currentScrollY);
      }

      this.lastScrollY = this.currentScrollY;
    },

    top() {
      if (!this.isTop) {
        this.isTop = true;
        this.isNotTop = false;
        this.onTop && this.onTop();
      }
    },

    notTop() {
      if (!this.isNotTop) {
        this.isTop = false;
        this.isNotTop = true;
        this.onNotTop && this.onNotTop();
      }
    },

    bottom() {
      if (!this.isBottom) {
        this.isBottom = true;
        this.isNotBottom = false;
        this.onBottom && this.onBottom();
      }
    },

    notBottom() {
      if (!this.isNotBottom) {
        this.isNotBottom = true;
        this.isBottom = false;
        this.onNotBottom && this.onNotBottom();
      }
    },

    pin() {
      if (!this.isPinned) {
        this.isPinned = true;
        this.isUnpinned = false;
        this.onPin && this.onPin();
        this.$emit('pin');
        this.translate = 0;
        setTimeout(() => {
          this.state = 'pinned';
        }, 0);
      }
    },

    unpin() {
      if (this.isPinned || !this.isUnpinned) {
        this.isUnpinned = true;
        this.isPinned = false;
        this.onUnpin && this.onUnpin();
        this.$emit('unpin');
        this.translate = '-100%';
        setTimeout(() => {
          this.state = 'unpinned';
        }, 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.headroom--not-sticky {
  @media (max-width: 1024px) {
    position: absolute !important;
  }
}
</style>
