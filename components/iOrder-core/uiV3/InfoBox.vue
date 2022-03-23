<template>
  <BaseLink
    class="info-box__wrapper"
    :class="`info-box__wrapper--bg-${backgroundColor}`"
    :disabled="!url"
    :to="url"
    :newTab="newTab"
  >
    <slot />
    <h2 class="info-box__heading">{{ heading }}</h2>
    <p class="info-box__copy">{{ copy }}</p>
    <slot name="post" />
  </BaseLink>
</template>

<script>
import BaseLink from '~/components/ui/BaseLink';
import { get } from 'lodash';

const BackgroundColours = {
  DARK: 'dark',
  GREY: 'grey',
  'LIGHT-GREY': 'light-grey',
  YELLOW: 'yellow',
  GOLDEN: 'golden',
  GREEN: 'green',
  'LIGHT-GREEN': 'light-green',
  RED: 'red',
  ORANGE: 'orange',
  PINK: 'pink',
  'LIGHT-PINK': 'light-pink',
  BLUE: 'blue',
  'LIGHT-BLUE': 'light-blue',
  'SKY-BLUE': 'sky-blue'
};

export default {
  components: { BaseLink },
  name: 'InfoBox',
  props: {
    heading: {
      type: String,
      default: null,
    },
    copy: {
      type: String,
      default: null,
    },
    backgroundColor: {
      type: String,
      default: BackgroundColours.YELLOW,
      validator: (val) => BackgroundColours[val.toUpperCase()] != null
    },
    link: {
      type: Object,
      default: null,
    },
  },
  computed: {
    newTab() {
      const { link } = this;
      return get(link, 'fields.newTab');
    },
    url() {
      const { link } = this;
      return get(link, 'fields.url');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.info-box__wrapper {
  border-radius: 10px;
  padding: 1rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  transition: box-shadow 0.3s ease-in-out;

  span {
    display: block;
  }

  &.base-link--clickable:hover {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  }

  @include whenScreenIs(mdx) {
    padding: 1rem;
  }

  @include whenScreenIs(lg) {
    padding: 1.5rem 2rem;
  }
  &--bg {
    &-dark {
      background-color: $greyish-brown;
    }
    &-grey {
      background-color: $brown-grey;
    }
    &-light-grey {
      background-color: $very-light-pink;
    }
    &-yellow {
      background-color: $mac-and-cheese;
    }
    &-golden {
      background-color: $light-mustard;
    }
    &-green {
      background-color: $sickly-yellow;
    }
    &-light-green {
      background-color: $light-beige;
    }
    &-red {
      background-color: $pale-red;
    }
    &-orange {
      background-color: $orange;
    }
    &-pink {
      background-color: $rebrand-pink;
    }
    &-light-pink {
      background-color: $light-pink;
    }
    &-blue {
      background-color: $peacock-blue;
    }
    &-light-blue {
      background-color: $pale-sky-blue;
    }
    &-sky-blue {
      background-color: $rebrand-teal;
    }
  }
}
.info-box__heading {
  font-size: 26px;
  font-family: $card-display-font;
  margin-bottom: 0.5rem;
  line-height: 0.96;
}
.info-box__heading,
.info-box__copy {
  color: $greyish-brown;

  .info-box__wrapper--bg-dark &,
  .info-box__wrapper--bg-blue & {
    color: $white;
  }
}
</style>
