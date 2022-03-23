<template>
	<section class="facilities-group" v-if="facilities">
		<Feature v-for="(facility, index) in facilities" :key="index" :feature="facility" :offset="offset" />
	</section>
</template>

<script>

	import Feature from '~/components/restaurant/RestaurantFeature.vue'

	export default {
		props: ['facilities', 'offset'],
		components: { Feature }
	}
</script>

<style scoped>

	section.facilities-group {
		display:flex;
	}
	
</style>
