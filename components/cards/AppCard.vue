<template>
  <div class="card app-card">
    <div class="mobile-card" :class="card.fields.color">
      <div class="card-header">
        <a :href="card.fields.buttonLink" target="_blank"
          ><img :src="`${imgUrl}?w=144&h=144`"
        /></a>
        <div class="text">
          <h1 class="heading card-text" data-size="xl" data-weight="normal">
            {{ card.fields.title }}
          </h1>
          <p
            v-if="card.fields.text"
            class="heading"
            data-weight="bold"
            data-size="sm"
          >
            {{ card.fields.text }}
          </p>
        </div>
      </div>
      <a
        class="btn"
        :href="card.fields.buttonLink"
        data-size="md"
        target="_blank"
      >
        {{ card.fields.buttonText }}
      </a>
    </div>

    <div
      class="desktop-card"
      :class="card.fields.color"
      :style="{ backgroundImage: `url(${imgUrl}?w=480&h=480&q=100)` }"
    >
      <div class="card-text" :class="card.fields.color">
        <h1 class="heading" data-size="xl" data-weight="normal">
          {{ card.fields.title }}
        </h1>
        <p class="heading" data-size="sm" data-weight="bold">
          {{ card.fields.text }}
        </p>
        <nuxt-link
          class="btn"
          v-if="card.fields.buttonLink"
          data-size="md"
          :to="card.fields.buttonLink"
        >
          {{ card.fields.buttonText }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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

.app-card {
  height: auto;
  margin: 16px;
  @include whenScreenIs(mdx) {
    height: 280px;
    margin: 0;
  }
  .mobile-card {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .card-header {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin: 0 0 18px;
      a {
        display: block;
        width: 72px;
        height: 72px;
        flex-shrink: 0;
        margin: 0 16px 0 8px;
        img {
          display: block;
          width: 72px;
          height: 72px;
          min-width: none;
        }
      }
      .text {
        h1.heading {
          position: relative;
          color: $rebrand-orange;
          margin: 0;
        }
        p {
          color: $black;
        }
      }
    }
  }
  .desktop-card {
    @include fadeIn();
    display: none;
    @include whenScreenIs(mdx) {
      display: flex;
    }
    height: 100%;
    align-items: center;
    justify-content: center;
    background-position: center;
    background-size: cover;
    .card-text {
      width: 65%;
      height: 96px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 16px;
      .heading {
        width: 100%;
        margin: 0 0 10px;
      }
      .btn {
        width: 100%;
      }
      &.green {
        @include tileFormat($color: bright-green, $opacity: 0.8);
      }
      &.orange {
        @include tileFormat($color: orange, $opacity: 0.8);
      }
      &.blue {
        @include tileFormat($color: blue, $opacity: 0.8);
      }
    }
  }
}
</style>
