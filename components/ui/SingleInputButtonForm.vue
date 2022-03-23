<template>
  <form ref="singleInputForm" @submit.prevent="submit" class="single-input-form">
    <div class="control">
      <input
        :type="type"
        :name="name"
        :id="type"
        v-model="inputValue"
        :v-validate="verify && `required|verify_${type}`"
        :data-invalid="errors.has(type)"
        :data-vv-name="type"
        data-size="xl"
        :placeholder="placeholder"
      />
    </div>
    <button class="heading search-btn" data-size="xl" data-weight="black">{{buttonText}}</button>
  </form>
</template>

<script>
export default {
  name: 'SingleInputButtonForm',
  data: () => ({
      inputValue: ''
  }),
  methods: {
      submit() {
          this.$validator.validateAll().then(res => {
              if(res) this.$emit('submit', this.inputValue)
          })
      }
  },
  props: {
      type: {
          type: String,
          required: true
      },
      name: {
          type: String,
          required: true
      },
      placeholder: {
          type: String,
          required: false
      },
      verify: {
          type: String
      },
      buttonText: {
          type: String,
          required: true
      }
  }
}
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
.single-input-form {
  padding: 15px 0 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  .control {
    min-width: 55%;
    flex: 1;
    margin-right: 5px;
    margin-bottom: 0;
    input {
      text-align: left;
      padding: 10px;
    }
    input::placeholder {
      color: $grey;
      text-align: left;
    }
  }
  button.search-btn {
    flex: 1;
    border: none;
    margin-bottom: 0;
    color: $white;
    font-size: 26px;
    background: $rebrand-blue;
  }
}
</style> 