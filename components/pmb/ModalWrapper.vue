<template>
  <div class="modal-wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  // Classic :D
  z-index: 99999;

  @media (min-width: 700px) {
    display: none;
  }
}

.modal-wrapper__close {
  position: absolute;
  right: 16px;
  top: 24px;
  width: 24px;
  z-index: 50;
}
</style>
