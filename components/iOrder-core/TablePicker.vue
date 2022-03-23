<template>
	<div data-component="number-pad">
		<div data-element="form-container">
			<form data-element="form-row" @submit.prevent="submit">
				<p data-element="field-header">Enter table number:</p>
				<div data-element="input-wrapper">
					<input data-element="display" required :value="currentNumber" />
					<i data-element="carot"></i>
				</div>
				<div data-element="keys">
					<div data-element="key" v-for="i in 9" :key="i" data-key="i" @click="click(i)">
						{{ i }}
					</div>
					<div data-element="key" data-key="del" @click="click('del')">
						DEL
					</div>
					<div data-element="key" data-key="0" @click="click(0)">
						0
					</div>
					<button data-element="key" data-key="ok">
						OK
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>

	import { mapActions } from 'vuex'

	export default {
		props: [
			'tableNumbers',
			'setTableNumber',
			'nextPage'
		],
		data () {
			return {
				currentNumber: ''
			}
		},
		methods: {
			...mapActions({
				flash: 'ui/flash'
			}),
			click (key) {
				if (key === 'del') {
					let str = this.currentNumber;
					this.currentNumber = str.substring(0, str.length - 1)
					return;
				}
				this.currentNumber += key;
			},
			submit () {
				if (this.tableNumbers && this.tableNumbers.find(number => number.toString() === this.currentNumber)) {
					this.setTableNumber(this.currentNumber);
				} else {
					this.flash({ message: 'This table doesn\'t appear to be open. Please ask a member of staff for assistance.' })
					this.currentNumber = ''
				}
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';

	[data-component='number-pad'] {
		display:flex;
		align-items:center;
		justify-content:center;
		width:100%;
		[data-element='form-container'] {
			width:75%;
			max-width:315px;
			margin-top:16px;
			padding:0;
			@media(min-width:350px) {
				margin-top:24px;
			}
			[data-element='form-row'] {
				display:flex;
				flex-direction:column;
				align-items:center;
				justify-content:center;
				margin-bottom:32px;
				[data-element='field-header'] {
					color:$black;
					font-family:tt-norms;
					font-size:16px;
					font-weight:500;
					margin-bottom:8px;
					text-align:center;
					@media(min-width:328px) {
						width:328px;
					}
				}
				[data-element='input-wrapper'] {
					border:1px solid $rebrand-green;
					height:48px; width:100%;
					position:relative;
					display:flex;
					[data-element="carot"] {
						position: absolute;
						width: 1px; height: 70%;
						background-color: gray;
						left: 50%; top: 15%;
						animation-name: blink;
						animation-duration: 800ms;
						animation-iteration-count: infinite;
						opacity: 1;
					}
					input:valid + [data-element="carot"] { display: none; }
					@keyframes blink {
						from { opacity: 1; }
						to { opacity: 0; }
					}
					[data-element='display'] {
						background-color:#fff;
						height:100%; width:100%;
						text-align:center;
						flex-grow:1;
						display:flex;
						justify-content:center;
						align-items:center;
						font-size:30px;
						color:$black;
						font-weight:500;
						border:none;
						pointer-events: none;
						box-shadow: none;
						outline: none;
					}
				}
				[data-element='keys'] {
					display:flex;
					flex-wrap:wrap;
					align-items:flex-start;
					justify-content:space-between;
					margin-top:8px;
					@media(min-width:350px) {
						margin-top:24px;
					}
					[data-element='key'] {
						font-weight:400;
						background-color:$rebrand-green;
						color:#fff;
						display:flex;
						align-items:center;
						justify-content:center;
						width:64px; height:64px;
						margin:8px;
						border-radius:50%;
						border:none;
						font-size:24px;
						-webkit-touch-callout:none;
						-webkit-user-select:none;
						-moz-user-select:none;
						-ms-user-select:none;
						user-select:none;
						&[data-key='del'],
						&[data-key='ok'] {
							font-size: 20px;
							font-weight: 700;
							background-color:#fff;
							color:$black;
							&:active, &:focus {
								color:$rebrand-green;
								background-color:#fff;
								outline:none;
							}
						}
						&:active {
							background-color:$rebrand-green;
						}
					}
				}
			}
		}

	}

</style>
