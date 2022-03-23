<template>
  <div ref="heroCarousel" class="hero-carousel">
    <section
      v-swiper:swiper="swiperOptions"
      class="hero-carousel__carousel-wrapper"
    >
      <div class="swiper-wrapper hero-carousel__carousel">
        <SliderCard
          v-for="(slide, index) in slides"
          :key="index"
          :slide="slide"
        />
      </div>
      <div class="swiper-pagination hero-carousel__pagination" />
    </section>
    <button class="button-reset hero-carousel__scroll-cta" @click="scrollBelow">
      <img src="@/assets/img/icons/icon-arrow-back-white.svg" alt="Scroll" />
    </button>
  </div>
</template>

<script>
import SliderCard from './SliderCard.vue';
import 'swiper/dist/css/swiper.css';
import { gsap } from 'gsap';

export default {
  name: 'HeroCarousel',
  components: { SliderCard },
  props: {
    slides: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    swiperOptions() {
      const defaultOptions = {
        slidesPerView: 1
      };

      if (this.hasMultipleSlides) {
        const vm = this;
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
          },
          on: {
            reachEnd() {
              const hasEndDate = vm.slides.some(s => 'endDate' in s.fields);
              if (hasEndDate) {
                vm.swiper.slideToLoop(0);
                vm.swiper.loop = true;
              }
            }
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
    hasMultipleSlides() {
      return this.slides.length > 1;
    }
  },
  methods: {
    scrollBelow() {
      const bottomOffset =
        this.$refs.heroCarousel.offsetTop +
        this.$refs.heroCarousel.offsetHeight;
      gsap.to(window, {
        scrollTo: bottomOffset,
        ease: 'Power4.easeInOut'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.hero-carousel {
  position: relative;
  width: 100%;
  height: calc(
    var(--innerHeight) - #{$header-nav-height-mobile} - #{$bottom-nav-height-mobile}
  );
  background-color: $grey;

  @include whenScreenIs(mdx) {
    height: 20rem;
  }
  &__carousel-wrapper {
    width: 100%;
    height: 100%;
  }

  &__pagination {
    position: absolute;
    top: 1rem;
    left: 50%;
    bottom: initial;
    transform: translateX(-50%);

    @include whenScreenIs(mdx) {
      top: initial;
      bottom: 1rem;
    }
  }

  &__scroll-cta {
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 1rem;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border: none;
    background: none;
    animation: hover 1s infinite ease-in-out;
    cursor: pointer;

    @include whenScreenIs(mdx) {
      display: none;
    }

    img {
      width: 1rem;
      height: 1.5rem;
      transform: rotate(-90deg);
    }
  }
}

@keyframes hover {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>

<style lang="scss">
@import '~assets/css/variables.scss';

.hero-carousel__pagination {
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
