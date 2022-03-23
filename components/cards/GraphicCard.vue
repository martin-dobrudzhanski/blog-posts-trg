<template>
  <!--
		- Renders in mobile or jumbotron - no desktop view set
		- For jumbotron - tile must have class 'jumbotron'
	 -->
  <div class="card graphic-card" :class="card.fields.color">
    <card-media
      id="img-responsive-graphic-card"
      class="graphic-card-asset"
      :isVideoAsset="isVideoAsset"
      :assetUrl="assetUrl"
      :assetAlt="assetAlt"
    />
    <div
      v-if="card.fields.textLine1 || hasButton"
      class="tile-content"
      :data-no-text="!card.fields.textLine1"
    >
      <h1
        class="heading"
        data-size="xl"
        data-weight="black"
        v-if="card.fields.textLine1"
      >
        {{ card.fields.textLine1 }}<br v-if="card.fields.textLine2" />
        {{ card.fields.textLine2 }}
      </h1>
      <dual-link
        v-if="hasButton"
        class="btn"
        :linkInfo="card.fields"
        :href="card.fields.buttonLink"
        :slugReplace="restaurant"
        :class="card.fields.color"
        data-size="xl"
        data-outline="true"
      >
        {{ card.fields.buttonText }}
      </dual-link>
    </div>
  </div>
</template>

<script>
import DualLink from '@/components/ui/DualLink';
import CardMedia from '@/components/cards/common/CardMedia';

import get from 'lodash.get';

export default {
  components: {
    DualLink,
    CardMedia
  },
  props: ['card', 'restaurant'],
  computed: {
    isVideoAsset() {
      return !!get(this.card, 'fields.video.fields.file.url');
    },
    assetUrl() {
      return this.isVideoAsset
        ? get(this.card, 'fields.video.fields.file.url')
        : get(this.card, 'fields.image.fields.file.url');
    },
    assetAlt() {
      return this.isVideoAsset
        ? get(this.card, 'fields.video.fields.description')
        : get(this.card, 'fields.image.fields.description');
    },
    hasButton() {
      return this.card.fields.buttonLink && this.card.fields.buttonText;
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.graphic-card {
  display: flex;
  flex-direction: column;
  .graphic-card-image {
    // this fixes an IE image sizing bug
    min-height: 1px;
  }
  .tile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    min-height: 100px;
    padding: 8px 16px 16px;
    h1 {
      width: 100%;
      margin: auto 0 8px;
    }
    .btn {
      margin: auto 0 auto;
    }
    @include whenScreenIs(mdx) {
      min-height: 150px;
      // height: $card-height-desktop;
      padding-top: 0;
      padding-bottom: 0;
      h1 {
        margin: 0 0 12px;
      }
      .btn {
        margin: 0 0 5px;
      }
    }
    &[data-no-text] {
      min-height: 72px;
      padding: 16px;
      .btn {
        margin: 0;
      }
      @include whenScreenIs(mdx) {
        min-height: 90px;
        .btn {
          margin: 0;
        }
      }
    }
    &[data-long-text] {
      padding-top: 20px;
      padding-bottom: 20px;
      .heading {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
