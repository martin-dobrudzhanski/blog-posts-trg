<template>
  <div class="location-services">
    <p class="heading sub-heading" data-weight="bold" data-size="sm">
      Sorry this restaurant isn't open yet! <br />
      Sign up on the restaurant page to be the first to find out when we open
    </p>
    <nuxt-link
      target="_self"
      data-size="md"
      :to="`/restaurants/${$route.params.slug}`"
      class="btn signup"
      style="margin: 0 auto 15px; display: block; max-width: 250px"
    >
      SIGN UP HERE!
    </nuxt-link>
    <a
      href="/covid-19"
      target="_self"
      data-size="md"
      class="btn"
      style="margin: 0 auto 15px; display: block; max-width: 250px"
    >
      FIND OUT MORE
    </a>
  </div>
</template>

<script>
export default {
  props: ['close'],
};
</script>

<style lang="scss">
.location-services {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  .heading {
    margin-bottom: 24px;
  }
}
</style>