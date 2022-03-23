<template>
  <div class="tip-selection">
    <div @click="$emit('handleCloseModal')" class="modal-wrapper__close">
      <img
        src="@/assets/img/generic/icon-close.svg"
        alt="close"
        class="modal-wrapper__close-icon"
      />
    </div>
    <section class="tip-selection__container">
      <v-header :title="content && content.tipModalTitle" />
      <p v-text="content && content.tipModalText" />
    </section>
    <section class="tip-selection__input-container">
      <div class="tip-selection__buttons">
        <v-button
          buttonText="10%"
          :tipAmount="getPercentageOfTotal(0.1)"
          @buttonClick="handleTipSelection('10%', getPercentageOfTotal(0.1))"
          :selected="selected === '10%'"
        />
        <v-button
          buttonText="12.5%"
          :tipAmount="getPercentageOfTotal(0.125)"
          @buttonClick="
            handleTipSelection('12.5%', getPercentageOfTotal(0.125))
          "
          :selected="selected === '12.5%'"
        />
        <v-button
          buttonText="15%"
          :tipAmount="getPercentageOfTotal(0.15)"
          @buttonClick="handleTipSelection('15%', getPercentageOfTotal(0.15))"
          :selected="selected === '15%'"
        />
      </div>
      <v-input-money
        ref="input"
        label="Or add a custom amount:"
        placeholder="Enter amount"
        @input="handleInput"
        @formSubmit="handleContinue"
        withCurrency="£"
      />
    </section>
    <section class="tip-selection__footer">
      <a @click="handleContinue(0)" class="tip-selection__footer-link">{{
        content && content.tipModalSkipText
      }}</a>
      <v-button
        hasContainer
        :disabled="!canProceed"
        :buttonText="content && content.tipModalButtonText"
        @buttonClick="handleContinue"
      />
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

const VButton = () => import('@/components/pmb/VButton')
const VHeader = () => import('@/components/pmb/VHeader')
const VInputMoney = () => import('@/components/pmb/VInputMoney')

export default {
  components: {
    VButton,
    VHeader,
    VInputMoney
  },
  data: () => ({
    input: null,
    selected: null
  }),
  computed: {
    ...mapGetters({
      content: 'pay/getContent',
      totalIncludingDiscount: 'pay/getTotalIncludingDiscount'
    }),
    canProceed() {
      return (this.input && this.input > 0) || this.selected
    }
  },
  methods: {
    handleInput(input) {
      this.selected = null
      this.input = input
      this.$emit('handleTipSelection', { input })
    },
    handleTipSelection(id, percentage) {
      this.input = null
      this.$refs.input.input = null

      Vue.nextTick(() => {
        if (id === this.selected) {
          this.selected = null
        } else {
          this.selected = id
        }

        this.$emit('handleTipSelection', { percentage })
      })
    },
    handleContinue(percentage) {
      if (percentage === 0) {
        this.input = null
        this.$emit('handleTipSelection', { clear: true })
      }
      this.$emit('handleContinue', { input: this.input, percentage })
    },
    getPercentageOfTotal(percentage) {
      return parseFloat(this.totalIncludingDiscount * percentage).toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.tip-selection {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow-y: scroll;
  width: 100%;

  &__container {
    padding: 0 16px;

    p {
      font-size: 14px;
    }
  }

  &__input-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    padding: 20px 16px;
  }

  &__heading {
    @extend .pmb-heading;
  }

  &__content {
    margin: 0 16px 170px;
  }

  &__buttons {
    display: flex;

    div {
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__input {
    input {
      border-radius: 0;
      border: 1px solid $jungle-green;
      font-size: 16px;
      height: 100%;
      padding: 12px;
      text-align: center;
      width: 100%;
    }
  }

  &__footer {
    text-align: center;

    &-link {
      @extend .pmb-link;
      margin-bottom: 8px;
    }
  }
}
</style>
