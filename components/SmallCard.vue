<template>
  <div class="small-card-container">
    <div
      :style="{ backgroundImage: `url(${thumbnail})` }"
      class="small-card-container__image"
    ></div>
    <div class="small-card-container__text">
      <h2 class="small-card-container__heading">{{ title }}</h2>
      <p>
        {{ description }}
      </p>
      <button class="small-card-container__read-more-btn">Read more</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.small-card-container {
  display: flex;
  flex-direction: column;
  // width: 60%;
  margin: 20px auto;

  &__heading {
    @include whenScreenIs(tablet) {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    font-size: 2rem;
    margin-bottom: 25px;
    // word-break: break-all;
    // line-height: initial;
  }

  &__text {
    @include whenScreenIs(xs) {
      border-radius: 0;
      width: 100%;
    }
    width: 95%;
    padding: 30px 20px;
    background-color: rgb(236, 252, 166);
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    > p {
      @include whenScreenIs(tablet) {
        margin-bottom: 25px;
      }
      margin-bottom: 40px;
    }
  }
  &__image {
    @include whenScreenIs(xs) {
      border-radius: 0;
      width: 100%;
    }
    // background-image: url('~/assets/img/burgers.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 95%;
    height: 180px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
  }
  &__read-more-btn {
    display: block;
    margin: 0 auto;
    border: none;
    color: white;
    background-color: black;
    border-radius: 15px;
    padding: 5px 10px;
  }
}
</style>
