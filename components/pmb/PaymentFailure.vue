<template>
  <div class="payment-failure">
    <section>
      <div class="payment-failure__container">
        <h1
          data-size="xl"
          data-color="rebrand-orange"
          data-weight="normal"
          class="heading"
          v-text="content.failurePageTitle"
        />
        <p v-text="content && content.failurePageText" />
      </div>
    </section>
    <section class="payment-failure__footer">
      <v-button
        hasContainer
        :buttonText="content && content.failurePageButtonText"
        @buttonClick="handleButtonPress"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const VButton = () => import('@/components/pmb/VButton')

export default {
  components: {
    VButton
  },
  computed: {
    ...mapGetters({
      content: 'pay/getContent',
      location: 'pay/getLocation',
      tableNumber: 'pay/getTableNumber'
    })
  },
  methods: {
    handleButtonPress() {
      if (this.location.slug && this.tableNumber) {
        this.$router.push(
          `/restaurants/${this.location.slug}/pay/${this.tableNumber}`
        )
      } else {
        this.$router.push('/pay')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.payment-failure {
  background-color: #fff;
  color: $black;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;

  &__container {
    padding: 0 16px;
    text-align: center;

    h1 {
      @extend .pmb-heading;
      height: auto;
      line-height: 1.6;
      margin: 12px 0;
    }

    p {
      font-size: 14px;
      margin: 24px 0;
    }
  }

  &__heading {
    background-color: $light-grey;
    margin: 12px 0;

    h1 {
      @extend .pmb-heading;
    }
  }

  &__content {
    margin: 0 16px 170px;
  }

  &__totals {
    margin: 16px 0 0;
    padding: 0 16px;
  }

  &__item {
    align-items: center;
    display: flex;
    margin: 12px 0;
    width: 100%;

    span {
      flex: 1;
      font-size: 16px;
      text-align: left;

      &:last-child {
        text-align: right;
      }

      &:last-child {
        font-weight: bold;
      }
    }

    &.--small {
      span {
        &:nth-child(2) {
          font-size: 13px;
        }
      }
    }
  }

  &__footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;

    &-link {
      @extend .pmb-link;
      margin-bottom: 8px;
    }
  }
}
</style>
