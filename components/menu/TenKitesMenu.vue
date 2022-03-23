<template>
  <section class="tk-menu">
    <div v-if="error" class="tk-menu__error">
      <h2
        class="line-height-reset tk-menu__error-message"
        v-text="error.message"
      />
      <div v-if="ctaBtn" class="tk-menu__error-cta-wrapper">
        <BaseButton size="medium" width="fit" :to="ctaBtn.url">
          {{ ctaBtn.title }}
        </BaseButton>
      </div>
    </div>
    <div v-else-if="loading" class="tk-menu__loading">
      <div class="loader" />
    </div>
    <div v-else class="k10-html-container tk-menu__container" />
  </section>
</template>

<script>
import get from 'lodash.get';
import { poll } from '@/libs/pollHelpers';
import BaseButton from '@/components/buttons/BaseButton';

const ErrorCode = {
  NO_MENU: 'no-menu',
  LOAD_MENU: 'load-menu',
  LOAD_MENU_DEPS: 'load-menu-deps',
};

export default {
  name: 'TenKitesMenu',
  components: { BaseButton },
  props: {
    menuUrl: {
      type: String,
      default: null,
    },
  },
  head() {
    return {
      script: [
        {
          vmid: 'k10',
          src: 'https://menus.tenkites.com/scripts/_k10.min.js',
          async: true,
        },
      ],
    };
  },
  data() {
    return {
      loading: false,
      error: null,
    };
  },
  computed: {
    ctaBtn() {
      if (get(this.error, 'code') !== ErrorCode.NO_MENU) return null;

      return {
        title: 'See generic menu',
        url: '/menu',
      };
    },
  },
  mounted() {
    this.loading = true;

    if (!this.menuUrl) {
      this.error = {
        message: 'No menu added',
        code: ErrorCode.NO_MENU,
      };
      this.loading = false;
      return;
    }

    /**
     * The current version of nuxt & vue-meta doesn't have the new callback method for head scripts
     * so we check here a few times if the external dependencies are loaded before trying to load the menu
     */
    poll({
      fn: () => !!(window && window.$k10),
      validate: (externalDepsLoaded) => externalDepsLoaded,
      interval: 200,
      maxAttempts: 10,
    })
      .then(() => {
        this.loading = false;
        this.loadTenKitesMenu();
      })
      .catch(() => {
        this.error = {
          message: 'Oops! Something went wrong!',
          code: ErrorCode.LOAD_MENU_DEPS,
        };
        this.loading = false;
      });
  },
  methods: {
    async loadTenKitesMenu() {
      const vm = this;
      try {
        /** TenKites provided code snippet ------- */
        const $k10 = window.$k10;
        $k10(function () {
          $k10.ajax({
            url: vm.menuUrl,
            type: 'GET',
            crossDomain: true,
            success: function (responseData, textStatus, jqXHR) {
              const $k10tkHtml = $k10('<div/>', {
                html: responseData,
              });
              const headContent = $k10tkHtml
                .find('.tk-html-header-scripts')
                .html();
              const bodyContent = $k10tkHtml.find('.tk-html-body').html();
              const bodyScripts = $k10tkHtml
                .find('.tk-html-body-scripts')
                .html();
              $k10('head').append(headContent);
              $k10('.k10-html-container').append(bodyContent);
              setTimeout(function () {
                $k10('body').append(bodyScripts);
              }, 50);
            },
            error: function (responseData, textStatus, errorThrown) {
              vm.error = {
                message: 'Oops! Something went wrong!',
                code: ErrorCode.LOAD_MENU,
              };
            },
          });
        });
        /** TenKites provided code snippet ------- */
      } catch (error) {
        this.error = {
          message: 'Oops! Something went wrong!',
          code: ErrorCode.LOAD_MENU,
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.tk-menu {
  width: 100%;
  min-height: 100%;

  &__error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 1rem;
  }

  &__error-message {
    font-family: $display-font;
    font-size: 2rem;
    color: red;
    margin-bottom: 3rem;
    text-align: center;
  }

  &__error-cta-wrapper {
    width: 100%;
    max-width: 18rem;
    margin: 0 auto;
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 3rem;
  }
}
</style>
