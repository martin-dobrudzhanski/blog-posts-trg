<template>
	<button
		data-component="clickable-search-icon"
		:data-size="size"
		data-clickable
    :aria-label="display"
    @click="handleClick"
		>
      <div
        data-element="icon"
        :class="{ transform: (display !== 'search') }"
      />
  </button>
</template>

<script>

	export default {
    data () {
      return {
        display: 'search'
      }
    },
    props: [ 'size' ],
    methods: {
      handleClick () {
        if (this.display === 'search') {
          this.display = 'close search'
        } else {
          this.display = 'search';
        }
      }
    }
	}

</script>

<style lang="scss" scoped>

  @import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='clickable-search-icon'] {
		display:inline-flex;
		background-size:100%;
		background-position:center;
		background-repeat:no-repeat;
		flex-shrink:0;
		height:24px; width:24px;
		border: none;
    background-color:transparent;
    position:relative;
    padding:0;
    margin:0;
    &:hover {
      cursor:pointer;
    }
		&[data-clickable] {
			cursor:pointer;
		}
		&[data-size='xxs'] {
			height:16px; width:16px;
		}
		&[data-size='xs'] {
			height:18px; width:18px;
		}
		&[data-size='sm'] {
			height:20px; width:20px;
		}
		&[data-size='md'] {
			// md is default size
		}
		&[data-size='lg'] {
			height:26px; width:27px;
		}
		&[data-size='wd'] {
			height:16px; width:24px;
		}
		&:active, &:focus {
			outline:none;
    }
    [data-element='icon'] {
      position: absolute;
      top: -10px;
      right: 4px;
      display: inline-block;
      background-color: $black;
      width: 7px;
      height: 2px;
      transform: rotate(45deg);
      margin: 24px 1px 0 24px;
      transition: all 200ms ease-in-out;

      &:before {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        background-color: $black;
        transition: all 200ms ease-in-out;
        top:0px;
        right:-5px;
      }

      &:after {
        position: absolute;
        content: '';
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-top: -7px;
        margin-left: -19px;
        box-shadow: 0 0 0 2px $black inset;
        transition: all 200ms ease-in-out;
      }

      &.transform {
        width: 24px;
        margin: 0;
        margin-top: 20px;
        margin-right:-4px;

        &:before {
          transform: rotate(90deg);
          top:0;
          right:0;
        }

        &:after {
          opacity: 0;
          margin-top: 2px;
          margin-left: 13px;
          width: 0;
          height: 0;
        }
      }
    }
	}
</style>
