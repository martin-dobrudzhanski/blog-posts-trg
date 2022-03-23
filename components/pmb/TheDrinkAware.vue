<template>
  <div class="drink-aware">
    <div class="drink-aware__header">
      <img src="@/assets/img/pmb/under25.svg" class="drink-aware__under25" />
      <img src="@/assets/img/pmb/u25.svg" class="drink-aware__u25" />
    </div>
    <div class="drink-aware__content">
      <p>{{ text }}</p>
    </div>
    <div class="drink-aware__footer">
      <img
        src="@/assets/img/pmb/drinkaware.svg"
        class="drink-aware__drinkaware"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Please be prepared to show ID when buying alcohol'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.drink-aware {
  margin: 24px 0;

  &__header {
    align-items: center;
    background-color: #ea092a;
    border-radius: 3px;
    display: flex;
    padding: 8px 6px;
    position: relative;
    margin-right: 20px;
  }

  &__u25 {
    position: absolute;
    right: -20px;
  }

  &__content {
    font-size: 12px;
    padding: 6px 0;
  }

  &__footer {
    align-items: center;
    background-color: #1d1d1b;
    display: flex;
    justify-content: flex-end;
    padding: 4px;
  }
}
</style>
