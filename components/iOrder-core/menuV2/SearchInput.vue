<template>
	<div data-element="search-container">
		<form
			data-component="search-input"
			v-on:submit.prevent
		>
			<input
				ref="input"
				data-element="input"
				type="text"
				aria-label="Search for products in menu"
				v-bind:value="searchQuery"
				v-on:input="updateSearchQuery($event.target.value)"
				placeholder="Search"
			/>
		</form>
		<icon
			v-if="!searchQuery"
			icon="search"
			size="sm"
			data-element="icon"
		/>
		<icon
			v-else
			icon="close"
			size="sm"
			data-element="icon"
			@click.native="closeSearch"
			data-clickable
		/>
	</div>
</template>

<script>
	import Icon from '~/components/iOrder-core/uiV2/Icon';

	export default {
		components: {
			Icon
		},
		props: [
			'menu',
			'searchQuery',
			'updateSearchQuery',
			'closeSearch'
		],
		methods: {
			blurInput() {
				this.$refs.input.blur();
			}
		}
	}


</script>

<style lang="scss">
	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-element='search-container'] {
		position:relative;
		height:48px;
		width:100%;
		[data-component='search-input'] {
			height:100%;
			width:100%;
			[data-element='input'] {
				width:100%;
				height:100%;
				border:1px solid $black;
				font-size:16px;
				color:#2b2929;
				font-weight:normal;
				background-color:#fff;
				padding:4px 9px 6px 8px;
				border-radius:0;
				&::placeholder {
					color:$black;
				}
				&:focus::-webkit-input-placeholder { color:transparent; }
				&:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
				&:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
				&:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */
				&:focus {
					border-width:2px;
					padding:4px 3px 6px 8px;
					outline:none;
				}
				&::-ms-clear {
					display: none;
				}
			}
			@include whenScreenIs(mdx) {
				margin-bottom:8px;
			}
		}
		[data-element='icon'] {
			position:absolute;
			right:8px;
			top:50%;
			transform:translateY(-50%);
		}
	}

</style>
