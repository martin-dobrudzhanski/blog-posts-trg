<template>

  <div class="swiper-tablet">
    <div v-swiper:mySwiper="swiperOption" class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
          v-for="(slide, i) in slides" :key="i" :data-i="i">
          <SliderCard :card="slide"></SliderCard>
        </div>
      </div>
    </div>
		<template v-if="showButtons">
			<span class="swiper-button-prev" @click="slidePrev">
				<img src="@/assets/img/icons/icon-left.svg" alt="">
			</span>
			<span class="swiper-button-next" @click="slideNext">
				<img src="@/assets/img/icons/icon-right.svg" alt="">
			</span>
		</template>
  </div>

</template>

<script>
import 'swiper/dist/css/swiper.css'
import SliderCard from '~/components/menu/foodSlider/tablet/SliderCard.vue'


export default {
  props: {
    'slides': {
      default: [],
      type: Array
    }
  },
  components: { SliderCard },
  data () {
    return {
			showButtons: false,
      activeSlide: false,
      swiper: {},
      activeSlide: 0,
      swiperOption: {
        direction: 'horizontal',
        slidesPerView: 2,
        spaceBetween: 12,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        autoplay: true,
        autoplayDisableOnInteraction: false,
        initialSlide: 1,
        loop: true,
        roundLengths: true,
        mousewheel: false,
        effect: 'slide',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

        on: {
          slideChange () {
            if (this && this.nuxt) {
              this.nuxt.activeSlide = this.realIndex
            } else {
              setTimeout(() => {
                this.nuxt.activeSlide = this.realIndex
              }, 200)
            }
          }
        }
      }
    }
  },
  methods: {
    slideNext () {
      this.mySwiper.slideNext()
    },
    slidePrev () {
      this.mySwiper.slidePrev()
    }
  },
  mounted () {
    this.mySwiper.nuxt = this
		this.showButtons = true;
  }
}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

  .swiper-tablet {
		box-sizing:border-box;
		margin-top:16px;
    position: relative;
		.swiper-container {
			overflow:hidden;
			width:100%; height:232px;
      margin: 0;
		}
    .swiper-button-next,
		.swiper-button-prev {
      display:flex;
      top:88px;
			width:24px; height:24px;
			user-select:none;
			-webkit-tap-highlight-color:transparent;
      width:40px;
      height:64px;
      background:rgba(146,214,72,0.6);
      img {
        margin:2px;
       }
    }
    .swiper-button-prev {
      left:0;
      border-top-right-radius:40px;
      border-bottom-right-radius:40px;
      &:hover {
        transform: scale(1.1) translate(1.5px);
      }
    }
    .swiper-button-next {
      justify-content:flex-end;
      right:0;
      border-bottom-left-radius:40px;
      border-top-left-radius:40px;
      &:hover {
        transform: scale(1.1) translate(-1.5px);
      }
    }
  }


</style>
