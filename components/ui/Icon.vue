<template>
	<div v-if="!clickable"
		data-component="icon"
		:data-icon="icon"
		:data-size="size"
		:style="style"
		:aria-label="icon"
		/>
	<button v-else
		data-component="icon"
		:data-icon="icon"
		:data-size="size"
		:style="style"
		data-clickable
		:aria-label="icon"
		/>
</template>

<script>

	export default {
		props: [ 'size', 'icon', 'clickable' ],
		computed: {
			backgroundImage () {
				return require(`~/assets/img/iorder-coreV2/icons/${this.icon}.svg`);
			},
			style () {
				return {
					'background-image': `url(${this.backgroundImage})`
				}
			}
		}
	}

</script>

<style lang="scss" scoped>

	[data-component='icon'] {
		display:inline-flex;
		background-size:100%;
		background-position:center;
		background-repeat:no-repeat;
		flex-shrink:0;
		// md is default size
		height:24px; width:24px;
		border: none;
		background-color:transparent;
		&[data-clickable] {
			cursor:pointer;
		}
		&[data-size='xxs'] {
			height:16px; width:16px;
		}
		&[data-size='xs'] {
			height:18px; width:18px;
		}
		&[data-size='sm'] {
			height:20px; width:20px;
		}
		&[data-size='md'] {
			// md is default size
		}
		&[data-size='lg'] {
			height:26px; width:27px;
		}
		&[data-size='wd'] {
			height:16px; width:24px;
		}
		&:active, &:focus {
			outline:none;
		}
	}
</style>
