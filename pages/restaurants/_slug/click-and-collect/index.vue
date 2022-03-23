<template>
  <section class="click-and-collect-page" data-fullscreen>
    <no-ssr v-if="content.restaurant.fields.zonalSiteId && content.restaurant.fields.clickAndCollect">
      <Clickandcollect :zonalsiteid="content.restaurant.fields.zonalSiteId"/>
    </no-ssr>

    <div class="click-and-collect-page-top" v-else >
      <h1 class="heading" data-size="xl" data-weight="black">Chiquito Click and collect</h1>
      <p class="heading" data-size="sm" data-weight="bold">
        We're sorry, Click and Collect isn't available for this restaurant yet.<br />
        Got a craving for one of your Chiquito favourites?<br />
        Order now and get hot food delivered directly to your door.<br />
        Enjoy your favourite dishes whenever you want, just follow the link below to find out if they deliver to you.
      </p>
      <a href="http://deliveroo.co.uk" target="_blank" class="btn" data-size="md" data-outline="true" data-color="red">Order now</a>
    </div>
  </section>
</template>

<script>
  import { getContent } from '~/libs/templateHelpers.js'
  import Clickandcollect from '~/components/click-collect/Clickandcollect.vue'
  import NoSSR from 'vue-no-ssr'

  export default {
    components: {
      Clickandcollect,
      'no-ssr': NoSSR
    },
    head() {
      let getMeta = () => {
        if (!this.$store.state.ui.metaDescription) {
          return '';
        }
        return this.$store.state.ui.metaDescription;
      }
      return {
        title: 'Click and Collect',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: getMeta()
          }
        ]
      }
    },
    data () {
      return {
        content: null
      }
    },
    async asyncData ({ store, params, error }) {
      return await getContent(store, `restaurants/${params.slug}`, error);
    },
  }
</script>

<style lang="scss" scoped>

  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';

  section.click-and-collect-page {
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    width:100%;
    .click-and-collect-page-top, .click-and-collect-page-middle {
      display:flex;
      flex-direction:column;
      align-items:center;
      width:100%;
      overflow:hidden;
      padding:0 16px 24px;
      h1 {
        width:100%;
        max-width:560px;
        margin:16px auto 24px;
        color:#fff;
        @include whenScreenIs(mdx) {
          margin:24px 0 16px;
        }
      }
      p {
        width:100%;
        max-width:560px;
        margin:0 auto 24px;
        color:#fff;
        @include whenScreenIs(mdx) {
          margin-bottom:20px;
        }
      }
      .btn {
        max-width:560px;
        &.green {
          &:hover {
            background-color: #fff;
          }
        }
      }
    }
    .click-and-collect-page-top {
      background-color: $booger-green;
    }

    .click-and-collect-page-bottom {
      display:flex;
      align-items:center;
      justify-content:center;
      width:100%;
      margin:auto 0;
      background-color:#fff;
      padding:16px 16px 32px;
      img {
        display: block;
        width:177px; height:97px;
        @include whenScreenIs(mdx) {
          width:271px; height:149px;
        }
      }
    }

  }
</style>
