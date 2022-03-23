<template>
  <no-ssr>
    <section class="basket-page">
      <VHero
        :locationName="currentLocation.name"
        :backgroundImage="heroBackgroundImage"
        :subnavHeading="subnavHeading"
        heading="You're collecting from"
        :button="{ link: '/takeaway', copy: 'Change restaurant' }"
        :searchBar="false"
        :subNav="false"
      />
      <div class="basket__subnav__container">
        <div class="basket__subnav">
          <div class="basket__header-icon">
            <Icon
              icon="arrow-left"
              size="md"
              data-element="icon"
              data-position="left"
              @click.native="goBack"
              clickable="true"
            />
          </div>
          <p class="basket__subnav__heading">
            Your basket summary
          </p>
        </div>
      </div>
      <div data-element="basket-page-container" class="wide-width">
        <template v-if="loaded">
          <Basket
            appLabel="clickAndCollect"
            :content="content"
            :showTimeslotDisplay="true"
            :cutlery="cutlery"
            @setCutlery="setCutlery"
            :cutleryEnabled="cutleryEnabled"
            :cutleryText="cutleryText"
            :asideBoxes="asideBoxes"
          />
        </template>

        <Spinner v-else />
      </div>
    </section>
  </no-ssr>
</template>

<script>
import { get } from 'lodash';
import { getContent } from '~/libs/templateHelpers.js';
import menuAndBasket from '~/mixins/iOrder-core/menuAndBasket';
import basket from '~/mixins/iOrder-core/basket';
import iOrderConfig from '~/mixins/iOrderConfig';
import clickAndCollect from '~/mixins/clickAndCollect';
import { mapGetters, mapActions } from 'vuex';

import Basket from '~/components/iOrder-core/basketV3/Basket';
import VHero from '~/components/iOrder-core/uiV3/VHero';
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  layout: 'clickAndCollect',
  mixins: [menuAndBasket, iOrderConfig, basket, clickAndCollect],
  components: {
    Basket,
    VHero,
    Icon
  },
  async asyncData({ store, params, error }) {
    return getContent(store, `click-and-collect/${params.slug}`, error);
  },
  computed: {
    subnavHeading() {
      const { content } = this;
      const payload = get(content, 'subnavHeading');
      return payload;
    },
    cutleryEnabled() {
      const { content } = this;
      const payload = get(content, 'cutleryEnabled');
      return payload;
    },
    cutleryText() {
      const { content } = this;
      const payload = get(content, 'cutleryText');
      return payload;
    },
    heroBackgroundImage() {
      const { content } = this;
      const payload = get(content, 'heroBackgroundImage.fields.file.url');
      return payload;
    },
    asideBoxes() {
      const { content } = this;
      const rawPayload = get(content, 'asideBoxes');
      const payload = rawPayload.map(i => {
        return {
          ...i.fields
        };
      });
      return payload;
    },
    ...mapGetters('clickAndCollect', {
      cutlery: 'getCutlery'
    })
  },
  methods: {
    ...mapActions('clickAndCollect', ['setCutlery']),
    async init() {
      if (!this.displayInSiteDirectory) {
        return this.$nuxt.$router.replace({ path: '/takeaway' });
      }

      const canProceed = this.hasValidations();

      if (canProceed) {
        this.loaded = true;
        if (
          !this.$store.getters[
            'clickAndCollect/isTimeslotInMoreThanFiveMinutes'
          ]
        )
          this.$store.dispatch('clickAndCollect/setNextTimeslot');
      }

      this.setIorderConfigs('clickAndCollect');
    }
  },
  created() {
    this.init();
    this.initMixin('clickAndCollect');
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.basket__subnav__container {
  background-color: $rebrand-pink;
  @media (max-width: 992px) {
    display: none;
  }
}
.basket__subnav {
  max-width: $max-width-desktop;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem 1rem;
  @include whenScreenIs(mdx) {
    padding: 1rem;
    height: 72px;
  }
}
.basket__subnav__heading {
  color: $greyish-brown;
  font-size: 40px;
  height: 25px;
  margin-left: 5px;
  font-family: $heading-font;
  text-align: center;

  @include whenScreenIs(xs) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  @include whenScreenIs(sm) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  @include whenScreenIs(mdx) {
    margin-top: 0;
    margin-bottom: 0;
  }
}

.basket__header-icon {
  border-radius: 50%;
  background-color: $greyish-brown;
  width: 32px;
  height: 32px;
  text-align: center;
}

.basket-page {
  background-color: #fff;
  padding-bottom: 24px;
  width: 100%;
  * {
    @include noselect;
  }
  [data-element='basket-page-container'] {
    display: flex;
    flex-direction: column;

    .menu-aside {
      display: none;
    }

    @include whenScreenIs(mdx) {
      padding-top: 0;
      flex-direction: row;

      .menu-aside {
        display: flex;
        margin-top: 2rem;
      }
    }
    [data-element='page-header'] {
      display: none;
      @include whenScreenIs(mdx) {
        display: flex;
      }
    }
    [data-element='payment-discount-desktop'] {
      display: none;
      @include whenScreenIs(mdx) {
        display: block;
      }
    }
    [data-element='basket-content-container'] {
      /* width: 100%; */
      display: flex;
      flex-direction: row;
      min-width: 320px;
      max-width: 960px;
      margin: 0 auto;

      @include whenScreenIs(lg) {
        max-width: 1280px;
      }
      [data-element='basket-listing'] {
        width: 100%;
        @include whenScreenIs(mdx) {
          /* width: 529px; */
          margin-left: 67px;
        }
        [data-element='basket-header'] {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          @include whenScreenIs(mdx) {
            justify-content: flex-start;
          }
          [data-element='icon'] {
            position: absolute;
            top: 16px;
            left: 16px;
            @include clickable(true);
            @include whenScreenIs(mdx) {
              top: 40px;
            }
          }
          [data-element='basket-heading'] {
            font-size: 20px;
            text-align: center;
            padding: 16px;
            @include whenScreenIs(mdx) {
              text-align: left;
              margin: 24px 0 16px 73px;
              padding-left: 0;
            }
          }
        }
        [data-element='payment-discount-mobile'] {
          @include whenScreenIs(mdx) {
            display: none;
          }
        }
        [data-element='timeslot-display'] {
          margin: 16px;
          @include whenScreenIs(mdx) {
            margin: 0 0 0 73px;
          }
        }
        [data-element='basket'] {
          margin: 0 16px 104px;
          @include whenScreenIs(mdx) {
            background-color: $white;
            margin: 24px 0 0 73px;
          }
        }
        [data-element='empty-basket'] {
          [data-element='text'] {
            font-size: 21px;
            color: $pinkish-red;
            text-align: center;
            font-weight: 900;
            margin: 30px 0;
          }
        }
      }
      [data-element='desktop-summary'] {
        display: none;
        @include whenScreenIs(mdx) {
          display: flex;
          flex-direction: column;
          /* width: 314px; */
          margin-top: 40px;
          margin-left: 38px;
        }
      }
    }
    [data-element='sticky-footer'] {
      display: flex;
      flex-direction: column;
      @include whenScreenIs(mdx) {
        display: none;
      }
    }
  }
}
</style>
