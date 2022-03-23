<template>
  <aside class="menu-aside">
    <InfoBox
      v-for="(box, index) in boxes"
      :key="index"
      :heading="box.heading"
      :copy="box.copy"
      :backgroundColor="box.backgroundColor"
      :link="box.link"
    >
      <img
        v-if="box.image"
        class="info-box__icon"
        :src="boxImage(box.image)"
        alt="safety icon"
      />
    </InfoBox>
    <div class="menu-aside__container">
      <ul class="menu-aside__legend left">
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/new-icon.svg"
            alt="new icon"
          />
          <p>New</p>
        </li>
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/vegetarian-icon.svg"
            alt="vegetarian icon"
          />
          <p>Vegetarian</p>
        </li>
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/vegan-icon.svg"
            alt="vegan icon"
          />
          <p>Vegan</p>
        </li>
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/light-icon.svg"
            alt="light icon"
          />
          <p>A Little Lighter</p>
        </li>
      </ul>
      <ul class="menu-aside__legend right">
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/mild-icon.svg"
            alt="mild icon"
          />
          <p>Mild</p>
        </li>
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/hot-icon.svg"
            alt="hot icon"
          />
          <p>Hot</p>
        </li>
        <li class="menu-aside__legend__item">
          <img
            class="menu-aside__legend__icon"
            src="~/assets/img/iorder-coreV2/icons/volcano-icon.svg"
            alt="volcano icon"
          />
          <p>Volcano</p>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import InfoBox from '~/components/iOrder-core/uiV3/InfoBox';
import { get } from 'lodash';
export default {
  name: 'MenuAside',
  props: {
    boxes: {
      type: Array,
      default: null,
    },
  },
  components: {
    InfoBox,
  },
  methods: {
    boxImage(image) {
      const payload = get(image, 'fields.file.url');
      return payload;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.menu-aside {
  display: flex;
  flex-direction: column;

  @include whenScreenIs(mdx) {
    width: 400px;
  }

  /deep/ .info-box__wrapper {
    max-width: 100%;
    margin: 0 auto 1rem;

    @include whenScreenIs(xs) {
      max-width: 340px;
    }

    @include whenScreenIs(sm) {
      max-width: 340px;
    }

    @include whenScreenIs(mdx) {
      max-width: 100%;
      margin: 0 0 1rem;
      padding: 1.5rem 1rem;

      .info-box__heading {
        margin-bottom: 1rem;
      }
    }
  }

  &__container {
    display: flex;
  }
}
.menu-aside__legend {
  color: $greyish-brown;
  font-size: 14px;
  list-style: none;
  display: none;

  @include whenScreenIs(mdx) {
    display: block;
  }

  &.left {
    border-right: 2px dotted $rebrand-teal;
    padding-right: 1rem;
  }

  &.right {
    padding-left: 1rem;
  }
}
.menu-aside__legend__icon {
  width: 1.5rem;
  height: auto;
  margin-right: 0.5rem;
}
.menu-aside__legend__item {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}
.info-box__icon {
  width: auto;
  height: 2rem;
  display: none;
  margin-bottom: 1rem;

  @include whenScreenIs(mdx) {
    display: block;
  }
}
</style>
