<template>
	<div class="allergy-advice">
		<p data-element="text">We follow good hygiene practices in our kitchens, but due to the presence of allergenic ingredients in some products, there is a small possibility that allergen traces may be found in any item. We advise you to speak to a member of staff in our restaurants if you have any food allergies or intolerance.</p>
		<p data-element="text">Meals which have ‘contains’ information include ingredients with this allergen present.</p>
		<p data-element="text">Meals which have ‘may contain’ information includes ingredient(s) which are produced in a factory with this allergen present and our suppliers believe there is a significant risk of cross-contamination.</p>
		<p data-element="text">Ingredients containing allergens which are deep fried in our kitchens will use the same fryers as ingredients which do not contain allergens. There may be a risk of cross-contamination.</p>
		<p data-element="text">Ingredients can occasionally be substituted or changed so please review the allergy and intolerance information on this website before each visit, or ask your server when you arrive.</p>
		<p data-element="text">Please note some main meals include side options. Please check allergen data for these items separately.</p>
		<p data-element="text">Due to the presence of some ingredients used in our kitchens, where we offer a gluten free menu, controls are in place to ensure that dishes contain less than 20ppm gluten.	Otherwise, we can never guarantee a dish is completely free from any allergens or specific ingredients.</p>
		<a href="#" class="btn" data-size="md" @click.prevent="acceptTerms">Got it!</a>
	</div>
</template>

<script>

	export default {
		computed: {
			allergySlug () {
				if (this.$store.state.ui.modalOptions.allergyPageSlug) {
					return this.$store.state.ui.modalOptions.allergyPageSlug;
				}
				return false;
			},
			allergyPageUrl () {
				if (this.allergySlug) {
					return `/allergy/${this.allergySlug}`;
				}
				return `/allergy`;
			}
		},
		methods: {
			acceptTerms () {
				this.$router.push(this.allergyPageUrl);
				this.$store.commit('ui/hideModal');
			}
		}
	}

</script>

<style lang="scss">

	.allergy-advice {
		display:flex;
		flex-direction:column;
		align-items:center;
		justify-content:flex-start;
		width:100%;
		[data-element='text'] {
			width:100%;
			margin-bottom:10px;
			&:last-of-type {
				margin-bottom:30px;
			}
		}
	}

</style>
