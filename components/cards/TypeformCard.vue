<template>
  <no-ssr>
    <div class="card typeform-card" v-if="source">
      <iframe :src="source" class="typeform-card__iframe" />
    </div>
  </no-ssr>
</template>

<script>
import get from 'lodash.get'

export default {
  props: {
    card: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    source() {
      return get(this.card, 'fields.typeformShareUrl')
    }
  }
}
</script>

<style lang="scss" scoped>
.typeform-card {
  width: 100%;

  &__iframe {
    width: 100%;
    height: 500px;
  }
}
</style>
