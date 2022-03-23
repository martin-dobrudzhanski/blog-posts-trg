<template>
  <div data-component="table-picker-modal">
    <icon data-element="close-modal-icon" size="sm" icon="close" :clickable="true" @click.native="closeModal"/>
    <form
      data-element="table-number-form"
      @submit.prevent="handleSubmit"
    >
      <div data-element="form-row">
        <label
          data-element="label"
          for="table"
        >
          Enter your table number
        </label>
        <div data-element="input-wrapper">
          <input
            data-element="input"
            type="number"
            data-vv-name="table"
            v-model="table"
            v-validate="'required'"
          >
        </div>
        <div data-element="error-message">
          {{ errors.first('table') }}
        </div>
        <p
          data-element="error-message"
          v-if="showError"
        >
          Please enter a valid table number
        </p>
      </div>
      <div data-element="btn-container">
        <btn
          text="Confirm"
          :inactive="isDisabled || submitted"
        />
      </div>
    </form>
  </div>
</template>

<script>
  import Btn from '~/components/iOrder-core/uiV2/Btn'
  import Icon from '~/components/iOrder-core/uiV2/Icon'

  export default {
    components: {
      Btn,
      Icon
    },
    props: [
      'appLabel',
      'closeModal'
    ],
    data () {
      return {
        table: null,
        submitted: null,
        showError: null
      }
    },
    computed: {
      isDisabled () {
        return !this.table;
      }
    },
    methods: {
      handleSubmit () {
        this.submitted = true;

        const isValidTable = this.$store.getters[`${this.appLabel}/getTables`].includes(Number(this.table))
        if (!isValidTable) {
          this.showError = true;
          this.submitted = false;
          return
        }
        this.$store.dispatch(`${this.appLabel}/setTableNumber`, { tableNumber: this.table });
        this.closeModal();
      }
    },
    mounted () {
      this.table = this.$store.getters[`${this.appLabel}/getTableNumber`];
    }
  }
</script>

<style lang="scss" scoped>

  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';
  @import '~assets/css/iorder-core/form-row.scss';

  [data-component='table-picker-modal'] {
    position:relative;
    background:#fff;
    min-height:100px;
    width:300px;
    padding-top:16px;
    [data-element='close-modal-icon'] {
      position:absolute;
      top:8px;
      right:8px;
    }
    [data-element='table-number-form'] {
      width:100%;
      padding:0 16px;
      [data-element='form-row'] {
        @extend .form-row;
        padding:0;
        margin-bottom:10px;
        [data-element='label'] {
          font-size:16px;
          color:$black;
          font-weight:bold;
          padding-bottom:16px;
        }
        [data-element='input'] {
          font-size:18px;
          font-weight:bold;
          background-color:#fff;
          text-align:center;
          border-radius:0;
          border:1px solid $rebrand-green;
          width:100%;
          height:48px;
          &::-ms-clear {
            display: none;
          }
        }
      }
      [data-element='btn-container'] {
        padding:8px 0;
      }
    }
  }
</style>
