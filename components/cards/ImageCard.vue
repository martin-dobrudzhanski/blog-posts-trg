<template>
  <!--
		- Renders in mobile or jumbotron - no desktop view set
		- For jumbotron - tile must have class 'jumbotron'
	 -->
  <div class="card image-card">
    <dual-link
      :linkInfo="card.fields"
      :href="card.fields.linkUrl"
      :slugReplace="restaurant"
      class="image-link"
    >
      <card-media
        :isVideoAsset="isVideoAsset"
        :assetUrl="assetUrl"
        :assetAlt="assetAlt"
      />
    </dual-link>
  </div>
</template>

<script>
import DualLink from '@/components/ui/DualLink'
import CardMedia from '@/components/cards/common/CardMedia'
import get from 'lodash.get'

export default {
  components: {
    DualLink,
    CardMedia
  },
  props: ['card', 'restaurant'],
  computed: {
    isVideoAsset() {
      return !!get(this.card, 'fields.video.fields.file.url')
    },
    assetUrl() {
      return this.isVideoAsset
        ? get(this.card, 'fields.video.fields.file.url')
        : get(this.card, 'fields.image.fields.file.url')
    },
    assetAlt() {
      return this.isVideoAsset
        ? get(this.card, 'fields.video.fields.description')
        : get(this.card, 'fields.image.fields.description')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.image-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .image-link {
    // this fixes an IE image sizing bug
    min-height: 1px;
    .image-card-image {
      display: block;
    }
  }
}
</style>
