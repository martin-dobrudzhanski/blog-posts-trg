<template>
	<div class="library">

		<div class="section-container"
				v-for="(section, index) in sections">
			<nuxt-link :to="getSectionLink(section)">

				<h2>{{ section.fields.displayName || `${section.fields.name.replace(/-/g, ' ')} menu` }}
					<img
						class="new-icon"
						v-if="section.fields.displayNewTag"
						src="~assets/img/menu-tags/tag-new.svg"
						alt="new-option">
					<img
						class="status-icon"
						src="~assets/img/icons/icon-arrow-right.svg" alt="expand-arrow">
				</h2>

			</nuxt-link>

		</div>

	</div>
</template>

<script>
	export default {
		props: ['menu', 'restSlug'],
		computed: {
			sections () {
				return this.menu && this.menu.fields && this.menu.fields.sections ||
							 this.menu && this.menu && this.menu.sections || []
			}
		},
		methods: {
			getSectionLink(section) {
				const name = section.fields.name
				return this.restSlug ? `/restaurants/${this.restSlug}/menu/${name}` : `/menu/${name}`
			}
		}
	}

</script>

<style lang="scss" scoped>
	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';
		a {
			text-decoration: none;
			-webkit-tap-highlight-color:transparent;
			user-select:none;
		}
		.library {
			min-width: 320px;
			max-width: 560px;
			padding: 0 20px 0;
			margin: 0 auto;
			.section-container {
				position: relative;
			}
			.section-list-item {
				a { position: static; }
			}
			h2 {
				overflow: hidden;
				position: relative;
				display:flex;
				align-items:center;
				justify-content:flex-start;
				height:48px;
				text-transform:uppercase;
				text-overflow:ellipsis;
				white-space: nowrap;
				color: $black;
				border-bottom:2px solid $rebrand-orange;
				@include clickable(false);
				font-size:18px;
				-webkit-tap-highlight-color:transparent;
				user-select:none;
				.new-icon {
					height: 20px;
					margin-left: 8px;
					margin-right: 4px;
					@media (max-width: 350px) {
						display:none;
					}
				}
				.status-icon {
					position: absolute;
					right: 2px;
					top: 14px;
					@include clickable(true);
				}
			}
			h2.restaurant {
				color: $rebrand-orange;
				padding-right: 30px;
			}
		}

</style>
