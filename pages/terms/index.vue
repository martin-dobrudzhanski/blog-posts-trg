<template>
  <section class="terms" data-fullscreen>
    <div class="header-container red">
      <h1 class="heading" data-size="xl" data-weight="normal">{{content.headerText}}</h1>
    </div>
    <div class="terms-content" >
      <VueMarkdown class="terms-content-block" :source="content.termsContent"></VueMarkdown>
      <VueMarkdown class="terms-content-block" :source="content.patTermsContent"></VueMarkdown>
      <VueMarkdown class="terms-content-block" :source="content.offersContent"></VueMarkdown>
    </div>
  </section>
</template>

<script>
  import { getContent } from '~/libs/templateHelpers.js'
  import VueMarkdown from 'vue-markdown'

  export default {
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) {
					return '';
				}
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: 'Terms & Conditions',
				bodyAttrs: {
					'data-pagecolor': 'light-grey'
				},
				meta: [
					{
						hid: 'description',
						name: 'description',
						content: getMeta()
					},
          {
            hid: 'robots',
            name: 'robots',
            content: 'noindex'
          }
				]
			}
		},
    components: {
      VueMarkdown
    },
    data () {
      return {
        content: null
      }
    },
    async asyncData ({ store, params, error }) {
      return await getContent(store, 'terms-page', error);
    }
  }

</script>

<style lang="scss">

  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';

  .terms {
    background-color: $rebrand-very-light-pink;

    .header-container {
      position:relative;
      height: 56px;
      background-color:$rebrand-blue;
      @include whenScreenIs(mdx) { height: 80px; }
      h1.heading {
        color: white;
        line-height: 56px;
        @include whenScreenIs(mdx) { line-height: 80px; }
      }
    }
    .terms-content {
      max-width: 560px;
      margin: 8px auto;
      padding: 16px;
      @include whenScreenIs(mdx) { margin:0 auto; }

      p {
        line-height: 16px;
        margin-bottom: 8px;
      }
      ol {
        padding-left: 16px;
        margin-bottom: 8px;
        li {
          padding-left: 8px;
        }
      }
      h1 {
        font-size: 1.1rem;
        margin-bottom: 5px;
      }
      .terms-content-block {
        margin-bottom: 20px;
      }
    }
  }


</style>
