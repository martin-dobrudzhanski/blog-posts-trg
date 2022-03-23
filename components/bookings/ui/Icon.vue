<template>
  <div
    v-if="!clickable"
    data-component="icon"
    :data-icon="icon"
    :data-size="size"
    :style="getStyle"
  />
  <button
    v-else
    data-component="icon"
    :data-icon="icon"
    :data-size="size"
    :style="getStyle"
    data-clickable
  />
</template>

<script>
export default {
  props: ['size', 'icon', 'clickable'],
  computed: {
    getBackgroundImage() {
      return require(`../../../assets/img/bookings/icons/${this.icon}.svg`);
    },
    getStyle() {
      return {
        'background-image': `url(${this.getBackgroundImage})`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
[data-component='icon'] {
  display: inline-flex;
  background-size: 100%;
  background-repeat: no-repeat;
  flex-shrink: 0;

  // md is default size
  height: 24px;
  width: 25px;
  border: none;
  background-color: #ffffff00;
  &[data-clickable] {
    cursor: pointer;
  }
  &[data-size='xs-sm'] {
    height: 20px;
    width: 20px;
  }
  &[data-size='xs'] {
    height: 16px;
    width: 16px;
  }
  &[data-size='sm'] {
    height: 24px;
    width: 24px;
  }
  &[data-size='md'] {
    // md is default size
  }
  &[data-size='lg'] {
    height: 26px;
    width: 27px;
  }
}
</style>
