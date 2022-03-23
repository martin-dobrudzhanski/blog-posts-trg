<script>
	export default {
		render () {
			if (this.$store.state.ui.appPlatform === 'android') {
				return;
			}
			if (process.env.NODE_ENV === 'development' &&
					this.$slots.default                    &&
					this.$slots.default.length > 1)        {
				throw new Error('[no-app] You cannot use multiple child components');
			}
			return this.$slots.default && this.$slots.default[0];
		}
	}
</script>
