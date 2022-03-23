<template>
  <div class="modal-location" @click="handleClick">
    <div class="modal-location__wrapper">
      <div class="modal-location__header">
        <h2
          data-size="xl"
          data-color="white"
          data-weight="normal"
          class="heading"
        >
          Nearest Chiquito
        </h2>
      </div>
      <div
        v-for="(location, index) in locations"
        :key="index"
        @click="handleSelect(location)"
        class="modal-location__body stripe"
      >
        <h3 v-text="location.name" class="body__text" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick() {
      this.$emit('handleCloseModal')
    },
    handleSelect(location) {
      this.$emit('handleSelect', location)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.modal-location {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-location__wrapper {
  width: 312px;
  min-height: 224px;
  background: $white;
  -webkit-box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.22);
}

.stripe {
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-location__header {
  border-bottom: 1px solid #fff;

  h2 {
    @extend .pmb-heading--inverse;
  }

  .heading {
    margin-bottom: 2px;
    padding-bottom: 4px;
  }
}

.modal-location__body {
  background-color: $white-two;
  border-top: 1px solid #fff;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: #4c95bd;
    border: 2px solid #0068a2 !important;

    .body__text {
      color: #fff;
    }
  }

  .body__text {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.25;
  }
}

.modal-location__body {
  &:last-of-type {
    border-bottom: 1px solid $white;
  }
}
</style>
