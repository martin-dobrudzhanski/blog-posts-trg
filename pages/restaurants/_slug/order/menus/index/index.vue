<template>
	<main class="menus-index">
		<section data-element='menu-container'>
			<div
				data-element="menu-card"
				:style="setBackgroundImg('food')"
			>
				<btn
					data-element="button"
					text="Food menu"
					:link="true"
					:href="getMenuLink('food')"
					size="md"
					colour="white-black"
				/>
			</div>
			<div
				data-element="menu-card"
				:style="setBackgroundImg('drinks')"
			>
				<btn
					data-element="button"
					text="Drinks menu"
					:link="true"
					:href="getMenuLink('drinks')"
					size="md"
					colour="white-black"
				/>
			</div>
		</section>
	</main>
</template>

<script>
	import meta               from '~/mixins/meta';
	import hidefooter         from '~/mixins/hidefooter';
	import hidePrivacyBanners from '~/mixins/hidePrivacyBanners';
	import Btn                from '~/components/iOrder-core/uiV2/Btn';
	import orderAtTable       from '~/mixins/orderAtTable';

	export default {
		components: {
			Btn
		},
		mixins: [
			hidefooter,
			hidePrivacyBanners,
			meta,
			orderAtTable
		],
		props: [
			'location',
			'foodMenuImageUrl',
			'drinksMenuImageUrl'
		],
		methods: {
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
				background-size:cover;
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
