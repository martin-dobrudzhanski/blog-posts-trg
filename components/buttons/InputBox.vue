<template>
  <form
    :data-size="size"
    class="form location-lookup-form"
    @submit.prevent="getLocation"
  >
    <div class="field" data-inlinecontrols="true">
      <div
        class="control input"
        data-inline="true"
        data-icon="left"
        data-nomargin="true"
      >
        <a class="icon" @click.prevent="getLocation"></a>
        <input
          ref="location"
          class="input location-input"
          type="text"
          name="location-search"
          v-model="location"
          placeholder="Search by town, city or postcode"
        />
      </div>
      <a class="btn form-element" @click.prevent="submitForm" data-size="xs"
        >Find</a
      >
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['size', 'localHandler'],
  data() {
    return {
      location: ''
    };
  },
  methods: {
    ...mapActions(['getBrowserLocation']),
    getLocation() {
      if (this.localHandler) {
        this.localHandler();
      } else {
        window.location = `/nearest-me?lookup=${this.location}`;
      }
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.location-lookup-form {
  width: 100%;
  @include whenScreenIs(mdx) {
    .control {
      width: 416px;
    }
    &[data-size='sm'] {
      .control {
        width: 288px;
      }
    }
  }
  .icon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    background-image: url(~assets/img/icons/icon-locationsearch.svg);
    background-repeat: no-repeat;
    background-position: 5px 5px;
    background-size: 30px;
    background-color: white;
  }
}
</style>
