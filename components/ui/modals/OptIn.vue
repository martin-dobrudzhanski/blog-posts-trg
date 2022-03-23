<template>
	<div class="opt-in">
		<div class="checkbox gdpr-input">
			<input type="checkbox"
				v-model="optIn"
				class="checkbox-input" id="checkbox">
			<label class="checkbox-label" for="checkbox">We would like to send you special offers, discount vouchers and news about Chiquito by email. If you do not want to receive these, please tick the box. For further information see our Privacy Policy.</label>
		</div>
		<button class="btn" data-size="md" @click.prevent="submitOptIn">Continue</button>
	</div>
</template>

<script>
	export default {
		props: ['close'],
		data () {
			return {
				optIn: false,
			}
		},
		computed: {
			submissionData () {
				return {
					optIn: !this.optIn
				}
			}
		},
		methods: {
			submitOptIn () {
				this.$store.dispatch('auth/updateOptIn', this.submissionData)
				this.close();
			}
		}
	}
</script>

<style lang="scss">
	.opt-in {
		display:flex;
		flex-direction:column;
		align-items:center;
		justify-content:flex-start;
		width:100%;
		.gdpr-input {
			margin:15px 0 40px;
		}
	}
</style>