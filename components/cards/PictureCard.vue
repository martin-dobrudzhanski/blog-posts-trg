<template>
  <div class="card picture-card" :style="getStyle">
    <dual-link
      class="btn"
      v-if="card.fields.buttonLink && card.fields.buttonText"
      :linkInfo="card.fields"
      :href="card.fields.buttonLink"
      data-size="md"
    >
      {{ card.fields.buttonText }}
    </dual-link>
  </div>
</template>

<script>
import DualLink from '@/components/ui/DualLink';

export default {
  props: ['card'],
  components: {
    DualLink
  },
  computed: {
    getStyle() {
      const url =
        this.card.fields &&
        this.card.fields.image &&
        this.card.fields.image.fields &&
        this.card.fields.image.fields.file &&
        this.card.fields.image.fields.file.url;
      return {
        'background-image': 'url(' + url + '?w=950&q=100)'
      };
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/mixins/tiles.scss';

.picture-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: $card-height-desktop;
  padding: 32px 16px;
  background-position: center;
  background-size: cover;
  @include whenScreenIs(mdx) {
    padding: 48px;
  }
  .btn {
    margin-top: 16px;
  }
}
</style>
