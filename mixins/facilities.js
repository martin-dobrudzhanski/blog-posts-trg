export default {
	data () {
		return {
			facilitiesWeHaveIconsFor: [
				'access',
				'bowling',
				'parking',
				'cinema'
			]
		}
	},
	computed: {
		getFacilities () {
			if (!this.facilities) {
				return false;
			}
			return this.facilities.filter((item) => {
				return this.facilitiesWeHaveIconsFor.some((str) => {
					return new RegExp(str, 'i').test(item.fields.name);
				});
			})
		}
	}
}
