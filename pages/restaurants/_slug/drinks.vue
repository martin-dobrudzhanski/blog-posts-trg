<template>
  <section class="drinks-at-table" data-nofooter-fullscreen>
    <component :is="componentName" />
  </section>
</template>

<script>
import MobileOnly from '@/components/iOrder-core/ui/MobileOnly';

export default {
  mixins: [],
  components: {
    MobileOnly,
  },
  data() {
    return {
      componentName: 'nuxt-child',
    };
  },

  mounted() {
    if (typeof window === 'object' && typeof window.orientation === 'number') {
      this.componentName = 'nuxt-child';
      return;
    }
    this.componentName = 'mobile-only';
  },
};
</script>
