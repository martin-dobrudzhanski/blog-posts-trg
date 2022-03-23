<template>
  <transition name="slide-up-fade" mode="out-in">
    <div data-component="location-services">
      <header data-element="subheading">
        <Icon class="user-icon" :icon="'mexican'" clickable="true" />
        <div class="white-circle">
          <Icon
            class="close-icon"
            :icon="'close-modal'"
            clickable="true"
            @click.native="close"
          />
        </div>
      </header>
      <div data-element="text-block">
        <h1 class="text-block__heading" data-weight="black">
          {{ heading }}
        </h1>
        <p class="text-block__text">
          Just accept the notification after this message!
        </p>
      </div>
      <BaseButton size="medium" class="cta" @click.native="close">
        Got It!
      </BaseButton>
    </div>
  </transition>
</template>

<script>
import Icon from '@/components/iOrder-core/uiV3/Icon';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'LocationServicesModal',
  components: {
    Icon,
    BaseButton
  },
  props: ['close', 'heading']
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='location-services'] {
  position: relative;
  margin: 2rem 1rem;
  padding: 0 0 2rem;
  background-color: $very-light-pink;
  border-radius: 9px;
  box-shadow: 0 2px 4px rgba($true-black, 0.5);

  @include whenScreenIs(sm) {
    margin: auto 1rem;
  }

  @include whenScreenIs(mdx) {
    width: 720px;
    margin: auto;
  }

  [data-element='subheading'] {
    height: 130px;
    text-align: center;

    .user-icon {
      height: 94px;
      width: 60px;
      margin: 1.5rem auto 0;
    }

    .white-circle {
      width: 40px;
      height: 40px;
      background: white;
      position: absolute;
      top: 8px;
      right: 8px;
      text-align: center;
      border-radius: 50%;
    }

    .close-icon {
      margin-top: 8px;
    }
  }

  [data-element='text-block'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    margin-bottom: 2rem;

    .text-block__heading {
      font-family: $heading-font;
      font-size: 32px;
      color: $peacock-blue;
      line-height: 1;
      text-align: center;
      position: relative;
      margin-bottom: 1rem;

      @include whenScreenIs(sm) {
        font-size: 48px;
      }
    }

    .text-block__text {
      color: $greyish-brown;
      font-family: $font;
      font-size: 1rem;
      text-align: center;
      line-height: 1.22;

      @include whenScreenIs(sm) {
        font-size: 1.125rem;
      }
    }
  }

  .cta {
    min-width: 140px;
    margin: 0 auto;
  }
}
</style>
