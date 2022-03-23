<template>
	<div data-component="voucher-input" :class="{ mobile }">
				<div data-element="voucher-input-container">
					<div
					data-element="voucher-prompt"
					:class="{ clickable: !voucherApplied }"
					@click="toggleExpanded"
					>
					<p
						data-element="text"
						>
						Do you have a voucher code?
					</p>
					<icon
						icon="collapse-arrow-light"
						size="xs"
						data-element="icon"
						data-clickable
						:class="{rotated: (mobile && expanded || !mobile && !expanded)}"
						/>
					</div>
					<transition name="expand">
						<form
							data-element="voucher-form"
							v-if="expanded"
							@submit.prevent="handleSubmit"
							>
						<input
							data-element="input"
							type="text"
							v-model="voucherCode"
							placeholder="Enter code here"
							aria-label="Enter voucher code"
							:disabled="voucherApplied"
							>
						<btn
							data-element="button"
							:text="buttonText"
							:loading="checkingVoucher"
							:inactive="voucherApplied"
							/>
					</form>
				</transition>
				<transition name="fade-in">
					<div
						v-if="voucherApplied"
						data-element="voucher-confirm"
          >
            <div>
              <p class="confirm-text">{{ confirmText }} </p>
              <p class="void-voucher" @click.prevent="voidVoucher(voucherCode)">Remove&nbsp;voucher</p>
            </div>
          </div>
				</transition>
			</div>
	</div>
</template>

<script>

	import Icon from '~/components/iOrder-core/uiV2/Icon';
	import Btn from '~/components/iOrder-core/uiV2/Btn';

	export default {
		components: {
			Icon,
			Btn
		},
		props: [
			'mobile',
			'submitVoucher',
      'voidVoucher',
			'checkingVoucher',
			'voucherApplied'
		],
		computed: {
			buttonText () {
				return this.voucherApplied ? 'Applied' : 'Apply';
			},
			formattedVoucherCode () {
				return this.voucherCode.toUpperCase();
			},
			confirmText () {
				return `Your ${this.voucherApplied.detail} voucher will be applied at checkout`;
			}
		},
		data () {
			return {
				expanded: false,
				voucherCode: ''
			}
		},
		methods: {
			toggleExpanded () {
			  this.expanded = !this.expanded;
			},
			handleSubmit () {
				this.submitVoucher(this.formattedVoucherCode);
			}
		},
		created () {
			if (this.voucherApplied) this.voucherCode = this.voucherApplied.code;
		}
	}
</script>

<style lang="scss" scoped>
	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='voucher-input'] {
		width:100%;
		max-width:456px;
		padding:0 16px;
		display:flex;
		flex-direction:column;
		background-color:$white;
		&.mobile {
			background-color:$rebrand-very-light-pink;
			-webkit-box-shadow: 0px -2px 6px -1px rgba(10,10,10,0.2);
			-moz-box-shadow: 0px -2px 6px -1px rgba(10,10,10,0.2);
			box-shadow: 0px -2px 6px -1px rgba(10,10,10,0.2);
			@media (min-width:457px) {
				box-shadow:none;
			}
		}
		[data-element='voucher-prompt'], [data-element='voucher-confirm'] {
			display:flex;
			justify-content:center;
			align-items:center;
			width:100%;
			height:40px;
      line-height: 1.3;
      .confirm-text {
        display: inline;
      }
      .void-voucher {
        text-decoration: underline;
        display: inline;
      }
			&.clickable {
				&:hover {
					cursor:pointer;
				}
			}
			[data-element='text'] {
				font-size:16px;
				color:$black;
				font-weight:700;
			}
			[data-element='icon'] {
				margin:2px 0 0 5px;
				-webkit-transition: all 0.5s ease-in-out;
				-o-transition: all 0.5s ease-in-out;
				transition: all 0.5s ease-in-out;
				-webkit-transform: rotate(180deg);
				-ms-transform: rotate(180deg);
				-o-transform: rotate(180deg);
				transform: rotate(180deg);
				&.rotated {
					-webkit-transform:none;
					-ms-transform:none;
					-o-transform:none;
					transform:none;
				}
			}
		}
		[data-element='voucher-confirm'] {
      font-size: 14px;
      color: $rebrand-orange;
      font-weight: 700;
      text-align: center;
      height: 40px;
      @include whenScreenIs(mdx) {
        height: 60px;
      }
		}
		[data-element='voucher-form'] {
			display:flex;
			margin-bottom:8px;
			@include whenScreenIs(mdx) {
				margin-bottom:16px;
			}
			[data-element='input'] {
				border:1px solid $rebrand-blue;
				font-size:16px;
				font-weight:700;
				text-transform:uppercase;
				background-color:#fff;
				padding:4px 9px 6px 3px;
				margin-right:4px;
				width:182px;
				height:48px;
				text-align:center;
				box-sizing:border-box;
				opacity:1;
				flex-grow:1;
				border-radius:0;
				&::placeholder {
					color:$black;
					font-weight:400;
					text-transform:none;
				}
				&:focus::-webkit-input-placeholder { color:transparent; }
				&:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
				&:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
				&:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */
				&:focus {
					outline:none;
					border-width:1.5px;
				}
				&::-ms-clear {
					display: none;
				}
			}
			[data-element='button'] {
				margin-left:4px;
				opacity:1;
				width:120px;
			}
			overflow:hidden;
		}
		.expand-enter-active, .expand-leave-active {
			transition: max-height 0.7s ease, margin-bottom 0.7s ease;
			max-height:104px;
		}
		// &.mobile {
			.expand-enter-active {
				[data-element='voucher-form'], [data-element='input'], [data-element='button'] {
					transition:opacity 0.4s linear;
				}
			}
			.expand-leave-active {
				[data-element='voucher-form'], [data-element='input'], [data-element='button'] {
					transition:opacity 0.4s linear;
				}
			}
		// }
		.expand-enter, .expand-leave-to {
			max-height:0;
			margin-bottom:0;
			[data-element='voucher-form'], [data-element='input'], [data-element='button'] {
				opacity:0;
			}
		}
	}
</style>
