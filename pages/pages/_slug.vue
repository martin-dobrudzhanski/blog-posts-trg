<template>
  <section class="generic" data-fullscreen>
		<div class="tiles">
			<Tile
  			v-for="(card, index) in content.cards"
  			:key="index"
  			:card="card"
        :class="getClass(card)"
			/>
		</div>
  </section>
</template>

<script>
import Tile from '~/components/Tile.vue'
import { getContent } from '~/libs/templateHelpers.js'
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown,
    Tile
  },
  head () {
    let getMeta = () => {
			if (!this.content.metaDescription &&
					!this.$store.state.ui.metaDescription) {
						return '';
			}
      if (!this.content.metaDescription) {
        return this.$store.state.ui.metaDescription;
      }
      return this.content.metaDescription;
    }
    return {
      title: this.content.title,
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
  data () {
    return {
      content: null
    }
  },
  async asyncData ({ store, params, error }) {
    return getContent(store, `pages/${params.slug}`, error)
  },
  computed: {
  },
  methods: {
    getClass (card) {
      if (card.sys.contentType.sys.id === 'graphicCard') {
        return 'jumbotron'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">

  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';

  section.generic {
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    width:100%;
    .tiles {
      >.tile-container {
        width:100%;
      }
    }
  }

</style>
