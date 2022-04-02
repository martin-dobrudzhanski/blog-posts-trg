<template>
  <div class="main-content">
    <nav class="nav">
      <div v-for="cat in categories" :key="cat.id" class="nav__item">
        <nuxt-link :to="'/blog/category/' + cat.name">{{ cat.name }}</nuxt-link>
      </div>
    </nav>
    <main>
      <!-- just for debugging -->
      <h1 class="page-marker">{{ $route.params.slug }}</h1>

      <div class="flower-img-container">
        <img
          class="flower-img-container__image"
          src="@/assets/img/flower-green.png"
          alt="pic"
          width="200px"
        />
      </div>
      <!-- Carousel -->
      <vueper-slides
        autoplay
        duration="3500"
        fixed-height="true"
        :breakpoints="{ 600: { height: 450 } }"
      >
        <vueper-slide v-for="i in 2" :key="i">
          <template #content>
            <div class="carousel-container">
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

      <!-- Items -->

      <div class="small-cards-container-second">
        <span v-for="(card, i) in selectedCategory" :key="i">
          <SmallCard
            :thumbnail="card.thumbnail"
            :title="card.title"
            :description="card.description"
          />
        </span>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SmallCard from '@/components/SmallCard';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
  components: {
    SmallCard,
    VueperSlides,
    VueperSlide
  },
  data() {
    return {
      selectedCategory: null
    };
  },

  methods: {},
  computed: {
    ...mapGetters({
      title: 'testCardData/getTitle',
      description: 'testCardData/getDescription',
      categories: 'testCardData/getCategories'
    })
  },
  async mounted() {
    this.selectedCategory = await this.categories.find(
      cat => cat.name === this.$route.params.slug
    ).items;
    console.log('item ', this.selectedCategory);
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

  &__item {
    .nuxt-link-exact-active {
      border-bottom: 2px solid rgb(4, 138, 190);
    }
    > a {
      color: black;
      font-weight: bold;
      font-size: 1rem;
    }
  }
}

.main-content {
  background-image: url('~/assets/img/background/paper.jpg');
  height: auto;
  > main {
    @include whenScreenIs(lg) {
      width: 1200px;
      margin: 10px auto;
    }
    @include whenScreenIs(sm) {
      padding: 0 50px;
    }
  }
}

.carousel-container {
  @include whenScreenIs(xs) {
    // display: flex;
    flex-direction: column-reverse;
    margin: 15px 0 0 0;
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
  text-align: center;
}
.flower-img-container {
  margin-top: 20px;
  position: absolute;
  margin-left: -7rem;
}

.vueperslides--fixed-height {
  height: 400px;
}

.page-marker {
  text-align: center;
}
</style>
