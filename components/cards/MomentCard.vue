<template>
  <div class="card moment-card" :class="card.fields.color">
    <div class="mobile-card">
      <div class="header-wrapper">
        <div class="text">
          <h1 class="heading" data-size="xl">
            {{ card.fields.textLine1 }}<br />
            {{ card.fields.textLine2 }}
          </h1>
        </div>
        <img v-if="imageUrl" :src="`${imageUrl}?h=192`" />
      </div>
      <dual-link
        :href="buttonLink(card.fields.buttonLink)"
        class="btn"
        data-size="sm"
        data-color="white"
        :linkInfo="card.fields"
      >
        {{ card.fields.buttonText }}
      </dual-link>
    </div>

    <div
      class="desktop-card"
      :class="{ 'has-subheading': card.fields.textLine2 }"
    >
      <div :class="imageUrl ? 'card-left' : 'card-full'">
        <h1 class="heading" data-size="xl">{{ card.fields.textLine1 }}</h1>
        <p
          class="heading"
          data-size="sm"
          v-if="card.fields.textLine2"
          data-weight="bold"
        >
          {{ card.fields.textLine2 }}
        </p>
        <dual-link
          :href="buttonLink(card.fields.buttonLink)"
          class="btn"
          data-size="sm"
          data-color="white"
          :linkInfo="card.fields"
        >
          {{ card.fields.buttonText }}
        </dual-link>
      </div>
      <div v-if="imageUrl" class="card-right">
        <img :src="`${imageUrl}?w=620`" />
      </div>
    </div>
  </div>
</template>

<script>
import DualLink from '@/components/ui/DualLink';

export default {
  components: {
    DualLink
  },
  props: ['card', 'restaurant'],
  computed: {
    imageUrl() {
      return (
        this.card &&
        this.card.fields &&
        this.card.fields.image &&
        this.card.fields.image.fields &&
        this.card.fields.image.fields.file &&
        this.card.fields.image.fields.file.url
      );
    }
  },
  methods: {
    buttonLink(link) {
      return link.replace('slug-replace', this.restaurant);
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/mixins/tiles.scss';

.moment-card {
  position: relative;
  overflow: hidden;
  height: 268px;
  @include whenScreenIs(mdx) {
    height: 300px;
  }

  .mobile-card {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 16px;

    .header-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .text {
        display: flex;
        flex-direction: column;

        .heading {
          padding: 1rem 0;
        }
      }

      img {
        @include fadeIn();
        height: 96px;
        margin-bottom: -3px;
        margin-right: -50px;
      }
    }
  }

  .desktop-card {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;

    .card-full {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 224px;
      padding: 0 32px;

      .heading {
        width: 100%;
      }

      h1 {
        margin-top: 40px;
      }

      p {
        color: #fff;
      }

      .btn {
        margin-top: auto;
        margin-bottom: 40px;
        width: auto;
      }
    }

    .card-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 304px;
      height: 100%;
      padding: 0 32px;

      .heading {
        width: 100%;
      }

      h1 {
        margin-top: 40px;
      }

      p {
        color: #fff;
      }

      .btn {
        margin-top: auto;
        margin-bottom: 40px;
        width: auto;
      }
    }

    &.has-subheading {
      .card-left {
        h1 {
          margin-top: 30px;
          margin-bottom: 12px;
        }

        p {
          color: #fff;
          margin-bottom: 5px;
        }

        .btn {
          margin-top: auto;
          margin-bottom: 25px;
        }
      }
    }

    .card-right {
      flex-grow: 1;

      img {
        width: 310px;
        position: absolute;
        right: -45px;
        bottom: -9px;
        @include fadeIn();
      }
    }
  }
}
</style>
