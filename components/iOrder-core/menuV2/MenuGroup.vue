<template>
	<li data-component="group" ref="group">
		<group-header
			:expanded="expanded"
			:handleClick="expandAndScroll"
			:text="groupName"
			size="md"
		/>
		<div :class="{ expanded: expanded }" data-element="menu-element-container">
			<div v-for="(menuElement, elementIndex) in items" :key="elementIndex" data-element="menu-element">
				<sub-header v-if="menuElement.itemType === 'subHeader'" :text="menuElement.subHeader.text" />
				<text-field v-else-if="menuElement.itemType === 'textField'" :text="menuElement.textField.text" />
				<product v-else-if="menuElement.itemType === 'product'"
					:product="menuElement.product"
					:getProduct="getProduct"
					:getCG="getCG"
					:cgIndex="cgIndex"
					:getKeyWord="getKeyWord"
					:addItemToBasket="addItemToBasket"
					:removeItemFromBasket="removeItemFromBasket"
					:getItemCount="getItemCount"
					:isVeg="isVeg"
					:isVegan="isVegan"
					:getMatchingBasketItemsChoicesAndPortions="getMatchingBasketItemsChoicesAndPortions"
					/>
			</div>
		</div>
	</li>
</template>

<script>

	import SubHeader from '~/components/iOrder-core/menuV2/SubHeader';
	import TextField from '~/components/iOrder-core/menuV2/TextField';
	import Product from '~/components/iOrder-core/menuV2/Product';
	import Icon from '~/components/iOrder-core/uiV2/Icon';
	import GroupHeader from '~/components/iOrder-core/menuV2/GroupHeader';
	import VueScrollTo from 'vue-scrollto';

	export default {
		props: [
			'items',
			'groupName',
			'getProduct',
			'getCG',
			'getKeyWord',
			'addItemToBasket',
			'removeItemFromBasket',
			'getItemCount',
			'cgIndex',
			'isVeg',
			'isVegan',
			'getMatchingBasketItemsChoicesAndPortions'
		],
		components: {
			SubHeader,
			TextField,
			Product,
			Icon,
			GroupHeader
		},
		data () {
			return {
				expanded: true,
				windowWidth: 0,
				breakpoint: 992
			}
		},
		methods: {
			expandAndScroll () {
				if (this.windowWidth < this.breakpoint) {
					this.expanded = !this.expanded;
				}
				if (this.expanded) {
					VueScrollTo.scrollTo(this.$refs.group, 300, { offset: -56 })
				}
			},
			handleResize (event, isPageLoad) {
				this.windowWidth = window.innerWidth;
				if (this.windowWidth > this.breakpoint) {
					this.expanded = true;
				} else if (isPageLoad) {
					this.expanded = false;
				}
			}
		},
		created() {
			window.addEventListener('resize', this.handleResize)
			this.handleResize(null, true);
		},
		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='group'] {
		list-style:none;
		-webkit-tap-highlight-color:transparent;
		[data-element='menu-element-container'] {
			overflow:hidden;
			opacity:0;
			max-height:0;
			transition:max-height 0.2s linear 0.1s, opacity 0.3s linear;
			&.expanded {
				opacity:1;
				max-height:100%;
			}
		}
	}
</style>
