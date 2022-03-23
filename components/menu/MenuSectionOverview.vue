<template>
	<div class="library">

		<h3 class="menu-description">
			{{section.fields.description}}
		</h3>

		<h2 class="main">
			{{section.fields.displayName || `${section.fields.name} Menu` | sentance | capitalize}}
			<img
				class="new-icon"
				v-if="section.fields.displayNewTag"
				src="~assets/img/menu-tags/tag-new.svg"
				alt="new-option">
			<nuxt-link class="status-icon" :to="backLink">
				<img src="~assets/img/icons/icon-arrow-left.svg" alt="expand-arrow">
			</nuxt-link>
		</h2>

		<div
			class="section-container"
			v-for="(subSection, index) in section.fields.recipes.Sections"
			:key="index">

			<h2 class="heading" data-size="xs" v-clickToToggle="{ target: index }">
				{{ subSection.Name | capitalize}}

				<img
					v-toggleIcon="{ target: index }"
					class="status-icon"
					src="~assets/img/icons/icon-plus.svg"
					alt="expand-arrow">
			</h2>

			<ul
				class="hide"
				v-toggleTarget="{ target: index }">
				<li
					class="menu-item"
					:class="{ new: isNewOption(item.Desc) }"
					v-for="(item, itemIndex) in subSection.Recipes">

					<div class="header">
						<h3 class="heading">
							{{item.Name | title }}
							<img
								class="veg-icon"
								v-if="isVegOption(item)"
								src="~assets/img/icons/icon-veg.svg"
								alt="vegetarian-option">
							<img
								class="vegan-icon"
								v-if="isVeganOption(item)"
								src="~assets/img/icons/icon-vegan.svg"
								alt="vegan-option">
							<img
								class="new-icon"
								v-if="isNewOption(item.Desc)"
								src="~assets/img/menu-tags/tag-new.svg"
								alt="new-option">
						</h3>



						<h4 v-if="item.Price" class="price">{{ item.Price | gb-price}}</h4>
					</div>

					<!-- mobile screens only -->
					<div class="icons-container">
						<img
							class="new-icon-mobile"
							v-if="isNewOption(item.Desc)"
							src="~assets/img/menu-tags/tag-new.svg"
							alt="new-option">
					</div>

				</li>
			</ul>
		</div>

	</div>
</template>

<script>
	export default {
		props: ['section', 'backLink'],
		methods: {
			isVegOption (item) {
				const intolIds = item.Intols.map(intol => intol.Id).join('|')
				return /50/.test(intolIds)
			},
			isVeganOption (item) {
				const intolIds = item.Intols.map(intol => intol.Id).join('|')
				return /52/.test(intolIds)
			},
			isNewOption (item) {
				const newText = RegExp('_new_');
				return newText.test(item);
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	a {
		text-decoration: none;
	}

	.library {
		min-width: 320px;
		max-width: 560px;
		padding: 0 20px;
		margin: 32px auto 0;
		.status-icon {
			position: absolute;
			right: 2px;
			top: 14px;
			@include clickable(true);
		}
		h2 {
			overflow: hidden;
			position: relative;
			display:flex;
			align-items:center;
			justify-content:flex-start;
			width:100%; height:48px;
			font-size:18px; line-height:1;
			font-weight:700;
			white-space: nowrap;
			text-overflow: ellipsis;
			color: $black;
			user-select:none;
			-webkit-tap-highlight-color:transparent;
			padding-top:4px;
			&.main {
				text-transform: uppercase;
				font-weight:normal;
			}
			&.heading {
				text-transform: capitalize;
			}
			.new-icon {
				height: 20px;
				margin-left: 8px;
				margin-right: 4px;
				@media (max-width: 350px) {
					display:none;
				}
			}
		}
		.section-container {
			&:first-of-type {
				border-top:2px solid $rebrand-orange;
			}
			border-bottom: solid 2px $rebrand-orange;
		}
		.menu-description {
			line-height:1.4;
			margin-bottom:18px;
		}
		.menu-item {
			padding-top: 8px;
			&.new + li {
				@media (max-width: 768px) {
					padding-top:2px;
				}
			}
			&:last-child {
				padding-bottom:12px;
			}
			.header {
				display:flex;
				align-items:flex-start;
				justify-content:flex-start;
				h3 {
					margin:4px 22px 4px 0;
					font-size:16px; line-height:1.5;
					text-align:left;
					color: $black;
				}
				.veg-icon {
					width:24px; height:24px;
					margin-bottom: -6px;
					margin-left: 6px;
				}
				.vegan-icon {
					width: 24px;
					height: 24px;
					margin-bottom: -4px;
					margin-left: 6px;
					position: relative;
					top: 2px;
				}
				.new-icon {
					display: none;
					height: 20px;
					margin-bottom: -4px;
					margin-left: 4px;
					margin-right: 4px;
					@include whenScreenIs('sm') {
						display: inline-block;
					}
				}
				h4 {
					margin:4px 0 4px auto;
					font-size: 16px;
				}
			}
			.icons-container {
				@include whenScreenIs('sm') {
					display: none;
				}
				.new-icon-mobile {
					height: 20px;
					margin-right: 4px;
				}
			}
			p {
					color: $black;
					font-weight:500;
					font-size:13px;
					line-height:1.23;
					padding-bottom:16px;
				}
			&:first-of-type {
				border-top:0 none;
			}
		}
		h2:not(.main) {
			font-weight:normal;
			@include clickable(false);
		}
	}

</style>
