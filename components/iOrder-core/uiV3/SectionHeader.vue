<template>
  <div
    data-component="section-header"
    :data-inverse="inverse"
    :data-modal-header="modalHeader"
    :data-borderbottom="borderBottom"
    :class="{ sticky: isSticky }"
  >
    <h2
      data-element="text"
      :data-size="size"
      :data-inverse="inverse"
      :data-text-color="textColor"
    >
      {{ text }}
    </h2>
    <Icon
      v-if="faqVisibility"
      :icon="'FAQ'"
      clickable="true"
      @click.native="setShowModal()"
    />
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  name: 'SectionHeader',
  props: {
    text: {
      type: String
    },
    textColor: {
      type: String,
      default: 'pale'
    },
    size: {
      type: String,
      default: 'lg'
    },
    inverse: {
      type: Boolean
    },
    modalHeader: {
      type: Boolean
    },
    borderBottom: {
      type: String
    },
    isSticky: {
      type: Boolean
    },
    faqVisibility: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Icon
  },
  methods: {
    setShowModal() {
      document.body.classList.add('no-scroll');
      this.$store.commit('ui/showModal', {
        modal: 'FAQModal',
        modalOptions: {
          heading: 'FAQs'
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='section-header'] {
  background: green;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  &[data-inverse] {
    background: #fff;
  }
  &[data-modal-header] {
    padding-top: 28px;
    @include whenScreenIs(sm) {
      padding-top: 32px;
    }
    @media only screen and (max-height: 535px) {
      padding: 8px;
    }
  }
  &:not([data-modal-header]) {
    @include whenScreenIs(sm) {
      padding: 24px;
    }
  }
  &[data-borderbottom] {
    @include whenScreenIs(mdx) {
      border-bottom: 1px solid $white-two;
    }
  }
  [data-element='text'] {
    width: 70%;
    color: #fff;
    font-size: 20px;
    font-weight: 900;
    line-height: 1.2;
    text-align: center;
    @include whenScreenIs(sm) {
      font-size: 24px;
      width: 328px;
    }
    &[data-inverse] {
      color: $pinkish-red;
    }
    &[data-size='sm'] {
      font-size: 20px;
      @include whenScreenIs(sm) {
        width: 432px;
      }
    }
    &[data-size='md'] {
      font-size: 20px;
      width: 280px;
      @include whenScreenIs(sm) {
        width: 432px;
      }
    }
    &[data-size='lg'] {
      font-size: 27px;
      line-height: 31px;
      width: 100%;
    }
    &[data-text-color='green'] {
      color: $jungle-green;
    }
    &[data-text-color='red'] {
      color: $pinkish-red;
    }
    &[data-text-color='pale'] {
      color: $white;
    }
  }
}
.sticky {
  position: sticky;
  top: 64px;
  z-index: 9999;
}
</style>
