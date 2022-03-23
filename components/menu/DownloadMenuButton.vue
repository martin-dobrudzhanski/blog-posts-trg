<template>
	<no-android>
		<a class="btn download-menu" :data-color="screen === 'desktop' ? 'white' : ''" data-size="lg" target="_blank" :href="target">Download menu</a>
	</no-android>
</template>

<script>
	import NoAndroid from '~/components/ui/NoAndroid.vue'

	export default {
		props: ['target', 'screen'],
		components: {
			NoAndroid
		}
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.download-menu {
		align-items:center;
		justify-content:center;
		min-width: 207px;
	}

</style>
