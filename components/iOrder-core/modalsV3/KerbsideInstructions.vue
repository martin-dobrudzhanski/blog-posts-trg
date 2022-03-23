<template>
  <div class="kerbside-instruction-modal">
    <h2 class="title">{{ instructions.title }}</h2>
    <div class="description">{{ instructions.description }}</div>

    <VButton @buttonClick="$emit('close')" buttonText="Got it!" />
  </div>
</template>

<script>
import VButton from '~/components/pmb/VButton';

export default {
  name: 'kerbside-instructions',
  props: {
    instructions: {
      type: Object,
      default: () => ({ title: '', description: '' })
    }
  },
  components: {
    VButton
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.kerbside-instruction-modal {
  background-color: $white;
  padding: 1.75rem 1rem 1rem;
  margin: 2rem 1rem;
  position: relative;
  max-width: 32rem;
  border-radius: 18px;
  background-color: $white;

  @include whenScreenIs(mdx) {
    padding: 2rem 1.25rem 1.25rem;
  }

  /deep/ .v-button__button {
    border-radius: 40px;
    transition: box-shadow 0.2s ease;

    &:hover {
      cursor: pointer;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    }
  }
}

.title {
  font-size: 1.25rem;
}

.description {
  white-space: pre-wrap;
  margin: 1rem 0 1.5rem;
}
</style>
