<template>
	<section class="booking-redirect" data-fullscreen>
	</section>
</template>

<script>
  // reservation redirect
  export default {
    validate({ params }) {
      return /[a-zA-Z0-9]/g.test(params.bookingid)
    },
    async fetch ({ store, params, error, redirect }) {
      const bookingRef = params.bookingid 
      const slug = await store.dispatch('booking/getRedirectSlug', { bookingRef });
      if (!slug) {
        error('404')
        return
      }
      redirect(`/restaurants/${slug}/book/confirm/${bookingRef}`)
		}
	}
</script>


