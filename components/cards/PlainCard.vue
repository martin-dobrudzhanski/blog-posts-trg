<template>
  <div class="card plain-card" :class="card.fields.color">
    <div class="desktop-card">
      <h1 class="heading" data-weight="normal" data-size="xl">
        {{ card.fields.title }}
      </h1>
      <p class="heading" data-weight="bold" data-size="sm">
        {{ card.fields.text }}
      </p>
    </div>

    <div class="mobile-card">
      <div class="card-header">
        <a :href="card.fields.buttonLink" target="_blank"
          ><img src="~assets/img/icons/app-icon.png"
        /></a>
        <h1 class="heading card-text" data-size="xl" data-weight="normal">
          <span class="underline"></span>{{ card.fields.title }}
        </h1>
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
  </div>
</template>

<script>
export default {
  props: ['card']
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.plain-card {
  height: 168px;
  margin: 16px;

  @include whenScreenIs(mdx) {
    margin: 0;
    height: $card-height-desktop;
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
      .heading {
        position: relative;
        span.underline {
          position: relative;
          &:after {
            content: url('~assets/img/icons/icon-underline.svg');
            position: absolute;
            top: 10px;
            left: -3px;
            animation: fadein 2s;
          }
        }
      }
    }
  }

  .desktop-card {
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: $white-three;
    h1.heading {
      color: $rebrand-orange;
    }
    p {
      color: $black;
      margin-bottom: 0;
    }
  }
}
</style>
