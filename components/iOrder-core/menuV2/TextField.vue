<template>
	<p data-component="text-field">
		{{ text }}
	</p>
</template>

<script>

export default {
	props: [
		'text'
	]
}

</script>

<style lang="scss" scoped>

	[data-component='text-field'] {
		font-size:16px;
		font-weight:500;
		line-height:1.19;
		margin-top:14px;
		margin-bottom:8px;
	}
</style>
