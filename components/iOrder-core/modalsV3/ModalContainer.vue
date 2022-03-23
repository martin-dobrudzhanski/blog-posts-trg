<template>
  <div
    data-component="modal-wrapper"
    @click.self="close"
    :class="{ 'transparent-background': transparent }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['transparent'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='modal-wrapper'] {
  position: fixed;
  z-index: 99999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
}
.transparent-background {
  background-color: transparent;
}
</style>
