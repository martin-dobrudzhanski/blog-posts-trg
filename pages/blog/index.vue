<template>
  <div class="main-content">
    <nav class="nav">
      <div class="nav__item">Category</div>
      <div class="nav__item">Category</div>
      <div class="nav__item">Category</div>
      <div class="nav__item">Category</div>
      <div class="nav__item">Category</div>
      <div class="nav__item">Category</div>
    </nav>
    <main>
      <!-- Carousel -->
      <vueper-slides
        fixed-height="true"
        :breakpoints="{ 600: { height: 450 } }"
      >
        <vueper-slide v-for="i in 2" :key="i">
          <template #content>
            <div class="carousel-container">
              <!-- <div class="flower-img-container">
                <img
                  class="flower-img-container__image"
                  src="@/assets/img/flower-green.png"
                  alt="pic"
                  width="200px"
                />
              </div> -->
              <div class="carousel-container__text">
                <h2 class="carousel-container__heading">Blog Title</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  temporibus facilis porro totam impedit, voluptas vitae.
                  Quibusdam, nostrum nesciunt. Architecto. Lorem ipsum dolor sit
                  amet consectetur adipisicing elit.
                </p>
                <button class="carousel-container__read-more-btn">
                  Read more
                </button>
              </div>
              <div class="carousel-container__image"></div>
            </div>
          </template>
        </vueper-slide>
      </vueper-slides>

      <!-- Welcome banner -->
      <div class="welcome-banner">
        <h1>Welcome to the Chiquito Blog</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro,
          vitae!
        </p>
      </div>
      <!-- Category name -->
      <h2 class="category-name__header">
        <p class="category-name__name">category name</p>
        <p class="category-name__dots"></p>
        <button class="category-name__seeAllBtn">See all</button>
      </h2>

      <!-- Slider small carousel TODO...-->
      <vueper-slides
        class="no-shadow"
        fixed-height="true"
        :visible-slides="3"
        slide-multiple
        :gap="1"
        :slide-ratio="1 / 4"
        :dragging-distance="200"
        :breakpoints="{
          800: { visibleSlides: 2, slideMultiple: 2, height: 500 },
          600: { visibleSlides: 1, slideMultiple: 1, height: 500 }
        }"
      >
        <vueper-slide v-for="i in 6" :key="i" :title="i.toString()">
          <template #content>
            <div class="small-cards-container">
              <SmallCard />
            </div>
          </template>
        </vueper-slide>
      </vueper-slides>
      <!-- <div class="small-cards-container">
        <div v-for="card in 3" :key="card">
          <SmallCard />
        </div>
      </div> -->

      <!-- Category name -->
      <h2 class="category-name__header">
        <p class="category-name__name">category name</p>
        <p class="category-name__dots"></p>
        <button class="category-name__seeAllBtn">See all</button>
      </h2>
      <!-- Category second line -->
      <div class="small-cards-container-second">
        <span v-for="card in 2" :key="card">
          <SmallCard />
        </span>
      </div>
      <NewsletterSignUpCard
        :title="'Sign up for great offers'"
        :text="'Lorem Lorem lorem Loremlorem loremlorem'"
        :image="image"
      />
    </main>
  </div>
</template>

<script>
import SmallCard from '@/components/SmallCard';
import NewsletterSignUpCard from '~/components/cards/NewsletterSignUpCard.vue';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
  components: {
    SmallCard,
    NewsletterSignUpCard,
    VueperSlides,
    VueperSlide
  },
  data() {
    return {
      image: {
        fields: {
          file: {
            url:
              '//images.ctfassets.net/w3qjq8no4dj7/5zCWxoZAxqpWvd2ezsNkfF/fe236765f074048b25c50fedce93315c/DSC05898_3x.jpg'
          }
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.nav {
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: space-around;
  background-color: rgb(109, 233, 235);
}

.main-content {
  background-image: url('~/assets/img/background/paper.jpg');
  height: auto;
  > main {
    @include whenScreenIs(lg) {
      width: 1200px;
      margin: 10px auto;
    }
    @include whenScreenIs(tablet) {
    }
  }
}

.carousel-container {
  @include whenScreenIs(xs) {
    // display: flex;
    flex-direction: column-reverse;
    margin: 0;
    height: 420px;
  }
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 30px auto;
  height: -webkit-fill-available;

  &__heading {
    @include whenScreenIs(xs) {
      margin-bottom: 15px;
    }
    font-size: 2.5rem;
    margin-bottom: 50px;
    font-family: 'BurfordExtrudeC', 'BurfordStripesA', 'HelloSidney',
      'BurfordExtrudeC', 'NeueHaasGroteskTextPro55Roman', 'Roboto',
      'Helvetica Neue', Helvetica, 'Fira Sans', 'Droid Sans', sans-serif;
  }

  &__text {
    @include whenScreenIs(xs) {
      width: 100%;
      height: 265px;
      border-radius: 0;
      text-align: center;
    }

    font-size: 1rem;
    text-align: left;
    width: 40%;
    padding: 30px 20px;
    background-color: rgb(236, 252, 166);
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    > p {
      @include whenScreenIs(xs) {
        margin-bottom: 20px;
      }
      margin-bottom: 40px;
    }
    z-index: 1;
  }
  &__image {
    @include whenScreenIs(xs) {
      width: 100%;
      height: 200px;
      border-radius: 0;
    }
    background-image: url('~/assets/img/burgers.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 800px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  &__read-more-btn {
    @include whenScreenIs(xs) {
      margin-top: 0;
    }
    border: none;
    color: white;
    background-color: black;
    border-radius: 15px;
    padding: 5px 10px;
    margin-top: 1.5rem;
  }
}

.welcome-banner {
  background-color: #e6cfdc;
  margin: 20px auto;
  text-align: center;
  // width: 60%;
  padding: 30px 0;
  border-radius: 5px;
  > h1 {
    margin-bottom: 20px;
    font-size: 1.5rem;
  }
}

.category-name {
  margin-bottom: 1rem;
  &__header {
    display: flex;
    height: 26px;
    margin-bottom: 1rem;
  }
  &__name {
    font-family: $card-display-font;
    font-size: 26px;
    margin-right: 0.5rem;
    color: $greyish-brown;
  }
  &__dots {
    flex-grow: 1;
    border-bottom: 2px dotted $greyish-brown;
    height: 11px;
  }
  &__seeAllBtn {
    border: none;
    background-color: black;
    color: white;
    border-radius: 15px;
    padding: 0 10px;
  }
}

.small-cards-container {
  @include whenScreenIs(xs) {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  // height: 300px;
  display: flex;
  flex-direction: row;
}

.small-cards-container-second {
  @include whenScreenIs(xs) {
    display: flex;
    flex-direction: column;
    > span {
      margin-bottom: 0;
      margin-top: -33px;
    }
  }
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.flower-img-container {
  position: absolute;
  margin-left: -7rem;
}

.vueperslides--fixed-height {
  height: 400px;
}
</style>
