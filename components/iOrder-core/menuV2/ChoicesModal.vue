<template>
	<div data-component="choices-modal" @click.self="$emit('close-choices-modal')">
		<div data-element="modal-container">
			<div data-element="modal-header" @click="$emit('close-choices-modal')" >
				<section-header
					data-element="choices-heading"
					:text="product.displayName"
					:modalHeader="true"
					:choices="true"
				/>
				<div data-element="icon-container">
					<icon
						data-element="close-modal-icon"
						size="sm"
						icon="close"
					/>
				</div>
			</div>
			<div data-element="content-container" id="content-container">
				<p
					data-element="description"
					v-if="description"
				>
					{{ description }}
				</p>
				<portions-group
					:portions="portions"
					:selectedPortionId="selectedPortionId"
					:selectPortion="selectPortion"
					v-if="portions.length > 1"
				/>
				<div data-element="choice-groups-container">
					<choice-group data-element="choice-group" v-for="(choiceGroup, i) in choiceGroups"
						:key="i"
						:choiceGroup="choiceGroup"
						:getProduct="getProduct"
						:getCG="getCG"
						:cgIndex="cgIndex(product.productId, choiceGroup.choiceId)"
						:selectChoice="selectChoice"
						:deselectChoice="deselectChoice"
						:selectedChoices="selectedChoices"
						:scrollToId="getScrollToId(i)"
						:numChoiceGroups="getNumChoiceGroups"
						:index="i"
						:hideChevron="true"
					/>
				</div>
			</div>
			<sticky-footer data-modal>
				<btn text="Done" @click.native="handleClick" :inactive="!requiredSelectionsSelected" />
			</sticky-footer>
		</div>
	</div>
</template>

<script>

	import PortionsGroup from '~/components/iOrder-core/menuV2/PortionsGroup';
	import ChoiceGroup   from '~/components/iOrder-core/menuV2/ChoiceGroup';
	import Icon          from '~/components/iOrder-core/uiV2/Icon';
	import SectionHeader from '~/components/iOrder-core/uiV2/SectionHeader';
	import StickyFooter  from '~/components/iOrder-core/uiV2/StickyFooter';
	import Btn           from '~/components/iOrder-core/uiV2/Btn';

	export default {
		data () {
			return {
				selectedPortionId: this.defaultPortionId,
				selectedChoices: []
			}
		},
		props: [
			'product',
			'portions',
			'defaultPortionId',
			'choiceGroups',
			'getProduct',
			'getCG',
			'cgIndex',
			'addItemToBasket',
			'edit',
			'choiceLines',
			'editBasketChoices',
			'basketIndex'
		],
		components: {
			PortionsGroup,
			ChoiceGroup,
			Icon,
			SectionHeader,
			StickyFooter,
			Btn
		},
		computed: {
			requiredSelectionsSelected () {
				const requiredCGs = this.choiceGroups.filter(cg => {
					return this.getCG(cg.choiceId).minimum;
				});
				const allRequiredSelectionsSelected = requiredCGs.reduce((bool, cg) => {
					const requiredCGMatch = this.selectedChoices.find(selectedChoice => {
						return selectedChoice.choiceId === cg.choiceId;
					});
					return bool && requiredCGMatch;
				}, true);
				return allRequiredSelectionsSelected;
			},
			getNumChoiceGroups () {
				return this.choiceGroups.length;
			},
			productDetails () {
				return this.getProduct(this.product.productId);
			},
			description () {
				return this.productDetails.displayRecords &&
							 this.productDetails.displayRecords[0].description
			}
		},
		methods: {
			selectChoice (choiceGroup, choiceId, choiceGroupIndex) {
				const choice = {
					choiceId: choiceGroup.choiceId,
					ingredientId: choiceId,
					portionTypeId: 1,
					displayRecordId: choiceGroup.displayRecordId,
					quantity: 1,
					choiceIndex: choiceGroupIndex
				};
				if (this.getCG(choiceGroup.choiceId).maximum <= this.selectedChoices.filter(choiceObject => choiceObject.choiceId === choiceGroup.choiceId).length) {
					this.selectedChoices = this.selectedChoices.filter(choiceObject => choiceObject.choiceId !== choiceGroup.choiceId);
				}
				this.selectedChoices.push(choice);
			},
			deselectChoice (choiceGroup, choiceId) {
				this.selectedChoices = this.selectedChoices.filter(choiceObject => {
					return choiceObject.choiceId !== choiceGroup.choiceId || choiceObject.ingredientId !== choiceId;
				});
			},
			selectPortion (portionId) {
				this.selectedPortionId = portionId;
			},
			handleClick () {
				if (this.edit && this.requiredSelectionsSelected) {
					this.editBasketChoices(this.selectedChoices, this.basketIndex);
					this.$emit('close-choices-modal');
					return;
				}
				if (this.requiredSelectionsSelected) {
					this.addItemToBasket(this.product, this.selectedPortionId, this.selectedChoices);
					this.$emit('close-choices-modal');
				}
			},
			getScrollToId (index) {
				if (index === 0) return 'first';
				if (index === 1) return 'second';
				if (index === 2) return 'third';
				if (index === 3) return 'fourth';
				if (index === 4) return 'fifth';
				if (index === 5) return 'sixth';
				if (index === 6) return 'seventh';
				if (index === 7) return 'eighth';
			},
			isRequired (productId) {
				const cg = this.getCG(productId);
				const min = cg.Minimum || cg.minimum;

				return min ? true : false;
			}
		},
		mounted () {
			if (this.edit) {
				this.selectedChoices = this.choiceLines.slice();
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='choices-modal'] {
		position:fixed;
		z-index:99999;
		top:0; right:0;
		bottom:0; left:0;
		display:flex;
		align-items:center;
		justify-content:center;
		overflow-y:auto;
		background-color:$white-two;
		@include whenScreenIs(sm) {
			background-color:rgba(0,0,0,.3);
			flex-direction:column;
		}
		[data-element='modal-container'] {
			position:relative;
			width:100%;
			height:100%;
			max-height:800px;
			overflow-y:auto;
			display:flex;
			flex-direction:column;
			align-items:center;
			@include whenScreenIs(sm) {
				background-color:$white-two;
				height:600px; width:400px;
				padding-bottom:0;
			}
			[data-element='modal-header'] {
				left:0;
				top:0;
				width:100%;
				background-color:#fff;
				z-index: 1;
				position:relative;
				[data-element='icon-container'] {
					position:absolute;
					right:16px;
					top:16px;
					height:100%;
					display:flex;
					align-items:flex-start;
					@include whenScreenIs(sm) {
						right:16px;
					}
				}
			}
			[data-element='content-container'] {
				padding:0 16px;
				padding-bottom:0;
				overflow-y:auto;
				width:100%;
				[data-element='description'] {
					font-size:14px;
					font-weight:500;
					line-height:1.4;
				}
				[data-element='choice-groups-container'] {
					padding-bottom:80px;
					padding-top:24px;
				}
			}
		}
	}
</style>
