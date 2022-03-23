<template>
  <label class="toggle-button">
    <input
      class="toggle-button__input"
      type="checkbox"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
    />
    <span class="toggle-button__switch" />
  </label>
</template>

<script>
export default {
  name: 'ToggleButton',
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.toggle-button {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}
.toggle-button__input {
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .toggle-button__switch {
    background-color: $pale-red;
  }

  &:checked + .toggle-button__switch:before {
    transform: translateX(17px);
  }
}
.toggle-button__switch {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 26px;

  &:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
}
</style>
