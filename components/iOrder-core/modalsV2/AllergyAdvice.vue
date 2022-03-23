<template>
		<div data-component="allergy-advice">
			<Icon
				data-element="close-icon"
				icon="close"
				:clickable="true"
				@click.native="closeModal"
			/>
			<div class="header">
				<h1 class="heading" data-size="xl" data-color="rebrand-orange">Allergy Advice</h1>
			</div>
			<div class="content">
				<p data-element="text">We follow good hygiene practices in our kitchens, but due to the presence of allergenic ingredients in some products, there is a small possibility that allergen traces may be found in any item. We advise you to speak to a member of staff in our restaurants if you have any food allergies or intolerance.</p>
				<p data-element="text">Meals which have ‘contains’ information include ingredients with this allergen present.</p>
				<p data-element="text">Meals which have ‘may contain’ information includes ingredient(s) which are produced in a factory with this allergen present and our suppliers believe there is a significant risk of cross-contamination.</p>
				<p data-element="text">Ingredients containing allergens which are deep fried in our kitchens will use the same fryers as ingredients which do not contain allergens. There may be a risk of cross-contamination.</p>
				<p data-element="text">Ingredients can occasionally be substituted or changed so please review the allergy and intolerance information on this website before each visit, or ask your server when you arrive.</p>
				<p data-element="text">Please note some main meals include side options. Please check allergen data for these items separately.</p>
				<p data-element="text">Due to the presence of some ingredients used in our kitchens, where we offer a gluten free menu, controls are in place to ensure that dishes contain less than 20ppm gluten.	Otherwise, we can never guarantee a dish is completely free from any allergens or specific ingredients.</p>
				<nuxt-link to="/allergy" class="btn" data-size="lg" data-element="button" target="_blank" @click.native="closeModal">Got it!</nuxt-link>
			</div>
		</div>
</template>

<script>
	import Icon from '~/components/iOrder-core/uiV2/Icon';
	export default {
		props: [
			'closeModal'
		],
		components: {
			Icon
		}
	}
</script>

<style lang="scss" scoped>
	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';
 	[data-component='allergy-advice'] {
		background-color:$white;
		padding-bottom:16px;
		margin:32px 16px;
		position:relative;
		@include whenScreenIs(sm) {
			max-width:800px;
			padding-bottom:32px;
		}
		[data-element='close-icon'] {
			position:absolute;
			top:8px;
			right:8px;
			@include whenScreenIs(sm) {
				top:16px;
				right:16px;
			}
		}
		.header {
			margin:32px 16px 16px;
			@include whenScreenIs(sm) {
				margin-bottom:32px;
			}
		}
		.content {
			display:flex;
			justify-content:center;
			flex-wrap:wrap;
			margin:16px 16px 0;
			@include whenScreenIs(sm) {
				margin:32px 80px 0;
			}
			[data-element='text'] {
				font-size:13px;
				margin-bottom:16px;
				width:100%;
				&:last-of-type {
					margin-bottom:32px;
					@include whenScreenIs(sm) {
						margin-bottom:40px;
					}
				}
			}
		}
	}
 </style>
