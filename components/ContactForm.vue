<template>

	<div class="contact-form form-container" data-size="lg">
		<h1 class="form-heading" data-size="lg">Contact us</h1>
		<p class="form-intro" data-size="lg">Our <nuxt-link to="/faqs">FAQ’s</nuxt-link> could have all the answers,  have look before filling out the form below</p>

		<form class="form" data-size="lg">

			<div class="field">
				<div class="field-header">
					<label for="restaurant">Restaurant visited:<span class="required">*</span></label>
				</div>
				<div class="control input">
					<input v-model="restaurant" id="restaurant" v-validate="'required'" :data-invalid="errors.has('restaurant')" name="restaurant" type="text" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('restaurant')" class="help">{{ errors.first('restaurant') }}</p>
				</div>
			</div>

			<div class="field">
				<div class="field-header">
					<label for="dob">Receipt number:<span class="required">*</span></label>
				</div>
				<div class="control input">
					<input v-model="receipt" id="receipt" v-validate="'required'" :data-invalid="errors.has('receipt')" name="receipt" type="text" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('receipt')" class="help">{{ errors.first('receipt') }}</p>
				</div>
			</div>

			<div class="field">
				<div class="field-header">
					<label for="email">Email address:<span class="required">*</span></label>
				</div>
				<div class="control input">
					<input v-model="email" id="email" v-validate="'required'" :data-invalid="errors.has('receipt')" name="email" type="email" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('email')" class="help">{{ errors.first('email') }}</p>
				</div>
			</div>

			<div class="field">
				<div class="field-header">
					<label for="tel">Telephone number:<span class="required">*</span></label>
				</div>
				<div class="control input">
					<input v-model="tel" id="tel" v-validate="'required'" :data-invalid="errors.has('tel')" name="tel" type="tel" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('tel')" class="help">{{ errors.first('tel') }}</p>
				</div>
			</div>

			<div class="field">
				<div class="field-header">
					<label for="subject">Subject:<span class="required">*</span></label>
				</div>
				<div class="control input">
					<input v-model="subject" id="subject" v-validate="'required'" :data-invalid="errors.has('subject')" name="subject" type="text" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('subject')" class="help">{{ errors.first('subject') }}</p>
				</div>
			</div>

			<div class="field">
				<div class="field-header">
					<label for="message">Message:<span class="required">*</span></label>
				</div>
				<div class="control textarea">
					<textarea v-model="message" id="message" v-validate="'required'" class="textarea" :data-invalid="errors.has('message')" name="message"></textarea>
				</div>
				<div class="field-footer">
					<p v-show="errors.has('message')" class="help">{{ errors.first('message') }}</p>
				</div>
			</div>

			<div class="field" data-grouped>
				<div class="controls">
					<a class="btn" :data-loading="isLoading" @click.prevent="submit">Submit</a>
				</div>
			</div>

		</form>

	</div>

</template>

<script>

	import axios from '~/plugins/axios';

	export default {
		data () {
			return {
				isLoading:   false,
				restaurant:  null,
				receipt:     null,
				email:       null,
				tel:         null,
				subject:     null,
				message:     null,
				password:    null,
				errorMsg:    null
			}
		},
		methods: {
			submit () {
				this.$validator.validateAll().then((result) => {
					if (!result) {
						return;
					}
					this.isLoading = true;
					return axios.post('/api/login', {
						email:        this.email,
						password:     this.password
					})
					.then((res) => {
						this.isLoading = false;
						if (res.data.success === false) {
							// TODO: Use vuex action here to add a generic api fail error.
							// this.errorMsg = res.errors[0];
							this.errorMsg = 'Something has gone wrong.';
							return;
						}
						if (res.data.success === true) {
							// This is where we redirect to the wallet or profile pages
							// this.sent = true;
							window.location = '/profile/wallet';
							return;
						}
						this.errorMsg = '';
					});
				});
			}
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

</style>
