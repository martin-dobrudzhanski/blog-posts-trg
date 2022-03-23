<template>
	<div
		data-component="menu-component"
		id="menu-page-container"
	>
		<div
			data-element="menu-nav-container"
			id="menu-nav-container"
			v-if="!mobileOnly"
		>
			<no-ssr>
				<affix
					relative-element-selector="#menu-page-container"
				>
					<div data-element="menu-nav">
						<search-input
							:searchQuery="searchQuery"
							:updateSearchQuery="updateSearchQuery"
							:closeSearch="closeSearch"
						/>
						<div data-element="outer-container">
							<div data-element="scrollable-container">
								<div data-element="menu-categories-container">
									<scrollactive
										v-if="loaded"
										data-element="menu-categories"
										:scrollContainerSelector="`#menu-component`"
										:highlightFirstItem="true"
										:modifyUrl="false"
										:offset="63"
										:tag="`div`"
									>
										<a
											data-element="category"
											v-for="(group, groupIndex) in menu.display.displayGroups"
											v-if="!isHidden(group.groupName)"
											:href="getHref(group.groupName)"
											class="scrollactive-item"
											:class="{ 'scrollactive-first': groupIndex === 0 }"
											ref="scrollactive"
										>
											{{ group.groupName }}
										</a>
									</scrollactive>
								</div>
								<p
									data-element="dietary-requirements-link"
									@click="showAllergyModal"
								>
									Dietary Requirements
								</p>
							</div>
						</div>
					</div>
				</affix>
			</no-ssr>
		</div>
		<div
			data-element="search-input-mobile"
			v-if="showMobileSearchInput"
		>
			<search-input
				ref="mobileSearchInput"
				:searchQuery="searchQuery"
				:updateSearchQuery="updateSearchQuery"
				:closeSearch="closeSearch"
			/>
		</div>
		<p
			data-element="dietary-requirements-link-mobile"
			@click="showAllergyModal"
		>
			Dietary Requirements
		</p>
		<no-ssr>
			<div data-element="menu-container">
				<p v-if="allergyMessage" v-text="allergyMessage" class="allergy-message" />
				<no-ssr>
					<ul
						data-element="menu"
						v-if="showFullMenu"
						id="menu-component"
					>
						<menu-group
							v-for="(group, groupIndex) in menu.display.displayGroups"
							v-if="!isHidden(group.groupName)"
							:id="setId(group.groupName)"
							:key="groupIndex"
							:items="group.items"
							:groupName="group.groupName"
							:getProduct="getProduct"
							:getCG="getCG"
							:getKeyWord="getKeyWord"
							:addItemToBasket="addItemToBasket"
							:removeItemFromBasket="removeItemFromBasket"
							:getItemCount="getItemCount"
							:cgIndex="cgIndex"
							:isVeg="isVeg"
							:isVegan="isVegan"
							:getMatchingBasketItemsChoicesAndPortions="getMatchingBasketItemsChoicesAndPortions"
						/>
					</ul>
					<ul
						data-element="menu"
						v-else
					>
						<transition-group
							v-if="showFilteredMenu"
							name="fade"
						>
							<product
								v-for="(item, itemIndex) in filteredMenu"
								:key="itemIndex + 1"
								:product="item.product"
								:getProduct="getProduct"
								:getCG="getCG"
								:cgIndex="cgIndex"
								:getKeyWord="getKeyWord"
								:addItemToBasket="addItemToBasket"
								:getItemCount="getItemCount"
								:removeItemFromBasket="removeItemFromBasket"
								:isVeg="isVeg"
								:isVegan="isVegan"
								:getMatchingBasketItemsChoicesAndPortions="getMatchingBasketItemsChoicesAndPortions"
							/>
						</transition-group>
						<li
							data-element="no-result-message"
							v-else
						>
							<p v-if="searchQuery.length">
								Oops, no products found, please try again.
							</p>
						</li>
					</ul>
				</no-ssr>
			</div>
		</no-ssr>
		<div
			data-element="basket-container"
			id="basket-container"
			v-if="!mobileOnly"
		>
			<no-ssr>
				<affix relative-element-selector="#menu-page-container" >
					<div
						data-element="basket"
						v-if="basketLink && loaded"
					>
						<checkout-btn
							:handleClick="handleCheckoutBtnClick"
							:basketTotal="basketTotal"
							:basketCount="basketCount"
							:inactive="!basketCount"
							:loading="loading"
							text="Checkout"
						/>
						<info-block>
							<div>
								<transition
									name="fade"
									mode="out-in"
								>
									<div
										v-if="basket.lines.length"
										data-element="basket-lines"
									>
										<line-item
											v-for="(lineItem, index) in reverseLines"
											:getProduct="getProduct"
											:key="$uuid.v4()"
											:lineItem="lineItem"
											:removeItemFromBasket="removeItemFromBasket"
											:addItemToBasket="addItemToBasket"
											:incrementBasketItem="incrementBasketItem"
											:decrementBasketItem="decrementBasketItem"
											:getCG="getCG"
											:cgIndex="cgIndex"
											:getBasketIndex="getBasketIndex"
											:editBasketChoices="editBasketChoices"
											:displayProduct="getDisplayProduct(lineItem)"
											:choiceGroups="getChoiceGroups(lineItem)"
										/>
									</div>
									<p
										v-else
										data-element="empty-text"
									>
										{{ emptyText }}
									</p>
								</transition>
							</div>
						</info-block>
					</div>
				</affix>
			</no-ssr>
		</div>
		<no-ssr>
			<div v-if="showModal">
				<transition name="fade">
					<modal-container data-element="modal-container" :closeModal="closeModal">
						<allergy-advice data-element="allergy-advice-modal" :closeModal="closeModal"/>
					</modal-container>
				</transition>
			</div>
		</no-ssr>
	</div>
</template>

<script>

	import DynamicLink    from '~/components/iOrder-core/uiV2/DynamicLink';
	import AllergyAdvice  from '~/components/iOrder-core/modalsV2/AllergyAdvice';
	import ModalContainer from '~/components/iOrder-core/modalsV2/ModalContainer';
	import MenuGroup      from '~/components/iOrder-core/menuV2/MenuGroup';
	import SearchInput    from '~/components/iOrder-core/menuV2/SearchInput';
	import Product        from '~/components/iOrder-core/menuV2/Product';
	import UpsellModal    from '~/components/iOrder-core/modalsV2/UpsellModal';
	import NoSSR          from 'vue-no-ssr';
	import menuAndBasket  from '~/mixins/iOrder-core/menuAndBasket';

	export default {
		components: {
			DynamicLink,
			AllergyAdvice,
			MenuGroup,
			SearchInput,
			Product,
			UpsellModal,
			ModalContainer
		},
		mixins: [ menuAndBasket ],
		data () {
			return {
				searchQuery: '',
				showModal: null
			}
		},
		props: [
			'loaded',
			'menu',
			'addItemToBasket',
			'removeItemFromBasket',
			'getMatchingBasketItemsChoicesAndPortions',
			'basketLink',
			'handleCheckoutBtnClick',
			'loading',
			'emptyText',
			'appLabel',
			'mobileOnly',
			'toggleSearch',
			'allergyMessage'
		],
		computed: {
			flattenedMenu () {
				const flattenedArray = [];
				this.menu && this.menu.display && this.menu.display.displayGroups.forEach(group => {
					if (group.groupName !== 'Upsell') {
						group.items.forEach(item => {
							if (item.itemType === 'product') {
								flattenedArray.push(item);
							}
						});
					}
				});
				return flattenedArray;
			},
			filteredMenu () {
				return this.flattenedMenu.reduce((arr, item) => {
					if (arr.length >= 20) return arr;
					if ( item.product.displayName.toLowerCase().includes(this.searchQuery.toLowerCase()) ) {
						arr.push(item);
					};
					return arr;
				}, []);
			},
			reverseLines () {
				return this.basket.lines.slice().reverse();
			},
			showMenuSearch () {
				return this.$store.getters['ui/showMenuSearch'];
			},
			showMobileSearchInput () {
				if (!this.toggleSearch || this.showMenuSearch) {
					return true;
				}
				return false;
			},
			showFullMenu () {
				if (this.loaded &&
					this.searchQuery.length < 2 &&
					!this.showMenuSearch) {

					return true;
				}
				return false;
			},
			showFilteredMenu () {
				if (!this.showMenuSearch && this.filteredMenu.length) {
					return true;
				}
				if (this.showMenuSearch && this.searchQuery.length && this.filteredMenu.length) {
					return true;
				}
				return false;
			}
		},
		methods: {
			closeModal () {
				this.showModal = false;
			},
			removeActiveClass () {
				// used to counteract a bug on scrollactive which doesn't add active class to first scrollactive item
				this.$refs.scrollactive[0].classList.remove('scrollactive-first');
			},
			showAllergyModal () {
				this.showModal = true;
			},
			removeIsActive () {
				this.$refs.scrollactive[0].classList.remove('is-active');
			},
			isVeg (productId) {
				return this.getProduct(productId).displayRecords &&
							 this.getProduct(productId).displayRecords[0].keywords &&
							 this.getProduct(productId).displayRecords[0].keywords.includes(301);
			},
			isVegan (productId) {
				return this.getProduct(productId).displayRecords &&
							 this.getProduct(productId).displayRecords[0].keywords &&
							 this.getProduct(productId).displayRecords[0].keywords.includes(302);
			},
			getHref (groupName) {
				const id = this.setId(groupName);
				return `#${id}`;
			},
			setId (groupName) {
				const id = groupName.toLowerCase().split(' ').join('-');
				return id;
			},
			isHidden (name) {
				return name === 'Upsell';
			},
			updateSearchQuery (query) {
				this.searchQuery = query;
				if (this.searchQuery &&
						this.searchQuery.length > 1) {
					window.removeEventListener('scroll', this.handleFilteredMenuScroll);
					window.scrollTo(0,0);
				}
				window.addEventListener('scroll', this.handleFilteredMenuScroll);
			},
			closeSearch () {
				this.searchQuery = '';

				// mobileOnly apps do not have a side menu
				if (this.mobileOnly) {
					return
				}

				if (!this.searchQuery) this.$refs.scrollactive[0].classList.add('scrollactive-first');
				window.scrollTo(0,0);
			},
			handleResize() {
				this.windowWidth = window.innerWidth;
				if (this.windowWidth > this.breakpoint) {
					return this.screenIsMd = true;
				}
				this.screenIsMd = false;
			},
			getActiveElement () {
				let activeElement;

				// mobileOnly apps do not have a side menu
				if (this.mobileOnly) {
					return
				}

				this.$refs.scrollactive.forEach(element => {
					if (element.classList.contains('is-active')) activeElement = element;
				})
				return activeElement;
			},
			firstItemIsActive () {
				const activeElement = this.getActiveElement();
				if (!activeElement) {
					return true;
				}
				return this.$refs.scrollactive[0] === activeElement;
			},
			showAllergyModal () {
				this.showModal = true;
			},
			handleFilteredMenuScroll () {
				this.$refs.mobileSearchInput.blurInput();
				window.removeEventListener('scroll', this.handleFilteredMenuScroll);
			}
		},
		created () {
			this.initMixin(`${this.appLabel}`);
		},
		mounted () {
			if (!this.mobileOnly) {
				window.addEventListener('scroll', this.removeActiveClass);
			}
		},
		destroyed () {
			if (!this.mobileOnly) {
				window.removeEventListener('scroll', this.removeActiveClass);
			}
		},
		watch: {
			searchQuery () {
				// mobileOnly apps do not have a side menu
				if (this.mobileOnly) {
					return
				}

				if (this.searchQuery &&
						this.searchQuery.length > 1) {

					this.removeActiveClass()
					this.removeIsActive()

				} else if (!this.searchQuery ||
									 this.searchQuery.length === 1 &&
									 this.firstItemIsActive()) {

					this.$refs.scrollactive[0].classList.add('scrollactive-first');
				}
			},
			showMenuSearch () {
				this.searchQuery = '';
				if (!this.showMenuSearch) {
					window.removeEventListener('scroll', this.handleFilteredMenuScroll);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='menu-component'] {
		margin:0 auto;
		display:flex;
		flex-direction:column;
		max-width:456px;
		@include whenScreenIs(mdx) {
			max-width:none;
			flex-direction:row;
			padding-top:42px;
		}
		[data-element='no-result-message']{
			text-align:center;
			margin-top:10px;
		}
		[data-element='menu-nav-container'] {
			height:auto;
			padding:0 16px;
			display:none;
			@include whenScreenIs(mdx) {
				padding:0;
				margin-left:12px;
				width:160px;
				height:800px;
				display:block;
			}
			[data-element='menu-nav'] {
				@include whenScreenIs(mdx) {
					width:152px;
				}
				[data-element='outer-container'] {
					@include whenScreenIs(mdx) {
						height:80vh;
						width:152px;
						position:relative;
						overflow:hidden;
						margin-top:8px;
					}
					[data-element='scrollable-container'] {
						@include whenScreenIs(mdx) {
							position:absolute;
							left:0;
							-ms-overflow-style:none;
							scrollbar-width:none;
							overflow-y:auto;
							overflow-x:hidden;
							height:80vh;
							width:152px;
							padding-bottom:100px;
							&:-webkit-scrollbar {
								display:none;
							}
						}
						div.scrollactive-nav { overflow:hidden }
						[data-element='menu-categories-container'] {
							display:none;
							@include whenScreenIs(mdx) {
								display:block;
								width:170px; // to hide scrollbar on Firefox
							}
							[data-element='menu-categories'] {
								display:none;
								@include whenScreenIs(mdx) {
									display:block;
								}
								[data-element='category'] {
									display:block;
									min-height:40px;
									border-bottom:2px solid rgba(201, 100, 26, .2);
									font-size:22px;
									padding:13px 18px 7px 8px;
									color:$rebrand-orange;
									font-family:$display-font;
									text-transform:uppercase;
									font-weight:normal;
									&.is-active, &.scrollactive-first {
										text-decoration:none;
										border-color:$rebrand-orange;
									}
								}
							}
						}
						[data-element='dietary-requirements-link'] {
							margin-top:16px;
							margin-bottom:16px;
							color:$black;
							line-height:1.33;
							text-decoration:underline;
							font-size:12px;
							font-weight:500;
							padding-left:8px;
							&:hover {
								cursor:pointer;
							}
						}
					}
				}
			}
		}
		[data-element='search-input-mobile'] {
			width:100%;
			height:48px;
			padding:0 16px;
			@include whenScreenIs(mdx) {
				display:none;
			}
		}
		[data-element='dietary-requirements-link-mobile'] {
			padding:12px 0;
			margin-bottom:8px;
			color:$black;
			line-height:1.33;
			text-decoration:underline;
			font-size:12px;
			font-weight:500;
			text-align:center;
			&:hover {
				cursor:pointer;
			}
			@include whenScreenIs(mdx) {
				display:none;
			}
		}
		[data-element='menu-container'] {
			margin:0 16px 64px;
			max-width:456px;
			flex-grow:1;
			@include whenScreenIs(mdx) {
				margin:0 0px 64px 0px;
				padding:0 38px 0 40px;
			}

			.allergy-message {
				font-style: italic;
				padding-bottom: 16px;
			}

			[data-element='menu'] {

				.fade-leave-active, .fade-enter-active {
					transition: opacity .2s;
				}
				.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
					opacity: 0;
				}
			}
		}
		[data-element='basket-container'] {
			display:none;
			width:314px;
			margin-right:12px;
			height:188px;
			@include whenScreenIs(mdx) {
				display:block;
			}
			[data-element='empty-text'] {
				font-size:14px;
				font-weight:normal;
				padding:16px;
				text-align:center;
			}
		}
		[data-element='modal-container'] {
			display:flex;
			align-items:flex-start;
		}
		.fade-enter-active, .fade-leave-active {
			transition:opacity .5s;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
			opacity:0;
		}
	}
</style>
