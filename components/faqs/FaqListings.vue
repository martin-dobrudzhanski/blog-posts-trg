<template>
	<aside class="faq-listings">

		<div
			class="section-container"
			v-for="(section, sectionIndex) in faqs"
			:key="sectionIndex">

			<h2 class="heading" data-size="lg" data-weight="normal" data-color="rebrand-orange">
				{{ section.fields.name }}

			</h2>

			<ul>
				<li class="faq-item"
					v-for="(faq, faqIndex) in section.fields.questions">

					<div class="header"
						v-clickToToggle="{ target: sectionIndex.toString() + faqIndex }">
						<h3 class="heading" data-size="md" data-weight="bold" data-color="black">{{faq.fields.question  }}</h3>
						<img class="status-icon"
							v-toggleIcon="{ target: sectionIndex.toString() + faqIndex }"
							src="~assets/img/icons/icon-plus.svg"
							alt="expand-arrow">
					</div>

					<div class="hide text"
						v-toggleTarget="{ target: sectionIndex.toString() + faqIndex }">
								<VueMarkdown :source="faq.fields.response"></VueMarkdown>
					</div>

				</li>
			</ul>
		</div>

	</aside>
</template>

<script>

    import VueMarkdown from 'vue-markdown'
	export default {
		props: ['faqs'],
		components: {
			VueMarkdown
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	a {
		text-decoration: none;
	}

	.faq-listings {
		min-width: 320px;
		max-width: 600px;
		padding: 0 16px;
		margin: 36px auto;
		@include whenScreenIs(mdx) {
			margin-top:0;
		}
		.status-icon {
			position: absolute;
			right: 2px;
			top: 16px;
			@include clickable(true);
		}
		h2.heading {
			overflow: hidden;
			position: relative;
			display:flex;
			align-items:center;
			justify-content: center;
			text-overflow: ellipsis;
			line-height: 30px;
			margin:16px 0 0;
			@include whenScreenIs(mdx) {
				margin:16px 0 0;
			}
		}
		.faq-item {
			padding-top: 8px;
			position: relative;
			.header {
				display:flex;
				align-items:flex-start;
				justify-content:flex-start;
				-webkit-tap-highlight-color:transparent;
				user-select:none;
				cursor:pointer;
				h3 {
					margin:0 auto 8px 0;
					font-size:18px; line-height:22px;
					text-align:left;
					padding: 8px 0px;
					padding-right: 30px;
				}
				h4 {
					margin:0 0 0 auto;
					font-size: 16px; line-height:22px;
					font-weight:500;
					color: $rebrand-orange;
				}
			}
			p {
				color: $black;
				font-weight:500;
				font-size:13px;
				line-height:1.23;
			}
			.text {
				> div {
					margin-bottom:16px;
				}
			}
			border-bottom: solid 2px $rebrand-orange;
		}
	}

</style>
