<template>
  <section class="profile-edit">
    <profile-form :content="content" />
  </section>
</template>

<script>
import ProfileForm from '~/components/account/ProfileForm';

export default {
  components: {
    ProfileForm
  },
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  head() {
    const getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    return {
      title: 'About you',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    };
  },
  beforeMount() {
    if (!this.$store.getters['auth/userAuthenticated']) {
      this.$router.replace({ path: `/login` });
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.profile-edit {
  background-color: $light-pink;
}
</style>
