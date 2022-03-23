<template>
  <div class="card slide-card">
    <div
      class="card-top"
      :style="{ backgroundImage: `url(${imgUrl}?w=600)` }"
    ></div>
    <div class="card-bottom" :class="card.fields.color">
      <div class="heading-container">
        <h1 class="heading card-text" data-size="xl" data-weight="normal">
          {{ card.fields.title }}
        </h1>
      </div>
      <dual-link
        v-if="card.fields.buttonLink"
        class="btn"
        data-size="md"
        data-color="white"
        :linkInfo="card.fields"
        :href="card.fields.buttonLink"
      >
        {{ card.fields.buttonText }}
      </dual-link>
    </div>
  </div>
</template>

<script>
import DualLink from '@/components/ui/DualLink';

export default {
  components: {
    DualLink
  },
  props: ['card'],
  computed: {
    imgUrl() {
      return (
        this.card &&
        this.card.fields &&
        this.card.fields.image &&
        this.card.fields.image.fields &&
        this.card.fields.image.fields.file &&
        this.card.fields.image.fields.file.url
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/mixins/tiles.scss';

.slide-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;

  .card-top {
    width: 100%;
    height: 40%;
    background-position: center;
    background-size: cover;
    @include whenScreenIs(mdx) {
      height: 50%;
    }
  }

  .card-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60%;
    padding: 0 2rem;
    @include whenScreenIs(mdx) {
      height: 50%;
      justify-content: space-around;
      padding: 1rem 2rem;
    }

    .heading-container {
      width: 100%;
      padding-bottom: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;

      h1 {
        margin-bottom: 0;
        width: 100%;
        @include whenScreenIs(mdx) {
          font-size: 38px;
          line-height: 0.88;
        }
      }
    }

    &.green {
      @include tileFormat($color: bright-green);
    }

    &.orange {
      @include tileFormat($color: orange);
    }

    &.blue {
      @include tileFormat($color: blue);
    }
  }

  @include whenScreenIs(mdx) {
    height: 100%;
    .card-bottom {
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.5rem;
        min-height: 40px;
      }
    }
  }
}
</style>
