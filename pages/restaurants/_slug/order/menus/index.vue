<template>
		<nuxt-child
			:location="location"
			:foodMenuImageUrl="foodMenuImageUrl"
			:drinksMenuImageUrl="drinksMenuImageUrl"
			:basketCount="basketCount"
			:basketTotal="basketTotal"
			:addItemToBasket="addItemToBasket"
			:removeItemFromBasket="removeItemFromBasket"
			:getMatchingBasketItemsChoicesAndPortions="getMatchingBasketItemsChoicesAndPortions"
			:emptyText="emptyText"
		/>
</template>

<script>
	import { getContent }     from '~/libs/templateHelpers.js'
	import meta               from '~/mixins/meta';
	import hidefooter         from '~/mixins/hidefooter';
	import hidePrivacyBanners from '~/mixins/hidePrivacyBanners';
	import Btn                from '~/components/iOrder-core/uiV2/Btn';
	import orderAtTable       from '~/mixins/orderAtTable';
	import menuAndBasket      from '~/mixins/iOrder-core/menuAndBasket';
	import menu               from '~/mixins/iOrder-core/menu';

	export default {
		data () {
			return {
				content: null
			}
		},
		async asyncData ({ store, params, error, query, redirect }) {
			return await getContent(store, `order-at-table/${params.slug}`, error);
		},
		components: {
			Btn
		},
		mixins: [
			hidefooter,
			hidePrivacyBanners,
			meta,
			orderAtTable,
			menuAndBasket,
			menu
		],
		computed: {
			foodMenuImageUrl () {
				return this.content &&
							 this.content.foodMenuImage &&
							 this.content.foodMenuImage.fields &&
							 this.content.foodMenuImage.fields.file &&
							 this.content.foodMenuImage.fields.file.url
			},
			drinksMenuImageUrl () {
				return this.content &&
							 this.content.drinksMenuImage &&
							 this.content.drinksMenuImage.fields &&
							 this.content.drinksMenuImage.fields.file &&
							 this.content.drinksMenuImage.fields.file.url
			},
			location () {
				return this.content &&
							 this.content.restaurant &&
							 this.content.restaurant.fields;
			}
		},
		methods: {
			async init () {
				this.$store.dispatch('orderAtTable/checkNecessaryDataToProceed', { salesDataCount: 6 });
				this.checkOrderAtTableEnabled();
				this.initMixin('orderAtTable');
			},
			getMenuLink (menu) {
				const slug = this.location.slug;
				if (slug) {
					return `/restaurants/${slug}/order/menus/${menu}`;
				}
				return `/`;
			},
			setBackgroundImg (menu) {
				let imageUrl;
				if (menu === 'food') {
					imageUrl = this.foodMenuImageUrl;
				}
				if (menu === 'drinks') {
					imageUrl = this.drinksMenuImageUrl;
				}
				if (imageUrl) {
					return `backgroundImage: url(${imageUrl});`
				}
				return null;
			}
		},
		created () {
			this.init();
		}
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/iorder-core/helpers.scss';

	.menus-index {
		[data-element='menu-container'] {
			width: 100vw;
			height:calc(100vh - 56px);
			padding: 16px;
			background:$white-two;
			[data-element='menu-card'] {
				width:100%;
				height:calc((100vh - 56px - (2 * 16px) - 48px) / 2);
				display:flex;
				background-repeat:no-repeat;
				background-position:center;
				&:first-child {
					margin-bottom:16px;
				}
				[data-element='button'] {
					align-items:flex-end;
					margin-bottom:16px;
				}
			}
		}
		[data-element='terms-link'] {
			color:#000;
			margin-top:16px;
			text-decoration:underline;
			font-size:12px;
			-webkit-tap-highlight-color:transparent;
		}
	}

</style>
