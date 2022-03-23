<template>
	<h2 data-component="sub-header">
		{{ text }}
	</h2>
</template>

<script>

export default {
	props: [
		'text'
	]
}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';

	[data-component='sub-header'] {
		margin-top:14px;
		margin-bottom:14px;
		color:$rebrand-orange;
		font-weight:bold;
		font-size:16px;
	}
</style>
