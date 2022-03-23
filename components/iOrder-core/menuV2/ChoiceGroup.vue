<template>
	<div data-component="choice-group">
		<group-header
			:expanded="true"
			:handleClick="toggleExpanded"
			:text="getRequirementCopy"
			:id="scrollToId"
			:hideChevron="hideChevron"
		/>
		<choice v-for="(choice, index) in getCG(choiceGroup.choiceId).choices"
			:class="{disabled: ( ( !selectionsRemaining && !isChoiceSelected(choice.productId) ) || isChoiceOutOfStock(choice.productId) )}"
			:key="index + 'choice'"
			data-element="choice"
			:choice="choice"
			:getProduct="getProduct"
			:selected="isChoiceSelected(choice.productId)"
			@click.native="handleClick(choice.productId)"
		/>
	</div>
</template>

<script>

	import Choice      from '~/components/iOrder-core/menuV2/Choice';
	import GroupHeader from '~/components/iOrder-core/menuV2/GroupHeader';
	import VueScrollTo from 'vue-scrollto';

	export default {
		props: [
			'choiceGroup',
			'getProduct',
			'getCG',
			'cgIndex',
			'selectChoice',
			'deselectChoice',
			'selectedChoices',
			'id',
			'numChoiceGroups',
			'index',
			'scrollToId',
			'hideChevron'
		],
		components: {
			Choice,
			GroupHeader
		},
		computed: {
			selectionsRemaining () {
				const maximum = this.getCG(this.choiceGroup.choiceId).Maximum || this.getCG(this.choiceGroup.choiceId).maximum;
				if (!maximum) return true;
				const remaining = maximum - this.selectedChoices.filter(choice => choice.choiceId === this.choiceGroup.choiceId).length;
				return remaining ? remaining : false;
			},
			getRequirementCopy () {
				const cg = this.getCG(this.choiceGroup.choiceId)
				const min = cg.Minimum || cg.minimum
				const max = cg.Maximum || cg.maximum
				if (min && max && min === max) return `Please select ${min} item${min > 1 ? 's' : ''}`
				if (min) return `${this.getGroupName} (required)`
								 return `${this.getGroupName} (optional)`
			},
			scrollToElement () {
				if (this.index === 0) return 'second';
				if (this.index === 1) return 'third';
				if (this.index === 2) return 'fourth';
				if (this.index === 3) return 'fifth';
				if (this.index === 4) return 'sixth';
				if (this.index === 5) return 'seventh';
				if (this.index === 6) return 'eighth';
			},
			hasNextChoiceGroup () {
				const numChoicesSelected = this.index + 1;
				return numChoicesSelected < this.numChoiceGroups;
			},
			getGroupName () {
				return this.getCG(this.choiceGroup.choiceId).displayRecords[0].name;
			}
		},
		methods: {
			async handleClick (choiceId) {
				if ( this.isChoiceOutOfStock(choiceId) ) return false;
				if (this.isChoiceSelected(choiceId)) {
					return this.deselectChoice(this.choiceGroup, choiceId)
				}
				if (this.selectionsRemaining) {
					await this.selectChoice(this.choiceGroup, choiceId, this.cgIndex);
					if (!this.selectionsRemaining) {
						this.toggleExpanded();
						if (this.hasNextChoiceGroup) {
							this.$scrollTo(`#${this.scrollToElement}`, 500, { container: '#content-container', offset: -10, easing: 'ease-in-out' });
						}
					}
				}
				return false;
			},
			isChoiceSelected (choiceId) {
				return this.selectedChoices.find(choice => {
					return choice.choiceId === this.choiceGroup.choiceId && choice.ingredientId === choiceId;
				});
			},
			isChoiceOutOfStock (choiceId) {
				return this.getProduct(choiceId).isOutOfStock
			},
			toggleExpanded () {
				// do nothing
			}
		}
	}

</script>

<style lang='scss' scoped>
	[data-component='choice-group'] {
		[data-element='choice'] {
			&.disabled {
				opacity:0.35;
			}
		}
	}

</style>
