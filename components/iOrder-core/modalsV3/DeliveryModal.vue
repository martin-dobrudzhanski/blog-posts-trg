<template>
  <div class="delivery-modal__wrapper">
    <button class="close-button">
      <img
        class="close-icon"
        src="@/assets/img/iorder-coreV2/icons/close-modal.svg"
        alt="close"
        @click="$emit('close')"
      />
    </button>
    <img
      class="delivery-modal__image"
      src="@/assets/img/iorder-coreV2/icons/delivery-img.svg"
      alt="delivery image"
    />
    <h2 class="delivery-modal__heading">Select a delivery partner</h2>
    <div class="delivery-modal__partners" v-if="partners && partners.length">
      <a
        class="delivery-modal__partner"
        :href="partner.link"
        v-for="partner in partners"
        :key="partner.name"
      >
        <img
          v-if="partner.name === 'Deliveroo'"
          class="partner__logo"
          src="@/assets/img/icons/icon-deliveroo.svg"
          alt="deliveroo logo"
        />
        <img
          v-if="partner.name === 'JustEat'"
          class="partner__logo"
          src="@/assets/img/icons/icon-justeat.svg"
          alt="deliveroo logo"
        />
        <img
          v-if="partner.name === 'UberEats'"
          class="partner__logo"
          src="@/assets/img/icons/icon-ubereats.svg"
          alt="deliveroo logo"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeliveryModal',
  props: {
    partners: {
      type: Array,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.delivery-modal__wrapper {
  max-width: 800px;
  background-color: $light-pink;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  height: 330px;
  width: 330px;
  position: relative;
  border-radius: 18px;
  display: flex;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: $white;
    border: 0;
    border-radius: 50%;
    padding: 0;
    &:hover {
      cursor: pointer;
    }
  }
}
.close-icon {
  width: 40px;
  height: 40px;
}
.delivery-modal__image {
  width: 122px;
  height: auto;
  margin: 0 auto;
}
.delivery-modal__heading {
  font-family: $navigation-font;
  font-size: 18px;
  color: $greyish-brown;
  text-align: center;
  margin-top: 2rem;
}
.delivery-modal__partners {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}
.delivery-modal__partner {
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: $true-white;
  width: 78px;
  height: 78px;
  border-radius: 50%;

  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}
.partner__logo {
  width: 4rem;
  height: auto;
}
</style>
