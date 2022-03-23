<template>
  <ul>
    <li class="bill-item" v-for="item in items" :key="item.id">
      <div class="bill-item__container">
        <div class="bill-item__title">
          <span>{{ item.name }}</span>
        </div>
        <div class="bill-item__price">
          <span>£{{ item.price.toFixed(2) }}</span>
        </div>
      </div>
      <v-collapse
        expandText="View choices"
        collapseText="Hide choices"
        v-if="item.choices.length > 0"
      >
        <div
          class="bill-item__item"
          v-for="choice in item.choices"
          :key="choice.id"
        >
          <span>{{ choice.name }}</span>
          <span class="bill-item__price" v-if="choice.price"
            >£{{ choice.price.toFixed(2) }}</span
          >
        </div>
      </v-collapse>
    </li>
  </ul>
</template>

<script>
const VCollapse = () => import('@/components/pmb/VCollapse')

export default {
  components: {
    VCollapse
  },
  props: {
    items: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.bill-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding-bottom: 12px;
  position: relative;

  &__container {
    display: flex;
    justify-content: space-between;
  }

  span {
    color: #2f2f2f;
    font-size: 14px;
    line-height: 1.8;
    text-align: left;
  }

  &__title {
    align-content: flex-start;
    display: flex;
    flex-direction: column;
  }

  &__item {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &:after {
    background-color: $very-light-pink;
    bottom: 0;
    content: '';
    height: 1px;
    position: absolute;
    width: 100%;
  }

  &:last-child {
    &:after {
      height: 0;
    }
  }
}
</style>
