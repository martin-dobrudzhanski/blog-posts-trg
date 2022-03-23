<template>
  <section class="links-page" data-fullscreen>
    <clickable-banner class="links-page_banner" v-if="content.banner" v-bind="content.banner.fields" />
    <div class="links-page_buttons">
        <a :href="content.firstCtaButtonLink" v-if="content.firstCtaButtonText && content.firstCtaButtonExternal"  class="btn">{{content.firstCtaButtonText}}</a>
      <nuxt-link v-if="content.firstCtaButtonText && !content.firstCtaButtonExternal" :to="content.firstCtaButtonLink">
        <button class="btn">{{content.firstCtaButtonText}}</button>
      </nuxt-link>

        <a :href="content.secondCtaButtonLink" v-if="content.secondCtaButtonText && content.secondCtaButtonExternal"  class="btn">{{content.secondCtaButtonText}}</a>
      <nuxt-link v-if="content.secondCtaButtonText && !content.secondCtaButtonExternal" :to="content.secondCtaButtonLink">
        <button class="btn">{{content.secondCtaButtonText}}</button>
      </nuxt-link>
    </div>
    <h1 class="heading" data-weight="black" >{{content.title}}</h1>
    <ul class="links-page_list">
      <h2 class="no-results" v-if="!menus.length" v-html="noResultsText"></h2>
      <li class="list-element" v-for="(menu, index) in menus" :key="index">
        <a :href="menu.url" class="menu-link" :target="menu.external ? '_blank' : '#'">
          <h2 data-size="md" data-weight="black" class="subhead heading">
            {{menu.name}}
          </h2>
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { mapActions } from 'vuex'
import { getContent } from '~/libs/templateHelpers.js'
import get from 'lodash.get'
const ClickableBanner = () =>
  import('~/components/click-collect/ClickableBanner.vue')

export default {
  components: {
    ClickableBanner
  },

  head() {
    let getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return ''
      }
      return this.$store.state.ui.metaDescription
    }
    return {
      title: 'View Menus',
      bodyAttrs: {
        'data-pagecolor': 'white'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    }
  },

  data() {
    return {
      menus: [],
      noResultsText: ''
    }
  },

  async asyncData({ store, params, error }) {
    return getContent(store, `links-page/${params.slug}`, error)
  },

  methods: {
    ...mapActions({
      flash: 'ui/flash'
    }),
    getCurrentMenuSet() {
      const files = get(this.content, 'pageLinks')
      let formatted = files.map(link => {
        return {
          from: get(link, 'fields.availableFrom') || '00:00',
          until: get(link, 'fields.availableUntil') || '23:59',
          name: get(link, 'fields.linkTitle'),
          url: get(link, 'fields.assetLinked.fields.file.url'),
          external: get(link, 'fields.isExternalLink')
        }
      })
      return formatted.filter(this.isActiveMenu)
    },
    isActiveMenu(menu) {
      const splittedStart = menu.from.split(':')
      const splittedEnd = menu.until.split(':')
      const start = Number(splittedStart[0]) * 60 + Number(splittedStart[1])
      const end = Number(splittedEnd[0]) * 60 + Number(splittedEnd[1])
      const date = new Date()
      const now = date.getHours() * 60 + date.getMinutes()
      if (!start || !end || !now) return false
      return start <= now && now <= end
    }
  },
  mounted() {
    this.menus = this.getCurrentMenuSet()
    const noResults = get(this.content, 'noResultsText') || []
    this.noResultsText = documentToHtmlString(noResults)
  }
}
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.links-page {
  padding: 0.5rem;
  background: $white;
  &_banner {
    margin-bottom: 1rem;
  }
  &_buttons {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    a {
        width: 49%;
    }
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        color: $white;
        border: none;
        font-size: 21px;
        font-weight: 900;
        padding: 0 10px;
    }
  }
  h1 {
    font-size: 1.75rem;
    color: $scarlet;
    margin: 24px 0px;
    text-align: left;
    font-family: $display-font;
  }
  &_list {
    .no-results {
      font-size: 1.3rem;
      font-weight: 600;
      line-height: 1;
    }
    .list-element {
      padding: 15px 0 15px 0;
      border-bottom: 1px solid $grey;
      &:last-child {
        border-bottom: none;
      }
      .subhead {
        text-align: left;
        font-family: $display-font;
      }
    }
  }
}
</style>
