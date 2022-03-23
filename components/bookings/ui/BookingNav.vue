<template>
  <VTabs>
    <VTab
      v-for="tab in items"
      controlled
      tag="button"
      :key="tab.id"
      :title="tab.text"
      :active="isActive(tab)"
      :color="tab.color"
      :disabled="isDisabled(tab)"
      @click.native="select(tab)"
    />
  </VTabs>
</template>

<script>
import VTabs from '@/components/ui/VTabs';
import VTab from '@/components/ui/VTab';

export default {
  name: 'BookingNav',
  components: { VTabs, VTab },
  props: ['restaurant'],
  data: () => ({
    items: [
      {
        id: 'BookingDetails',
        text: 'Find a table',
        iconActive: 'one-circle-active',
        iconInactive: 'one-circle',
        color: 'beige',
      },
      {
        id: 'UserDetails',
        text: 'Your details',
        iconActive: 'two-circle-active',
        iconInactive: 'two-circle',
        color: 'pink',
      },
    ],
  }),
  computed: {
    isUserDetailsActive() {
      if (this.$route.fullPath.indexOf('your-details') < 0) {
        return false;
      }
      return true;
    },
  },
  methods: {
    isActive(item) {
      if (item.id === 'UserDetails') {
        if (this.isUserDetailsActive) {
          return true;
        }
        return false;
      }
      if (!this.isUserDetailsActive) {
        return true;
      }
      return false;
    },
    getSelectedUrl(selectedItem) {
      const slug = this.$store.getters['booking/getRestaurantSlug'];
      const url = `/restaurants/${slug}/book`;
      const bookingRef = this.$store.state.booking.bookingRef;

      if (selectedItem.id === 'BookingDetails') {
        if (bookingRef) {
          return `${url}/amend/${bookingRef}`;
        }
        return url;
      }

      if (bookingRef) {
        return `${url}/amend/${bookingRef}/your-details`;
      }
      return `${url}/your-details`;
    },
    select(selectedItem) {
      if (this.isDisabled(selectedItem)) {
        return;
      }
      for (const item of this.items) {
        item.active = false;
      }
      selectedItem.active = true;
      this.$router.push(this.getSelectedUrl(selectedItem));
    },
    getIcon(item) {
      const isActive = this.isActive(item);
      return isActive ? item.iconActive : item.iconInactive;
    },
    isDisabled(item) {
      if (item.id === 'BookingDetails') {
        if (this.isUserDetailsActive) {
          return false;
        }
        return true;
      }
      if (item.id === 'UserDetails') {
        return true;
      }
    },
  },
};
</script>
