<template>
  <div class="kerbside-pickup">
    <div class="kerbside-pickup__checkbox">
      <label class="kerbside-pickup__text" for="switch">
        Kerbside Pick Up:
      </label>
      <input
        id="switch"
        class="kerbside-pickup__switch"
        type="checkbox"
        v-model="kerbsideEnabled"
      />
    </div>
    <p
      class="kerbside-pickup__instructions"
      @click.self="openKerbsideInstructions"
    >
      Learn More
    </p>
    <transition name="fade">
      <ModalContainer
        v-if="showKerbsideInstructions"
        :closeModal="closeKerbsideInstructions"
      >
        <KerbsideInstructions
          :instructions="instructions"
          @close="closeKerbsideInstructions"
        />
      </ModalContainer>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import KerbsideInstructions from '~/components/iOrder-core/modalsV3/KerbsideInstructions';
import ModalContainer from '~/components/iOrder-core/modalsV3/ModalContainer';

export default {
  name: 'KerbsidePickut',
  components: {
    ModalContainer,
    KerbsideInstructions
  },
  props: {
    instructions: {
      type: Object,
      default: () => ({ title: '', description: '' })
    }
  },
  data() {
    return {
      showKerbsideInstructions: false
    };
  },
  computed: {
    ...mapGetters('clickAndCollect', {
      isKerbsideEnabled: 'isKerbsideEnabled'
    }),
    kerbsideEnabled: {
      get: function() {
        return this.isKerbsideEnabled;
      },
      set: function(newValue) {
        this.setKerbsideEnabled({ enabled: newValue });
      }
    }
  },
  methods: {
    ...mapMutations('clickAndCollect', {
      setKerbsideEnabled: 'setKerbsideEnabled'
    }),
    openKerbsideInstructions() {
      document.body.setAttribute('data-modal', true);
      document.documentElement.setAttribute('data-modal', true);
      this.showKerbsideInstructions = true;
    },
    closeKerbsideInstructions() {
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showKerbsideInstructions = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/animations.scss';

.kerbside-pickup {
  padding: 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-tap-highlight-color: transparent;

  &__text {
    font-size: 16px;
  }

  &__instructions {
    font-size: 14px;
    font-weight: normal;
    text-decoration: underline;

    &:hover {
      cursor: pointer;
    }
  }

  &__checkbox {
    display: flex;
    align-items: center;
  }

  &__switch {
    position: relative;
    appearance: none;
    outline: none;
    margin: 0 0.25rem;
    width: 50px;
    height: 26px;
    background-color: #ffffff;
    border: 1px solid #d9dadc;
    border-radius: 40px;
    box-shadow: inset -23px 0 0 0 #ffffff;
    transition-duration: 100ms;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: 22px;
      height: 22px;
      background-color: transparent;
      border-radius: 50%;
      box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
    }

    &:checked {
      border-color: $jungle-green;
      box-shadow: inset 23px 0 0 0 $jungle-green;

      &::after {
        left: 20px;
        box-shadow: -2px 4px 3px rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
