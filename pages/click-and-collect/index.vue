<template>
    <section class="click-and-collect-page">
        <no-ssr>
            <Clickandcollect />
        </no-ssr>
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
        return await getContent(store, 'menu-page', error);
    }
}
</script>

<style lang="scss" scoped>

    @import '~assets/css/variables.scss';
    @import '~assets/css/helpers.scss';



</style>
