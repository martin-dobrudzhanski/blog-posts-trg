<template>
  <div
    :class="[
      'media-carousel-card',
      {
        'media-carousel-card--wide': wide,
        'media-carousel-card--no-cta': activeSlide && !activeSlide.cta
      }
    ]"
  >
    <section
      v-swiper:swiper="swiperOptions"
      class="media-carousel-card__carousel-wrapper"
    >
      <div class="swiper-wrapper media-carousel-card__carousel">
        <div
          v-for="(slide, index) in formattedSlides"
          :key="index"
          class="swiper-slide media-carousel-card__slide"
        >
          <img
            v-if="slide.media.type.includes('image')"
            class="media-carousel-card__slide-media media-carousel-card__slide-media--image"
            :src="slide.media.src"
          />
          <video
            v-else-if="slide.media.type.includes('video')"
            autoplay
            loop
            playsinline
            muted
            class="media-carousel-card__slide-media media-carousel-card__slide-media--video"
            :src="slide.media.src"
          >
            <source :src="slide.media.src" :type="slide.media.type" />
          </video>
        </div>
      </div>
      <div class="swiper-pagination media-carousel-card__pagination" />
    </section>
    <div
      v-if="activeSlide && activeSlide.cta"
      class="media-carousel-card__slide-cta-wrapper"
    >
      <BaseButton
        size="medium"
        class="media-carousel-card__slide-cta"
        :colour="activeSlide.ctaColour"
        :to="activeSlide.cta.url"
        :new-tab="activeSlide.cta.newTab"
      >
        {{ activeSlide.cta.text }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css';
import get from 'lodash.get';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'MediaCarouselCard',
  components: { BaseButton },
  inheritAttrs: false,
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeSlideIndex: 0
    };
  },
  computed: {
    swiperOptions() {
      const defaultOptions = {
        slidesPerView: 1
      };

      if (this.hasMultipleSlides) {
        return {
          ...defaultOptions,
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          autoplayDisableOnInteraction: false,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        };
      }

      return {
        ...defaultOptions,
        autoplay: false,
        pagination: false,
        allowTouchMove: false
      };
    },
    formattedSlides() {
      const CtaColour = {
        GREYISH_BROWN: 'greyish-brown',
        MAC_AND_CHEESE: 'mac-and-cheese'
      };

      const formattedSlides = (this.slides || []).map(slide => {
        const media = get(slide, 'fields.media.fields', {});
        const cta = get(slide, 'fields.cta.fields', null);
        const ctaBGColour =
          CtaColour[
            get(slide, 'fields.ctaColour', 'greyish-brown').toUpperCase()
          ];
        const mediaType = media.file.contentType;
        const mediaSrc = media.file.url;

        return {
          media: {
            type: mediaType,
            src: mediaSrc
          },
          cta,
          ctaBGColour
        };
      });

      return formattedSlides;
    },
    activeSlide() {
      return this.formattedSlides[this.activeSlideIndex];
    },
    hasMultipleSlides() {
      return this.formattedSlides.length > 1;
    }
  },
  mounted() {
    const vm = this;
    this.swiper.on('slideChange', function() {
      vm.activeSlideIndex = this.realIndex;
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.media-carousel-card {
  position: relative;
  width: 100%;
  padding-top: 100%; // 1:1 aspect ratio
  background-color: $white;

  @include whenScreenIs(mdx) {
    padding-top: 66.66%; // 3:2 aspect ratio

    &--wide {
      padding-top: 30%; // 24:7 aspect ratio
    }
  }

  &--no-cta {
    .media-carousel-card__pagination {
      bottom: 1rem;

      @include whenScreenIs(mdx) {
        bottom: 2rem;
      }
    }
  }

  &,
  &__carousel-wrapper {
    border-radius: 2rem;
  }

  &__carousel-wrapper,
  &__carousel,
  &__slide {
    width: 100%;
    height: 100%;
  }

  &__carousel-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__slide-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__pagination {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
  }

  &__slide-cta-wrapper {
    z-index: 1;
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);

    @include whenScreenIs(mdx) {
      bottom: -1.25rem;
    }
  }

  & &__slide-cta {
    white-space: nowrap;

    @include whenScreenIs(mdx) {
      padding: 0 2rem;
    }

    @include whenScreenIs(lg) {
      padding: 0 2.5rem;
    }
  }
}
</style>

<style lang="scss">
@import '~assets/css/variables.scss';

.media-carousel-card__pagination {
  .swiper-pagination-bullet {
    background-color: $white;
    margin: 0 2px !important;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: $mac-and-cheese;
  }
}
</style>
