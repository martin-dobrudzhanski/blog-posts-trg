<template>
  <div data-route="book" data-child>
    <BookingNav />
    <div class="book__container">
      <UserDetails />
    </div>
  </div>
</template>

<script>
import BookingNav from '@/components/bookings/ui/BookingNav';
import UserDetails from '@/components/bookings/UserDetails';

export default {
  components: {
    BookingNav,
    UserDetails
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-route='book'] {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.book__container {
  background-color: $true-white;
  background-image: url('~/assets/img/background/paper.jpg');
}
</style>
