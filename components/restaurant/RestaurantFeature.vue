<template>
	<span class="feature"
		v-tooltip.top.end="{content: feature.fields.description, delay: 0, offset: 16}">
		<img v-if="showIcon('access')" src="~assets/img/icons/icon-dis-off.svg">
		<img v-if="showIcon('bowling')" src="~assets/img/icons/icon-bowl-off.svg">
		<img v-if="showIcon('parking')" src="~assets/img/icons/icon-park-off.svg">
		<img v-if="showIcon('cinema')" src="~assets/img/icons/icon-cinema-off.svg">
	</span>
</template>

<script>
  export default {
    props: ['feature', 'offset'],
    methods: {
      showIcon(text) {
        return new RegExp(text, 'i').test(this.feature.fields.name)
      }
    }
  }
</script>

<style scoped>
  .feature {
    margin:0 3px;
		user-select:none;
		-webkit-tap-highlight-color:transparent;
		&:first-child {
			margin-left:0;
		}
		&:last-child {
			margin-right:0;
		}
    img {
			display:block;
      width:24px; height:27px;
    }
  }

</style>
