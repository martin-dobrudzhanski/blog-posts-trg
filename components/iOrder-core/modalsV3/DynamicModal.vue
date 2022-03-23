<template>
  <div class="dynamic-modal__wrapper">
    <div class="close-button" @click="closeModal">
      <Icon icon="close-modal" size="md" clickable="true" />
    </div>
    <slot>
      <h2 class="dynamic-modal__heading">{{ heading }}</h2>
      <p class="dynamic-modal__copy">{{ copy }}</p>
      <BaseButton
        v-if="cta && cta.fields"
        size="medium"
        :to="cta.fields.url"
        :new-tab="cta.fields.newTab"
        class="dynamic-modal__cta"
      >
        {{ cta.fields.text }}
      </BaseButton>
    </slot>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'DynamicModal',
  components: {
    Icon,
    BaseButton
  },
  props: {
    heading: {
      type: String,
      default: null
    },
    copy: {
      type: String,
      default: null
    },
    cta: {
      type: Object,
      default: null
    }
  },
  mounted() {
    document.body.classList.add('no-scroll');
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  },
  beforeDestroy() {
    document.body.classList.remove('no-scroll');
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.dynamic-modal {
  &__wrapper {
    max-width: 800px;
    background-color: $very-light-pink;
    color: $greyish-brown;
    padding: 40px 24px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    max-height: 75vh;
    max-width: 540px;
    margin: 0 1rem;
    position: relative;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      border: 0;
      padding: 0;
      background-color: $white;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: box-shadow 0.2s ease;
      &:hover {
        cursor: pointer;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      }
    }
  }
  &__heading {
    font-family: $heading-font;
    max-width: 250px;
    line-height: 40px;
    text-align: center;
    font-size: 40px;
    margin: -1rem auto 1rem;
  }
  &__copy {
    font-size: 14px;
    font-family: $font;
    white-space: pre-wrap;
    width: 100%;
  }
  &__cta {
    margin: 1.5rem auto 0;
  }
}
.close-icon {
  width: 1.75rem;
  height: auto;
}
</style>
