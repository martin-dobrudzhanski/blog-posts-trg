<template>
    <v-page class="v-page" :desktopErrorMessage="desktopErrorMessage">
        <section class="at-restaurant" data-fullscreen>
            <clickable-banner
                v-if="getBannerData"
                v-bind="getBannerData"
                class="at-restaurant_banner"
            />
            <img class="at-restaurant_background" v-if="getBackgroundImgData.url" :src="getBackgroundImgData.url" :alt="getBackgroundImgData.alt">
            <div class="at-restaurant_buttons">
                <nuxt-link v-if="content.firstButtonText" :to="content.firstButtonLink">
                    <button
                        class="btn"
                    >{{content.firstButtonText}}</button>
                </nuxt-link>
                <nuxt-link v-if="content.secondButtonText" :to="content.secondButtonLink">
                    <button
                        class="btn"
                    >{{content.secondButtonText}}</button>
                </nuxt-link>
            </div>
        </section>
    </v-page>
</template>

<script>
    const ClickableBanner = () =>
        import('~/components/click-collect/ClickableBanner.vue') 
    const VPage = () => import('~/components/pmb/VPage')
	
	import { getContent } from '~/libs/templateHelpers.js'
    import { get } from 'lodash'
	export default {
        name:"at-restaurant",
		components: {
            ClickableBanner,
            VPage
		},
		data () {
			return {
                content: null,
                desktopErrorMessage: "This page is only available on mobile!"
			}
		},
		async asyncData ({ store, params, error }) {
			return await getContent(store, 'at-restaurant', error);
        },
        computed: {
            getBannerData() {
                return get(this, 'content.banner.fields')
            },
            getBackgroundImgData() {
                const resp = {
                    url: get(this, 'content.backgroundImage.fields.file.url'),
                    alt: get(this, 'content.backgroundImage.fields.title')
                }
                return resp
            }
        }
	}
</script>

<style lang="scss">
	@import '~assets/css/variables.scss';
    @import '~assets/css/helpers.scss';
    .v-page__page-container {
        padding-top: 0 !important;
        .at-restaurant {
            background: $true-white;
            justify-content: flex-start !important;
            &_background {
                margin-bottom: 2rem;
            }
            &_buttons {
                margin: 0 auto;
                width: 80%;
                max-width: $bookings-mobile;
                button {
                    width: 100%;
                    height: 50px;
                    color: $white;
                    border: none;
                    font-family: $display-font;
                    font-size: 23px;
                    font-weight: 800;
                    padding: 0 25px;
                    margin-bottom: 2rem;
                }
            }
        }
    }
</style>