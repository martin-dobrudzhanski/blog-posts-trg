<template>
  <div class="swiper-slide slide-card__slide">
    <img
      v-if="parsedSlide.media.type.includes('image')"
      class="slide-card__slide-media slide-card__slide-media--image"
      :src="parsedSlide.media.src"
    />
    <video
      v-else-if="parsedSlide.media.type.includes('video')"
      autoplay
      loop
      playsinline
      muted
      class="slide-card__slide-media slide-card__slide-media--video"
      :src="parsedSlide.media.src"
    />
    <div
      class="
              slide-card__slide-gradient slide-card__slide-gradient--sm
            "
      :style="{
        backgroundColor: `rgba(0,0,0,${parsedSlide.opacity})`
      }"
    />
    <div
      class="
              slide-card__slide-gradient slide-card__slide-gradient--lg
            "
      :style="{
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,${parsedSlide.opacity}), rgba(0,0,0,0))`
      }"
    />
    <div class="slide-card__slide-overlay">
      <div class="slide-card__slide-content-wrapper">
        <div class="slide-card__slide-content">
          <div class="slide-card__content-box">
            <h1
              v-if="parsedSlide.heading"
              class="line-height-reset slide-card__slide-heading"
              v-text="parsedSlide.heading"
            />
            <p class="slide-card__slide-text">{{ parsedSlide.text }}</p>
          </div>
          <div class="slide-card__content-box">
            <div class="slide-card__countdown" v-if="showCountdown">
              <no-ssr>
                <vac :end-time="endTime">
                  <div
                    class="timeobj__container"
                    slot="process"
                    slot-scope="{ timeObj }"
                  >
                    <span class="timeobj">
                      <span class="timeobj__chunk-number">{{
                        timeObj.d < 10 ? '0' + timeObj.d : timeObj.d
                      }}</span
                      ><span class="timeobj__chunk-text">DAYS</span></span
                    >
                    <span class="timeobj-pipe"></span>
                    <span class="timeobj"
                      ><span class="timeobj__chunk-number">{{ timeObj.h }}</span
                      ><span class="timeobj__chunk-text">HRS</span></span
                    >
                    <span class="timeobj-pipe"></span>
                    <span class="timeobj"
                      ><span class="timeobj__chunk-number">{{ timeObj.m }}</span
                      ><span class="timeobj__chunk-text">MIN</span></span
                    >
                    <span class="timeobj-pipe"></span>
                    <span class="timeobj"
                      ><span class="timeobj__chunk-number">{{ timeObj.s }}</span
                      ><span class="timeobj__chunk-text">SEC</span></span
                    >
                  </div>
                </vac>
              </no-ssr>
            </div>
          </div>
        </div>
        <div v-if="parsedSlide.cta" class="slide-card__slide-cta__wrapper">
          <BaseButton
            bg_colour="mac-and-cheese"
            colour="greyish-brown"
            size="medium"
            :to="parsedSlide.cta.url"
            :new-tab="parsedSlide.cta.newTab"
            class="slide-card__slide-cta"
            :class="{ 'slide-card__slide-cta--on-countdown': !showCountdown }"
          >
            {{ parsedSlide.cta.text }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  namne: 'SliderCard',
  components: {
    BaseButton
  },
  props: {
    slide: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showCountdown: false
    };
  },
  computed: {
    endTime() {
      const endDate = new Date(this.parsedSlide.endDate);
      return endDate.getTime();
    },
    parsedSlide() {
      const slide = this.slide;
      const heading = get(slide, 'fields.heading');
      const text = get(slide, 'fields.text');
      const cta = get(slide, 'fields.cta.fields');
      const mediaType = get(slide, 'fields.media.fields.file.contentType', '');
      const mediaSrc = get(slide, 'fields.media.fields.file.url', '');
      const opacity = get(slide, 'fields.gradient');
      const startDate = get(slide, 'fields.startDate');
      const endDate = get(slide, 'fields.endDate');

      return {
        heading,
        text,
        cta,
        media: {
          type: mediaType,
          src: mediaSrc
        },
        opacity,
        startDate,
        endDate
      };
    }
  },
  mounted() {
    const now = new Date(Date.now());
    const startDate =
      this.parsedSlide.startDate && new Date(this.parsedSlide.startDate);
    const endDate =
      this.parsedSlide.endDate && new Date(this.parsedSlide.endDate);

    if (startDate && endDate) {
      if (
        now.getTime() >= startDate.getTime() &&
        startDate.getTime() <= endDate.getTime() &&
        now.getTime() <= endDate.getTime()
      ) {
        this.showCountdown = true;
      }
    } else if (!startDate && endDate) {
      if (now.getTime() <= endDate.getTime()) {
        this.showCountdown = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.slide-card {
  @include whenScreenIs(mdx) {
    height: 20rem;
  }

  &__slide {
    width: 100%;
    height: 100%;
  }

  &__slide {
    position: relative;
    background-color: black;
  }

  &__slide-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__slide-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &--sm {
      @include whenScreenIs(lg) {
        display: none;
      }
    }

    &--lg {
      display: none;

      @include whenScreenIs(lg) {
        display: block;
      }
    }
  }

  &__slide-overlay {
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__slide-content-wrapper {
    box-sizing: border-box;
    padding: 0 1.15rem;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }

  &__slide-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    color: $white;

    @include whenScreenIs(tablet) {
      justify-content: center;
      text-align: center;
    }
  }

  &__slide-content,
  &__slide-cta__wrapper {
    width: 100%;
    margin: 0 auto;
  }

  &__slide-heading {
    font-family: $display-font;
    font-size: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    text-shadow: 0 0 2rem rgba($true-black, 0.7);

    @include whenScreenIs(lg) {
      text-align: left;
    }
  }

  &__slide-text {
    margin: 1rem auto 0;
    max-width: 340px;
    font-family: $navigation-font;
    font-size: 18px;

    @include whenScreenIs(lg) {
      margin: 1rem 0 0;
      text-align: left;
    }
  }

  &__slide-cta {
    max-width: 10rem;

    &--on-countdown {
      margin-top: 2.5rem;
    }
    @include whenScreenIs(tablet) {
      margin: 2.5rem auto;
    }
  }

  &__countdown {
    font-size: 105px;
    text-align: right;
    line-height: 0.9;
    margin-bottom: 40px;

    @include whenScreenIs(xs) {
      margin: 30px 0;
    }

    @include whenScreenIs(tablet) {
      margin: 40px 0;
    }
    .timeobj__container {
      display: flex;
    }
    .timeobj {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &-pipe {
        width: 3px;
        height: 90px;
        position: relative;
        display: inline-block;
        background: #fff;
        top: 35px;
        margin: 0 30px;

        @include whenScreenIs(xs) {
          width: 2px;
          height: 60px;
          position: relative;
          top: 20px;
          margin: 0 20px;
        }
      }

      &__chunk-number,
      &__chunk-text {
        font-family: $heading-font;
      }

      &__chunk-number {
        @include whenScreenIs(xs) {
          font-size: 67px;
        }
      }

      &__chunk-text {
        line-height: 0.88;
        font-size: 40px;

        @include whenScreenIs(xs) {
          font-size: 23px;
        }
      }
    }
  }
}
</style>

<style lang="scss"></style>
