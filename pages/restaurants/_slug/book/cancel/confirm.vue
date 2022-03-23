<template lang="html">
  <message
    heading="Your booking has now been cancelled"
    btnText="Make another booking"
    btnLink="/book"
  />
</template>

<script>
import Message from '~/components/bookings/Message.vue';

export default {
  components: {
    Message
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
