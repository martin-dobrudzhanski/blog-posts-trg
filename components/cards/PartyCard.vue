<template>
  <div class="card party-card">
    <div class="mobile-card">
      <!-- <div class="card-top" :style="{backgroundImage: `url(${imgUrl}?w=928)`}"></div>
			<div class="card-bottom" :class="card.fields.color">
				<div class="heading-container">
					<h1 class="heading card-text" data-size="xl" data-weight="normal">
						{{ card.fields.title }}
					</h1>
				</div>
				<dual-link
				v-if="card.fields.buttonLink"
				class="btn"
				data-size="md"
				data-color="white"
				:linkInfo="card.fields"
				:href="card.fields.buttonLink">
					{{ card.fields.buttonText }}
				</dual-link>
			</div> -->

      <div
        class="card-top"
        :style="{ backgroundImage: `url(${partyImage}?w=928)` }"
      ></div>
      <div class="card-bottom">
        <div class="heading-container">
          <h1 class="heading" data-weight="normal" data-size="xl">
            {{ card.partyHeader }}
          </h1>
          <p class="heading" data-size="sm" data-weight="bold">
            {{ card.partySubHeader }}
          </p>
        </div>
        <a
          class="btn"
          data-size="md"
          data-color="white"
          :href="card.partyButtonHref"
          >{{ card.partyButtonText }}</a
        >
      </div>
    </div>

    <div class="desktop-card">
      <img :src="`${partyImage}?w=476&h=336`" />
      <h1 class="heading" data-size="xl" data-weight="normal">
        {{ card.partyHeader }}
      </h1>
      <p class="heading" data-size="sm" data-weight="bold">
        {{ card.partySubHeader }}
      </p>
      <nuxt-link
        class="btn"
        data-size="lg"
        data-color="white"
        :to="card.partyButtonHref"
        >{{ card.partyButtonText }}</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ['card'],
  computed: {
    partyImage() {
      return (
        this.card &&
        this.card.partyImage &&
        this.card.partyImage.fields &&
        this.card.partyImage.fields.file &&
        this.card.partyImage.fields.file.url
      );
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/mixins/tiles.scss';

.party-card {
  height: 280px;
  @include whenScreenIs(mdx) {
    height: 392px;
  }

  .mobile-card {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    .card-top {
      width: 100%;
      height: 144px;
      background-position: center;
      background-size: cover;
    }
    .card-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 16px 12px 12px;
      width: 100%;
      height: 136px;
      p.heading {
        color: #fff;
      }
    }
    @include tileFormat($color: rebrand-blue);
  }

  .desktop-card {
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    text-align: center;
    background-color: $rebrand-teal;
    width: 100%;
    height: 392px;
    img {
      width: 238px;
      height: 168px;
      margin-bottom: 28px;
      @include fadeIn();
    }
    h1 {
      margin: 16px 0 8px;
      color: #fff;
    }
    p {
      margin: 0 0 12px;
      color: white;
    }
    .btn {
      margin-bottom: 16px;
    }
  }
}
</style>
