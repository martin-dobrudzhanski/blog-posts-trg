<template>
  <section class="" data-fullscreen>
    <section class="find-restaurant-container">
      <h1 class="heading" data-size="xl" data-weight="normal">
        {{ content.headerText }}
      </h1>
      <p class="heading" data-size="sm" data-weight="bold">
        <span>{{ content.subHeading1 }} </span>
        <span>{{ content.subHeading2 }} </span>
      </p>
      <img
        :src="`${imgUrl}?w=448&h=316&q=100`"
        :alt="this.content.headerImage.fields.description"
      />
      <div class="location-form-container">
        <LocationForm should-redirect="true" size="md" />
      </div>
    </section>

    <section class="restaurant-library-container">
      <div class="library">
        <div class="region-container" v-for="(list, regionName) in regonalList">
          <img
            v-if="!list.show"
            class="status-icon"
            v-toggleIcon="{ target: regionName }"
            v-clickToToggle="{ target: regionName }"
            src="~assets/img/icons/icon-plus.svg"
            alt="expand-arrow"
          />

          <h2 class="main" v-clickToToggle="{ target: regionName }">
            {{ regionName | capitalize }}
          </h2>

          <ul class="hide" v-toggleTarget="{ target: regionName }">
            <li
              class="restaurant-list-item"
              v-for="restaurant in list.locations"
            >
              <nuxt-link :to="`/restaurants/${restaurant.fields.slug}`">
                <h2 class="restaurant">
                  {{ restaurant.fields.title | remove-fb | capitalize }}
                </h2>
                <img
                  class="status-icon"
                  src="~assets/img/icons/icon-arrow-right.svg"
                  alt="collapse-arrow"
                />
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import LocationForm from '~/components/LocationForm.vue';
import { getContent } from '~/libs/templateHelpers.js';
import { mapMutations } from 'vuex';

export default {
  components: {
    LocationForm
  },
  head() {
    let getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    return {
      title: 'Find a restaurant',
      bodyAttrs: {
        'data-pagecolor': 'light-grey'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    };
  },
  data() {
    return {
      content: null
    };
  },
  async asyncData({ store, params, error }) {
    return await getContent(store, 'restaurants', error);
  },
  computed: {
    regonalList() {
      let list = {
        london: { locations: [] },
        'south east': { locations: [] },
        'south west': { locations: [] },
        'east of england': { locations: [] },
        'west midlands': { locations: [] },
        'east midlands': { locations: [] },
        'yorkshire and the humber': { locations: [] },
        'north east': { locations: [] },
        'north west': { locations: [] },
        scotland: { locations: [] },
        wales: { locations: [] },
        'northern ireland': { locations: [] }
      };
      this.content.restaurants.fields.list.forEach(el => {
        el.fields.region = el.fields.region
          ? el.fields.region.toLowerCase()
          : null;
        list[el.fields.region]
          ? list[el.fields.region].locations.push(el)
          : (list[el.fields.region] = { locations: [el] });
      });
      return list;
    },
    imgUrl() {
      return (
        this.content &&
        this.content.headerImage &&
        this.content.headerImage.fields &&
        this.content.headerImage.fields.file &&
        this.content.headerImage.fields.file.url
      );
    }
  },
  methods: {
    ...mapMutations({
      toggleRegion: 'restaurants/toggleRegion'
    })
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.find-restaurant-container {
  background-color: $white-three;
  height: 176px;
  overflow: hidden;
  padding: 0 16px;
  h1.heading {
    margin-top: 16px;
    margin-bottom: 24px;
    color: $rebrand-orange;
    @include whenScreenIs(mdx) {
      margin-top: 24px;
      margin-bottom: 16px;
    }
  }
  img {
    width: 224px;
    height: 158px;
    display: block;
    margin: 0 auto;
  }
  p,
  img {
    display: none;
  }
  .location-form-container {
    max-width: 600px;
    margin: 0 auto;
  }
}

.restaurant-library-container {
  @include fadeIn();
  width: 100%;
  height: 100%;
  padding-top: 8px;
  padding-bottom: 20px;
  @include whenScreenIs(mdx) {
    padding-bottom: 70px;
  }
  .region-container {
    position: relative;
  }
  .library {
    min-width: 320px;
    max-width: 560px;
    padding: 0 20px;
    margin: 0 auto;
    .status-icon {
      position: absolute;
      right: 2px;
      top: 14px;
      @include clickable(true);
    }
    .restaurant-list-item {
      position: relative;
      a {
        position: static;
      }
    }
    h2.main,
    h2.restaurant {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 48px;
      font-size: 18px;
      line-height: 1.14;
      font-weight: 700;
      color: $rebrand-orange;
      text-transform: capitalize;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: solid 2px $rebrand-orange;
      @include clickable(false);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    li {
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      a {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
    }
    h2.restaurant {
      color: $rebrand-orange;
      padding-right: 30px;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
  }
}

@include whenScreenIs(mdx) {
  .find-restaurant-container {
    height: 360px;
    h1 {
      color: $rebrand-orange;
    }
    p.heading {
      margin-bottom: 32px;
      span {
        display: block;
      }
    }
    p,
    img {
      display: block;
    }
  }
}
</style>
