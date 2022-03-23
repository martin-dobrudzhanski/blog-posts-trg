<template>
	<section class="menu-header">

		<div class="header-container">

			<h1 class="heading" data-size="xl">{{ restaurant.fields.title }}</h1>

			<h2 class="heading address" data-weight="bold" data-size="sm">
				<a target="_blank"
				:href="`https://www.google.com/maps?q=${restaurant.fields.postalCode}+chiquito`">
					{{ restaurant.fields.street }},
					{{ restaurant.fields.additional ?  restaurant.fields.additional + ', ' : ''}}
					{{ restaurant.fields.city }},
					{{ restaurant.fields.postalCode }}
				</a>
			</h2>


			<p class="heading phone" data-weight="medium" data-size="sm">
				<a :href="`tel:${restaurant.fields.telephone}`">
					{{restaurant.fields.telephone}}
				</a>
			</p>

			<nuxt-link class="change-restaurant" to="/menu">Change restaurant</nuxt-link>

			<DownloadMenu v-if="downloadBtn" screen="desktop" class="download-menu-button" :target="downloadTarget" />

		</div>


	</section>
</template>

<script>

	import DownloadMenu from '~/components/menu/DownloadMenuButton.vue'

	export default {
		props: ['restaurant', 'downloadBtn', 'downloadTarget'],
		components: {
			DownloadMenu
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.menu-header {

		.header-container {
			position:relative;
			display:flex;
			flex-direction:column;
			align-items:center;
			justify-content:center;
			height: 96px;
			padding:12px;
			background-color:$rebrand-blue;
			@include whenScreenIs(mdx){
				height: 160px;
			}
			h1 {
				margin:0;
				word-wrap:break-word;
				color:#fff;
				@include whenScreenIs(mdx) {
					width:450px;
					margin-bottom:8px;
				}
			}
			h2.address {
				display:none;
				margin:0 0 8px;
				color:#fff;
				@include whenScreenIs(mdx) {
					width:400px;
					display: block;
				}
				a {
					color:inherit;
				}
			}
			p.phone {
				display:none;
				margin:0;
				a {
					text-decoration:underline;
					color:#fff;
				}
				@include whenScreenIs(mdx) {
					display:block;
				}
			}
			a.change-restaurant {
				display:block;
				text-align:center;
				text-decoration:underline;
				color:#fff;
				font-size:12px;
				margin-top:8px;
				@include whenScreenIs(mdx) {
					display:none;
				}
			}
			.download-menu {
				display:none;
				position:absolute;
				right:16px; bottom:16px;
				@include whenScreenIs(mdx) {
					display:flex;
				}
			}
		}

	}

</style>
