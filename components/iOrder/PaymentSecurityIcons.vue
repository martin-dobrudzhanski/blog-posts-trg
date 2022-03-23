<template>
	<div data-component="payment-icons">
		<p data-element="text">We accept</p>
		<icon
			data-element="visa-icon"
			icon="visa" />
		<icon
			data-element="mastercard-icon"
			icon="mastercard" />
	</div>
</template>

<script>

	import Icon from '~/components/iOrder-core/ui/Icon';

	export default {
		components: {
			Icon
		}
	}
</script>

<style lang="scss" scoped>

[data-component='payment-icons'] {
	display:flex;
	align-items:center;
	padding:0.5em 0 0.5em;
	[data-element='text'] {
		padding:0;
	}
	[data-element='visa-icon'] {
		height:30px;
		width:40px;
		margin-left:10px;
	}
	[data-element='mastercard-icon'] {
		height:30px;
		width:40px;
		margin-left:6px;
	}
}
</style>
