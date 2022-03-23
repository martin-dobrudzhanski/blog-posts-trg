<template lang="html">
  <message heading="There was a problem" btnText="Back" :btnBack="true" />
</template>

<script>
import Message from '~/components/bookings/Message.vue';

export default {
  head: {
    title: 'Error',
  },
  components: {
    Message,
  },
};
</script>
