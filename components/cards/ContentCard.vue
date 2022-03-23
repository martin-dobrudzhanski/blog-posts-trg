<template>
  <div class="card content-card" :class="getClasses">
    <h1 class="heading" data-weight="normal" data-size="xl">
      {{ card.fields.heading }}
    </h1>
    <VueMarkdown
      class="body"
      :class="{ centered: card.fields.centerBodyText }"
      :source="card.fields.body"
    />

    <BaseButton
      v-if="card.fields.sheerIdButton"
      size="medium"
      class="open-modal"
      @click.native="openSheerIdModal()"
      :loading="loading"
    >
      {{ card.fields.buttonText }}
    </BaseButton>
    <dual-link
      class="btn"
      v-else
      :linkInfo="card.fields"
      :href="card.fields.buttonLink"
      data-size="md"
    >
      {{ card.fields.buttonText }}
    </dual-link>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import changeCase from 'change-case';
import DualLink from '@/components/ui/DualLink';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  props: ['card', 'child'],
  components: {
    VueMarkdown,
    DualLink,
    BaseButton
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    getClasses() {
      const classes = [this.getTheme];
      if (this.isChild) {
        classes.push('child');
      }
      return classes;
    },
    getTheme() {
      if (!this.card.fields.theme) {
        return 'default';
      }
      return changeCase.paramCase(this.card.fields.theme);
    },
    isChild() {
      return this.child === true;
    }
  },
  methods: {
    openSheerIdModal() {
      this.loading = true;
      window.scrollTo(0, 0);
      window.sheerId.loadInModal(
        `https://services.sheerid.com/verify/${process.env.SHEER_ID_PROGRAM_ID}/`,
        {
          mobileRedirect: true
        }
      );
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/elements/card.scss';

.content-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 16px;
  background-color: $rebrand-very-light-pink;
  @include whenScreenIs(mdx) {
    padding: 48px;
  }
  .heading {
    width: 100%;
    font-size: 28px;
    margin: 0 0 16px;
    font: $heading-font;
    @include whenScreenIs(mdx) {
      margin: 0 0 25px;
    }
  }
  .body {
    width: 100%;
    font-size: 16px;
    line-height: 20px;
    color: #2b2929;
    font-family: $font;
    /deep/ a {
      text-decoration: underline;
    }
    /deep/ p {
      margin: 0 0 16px;
    }
    /deep/ * {
      color: inherit;
    }
    &.centered {
      /deep/ p,
      h1,
      h2,
      h3 {
        text-align: center;
      }
    }
  }
  .btn {
    margin-top: 16px;
    width: 138px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
    background-color: $greyish-brown;

    &:hover {
      background-color: $mac-and-cheese;
      color: $black;
    }
  }
  &.child {
    .body {
      text-align: center;
      * {
        color: inherit;
      }
    }
  }
  &.greyish-brown {
    background: $greyish-brown;
    .heading {
      color: #fff;
    }
    .body {
      color: #fff;
    }
  }
  &.brown-grey {
    background: $brown-grey;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.black {
    background: $black;
    .heading {
      color: #fff;
    }
    .body {
      color: #fff;
    }
  }
  &.light-grey {
    background: $light-grey;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.mac-and-cheese {
    background: $mac-and-cheese;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.light-mustard {
    background: $light-mustard;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.sky-blue {
    background: $sky-blue;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.pale-sky-blue {
    background: $pale-sky-blue;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.pink {
    background: $pink;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.light-beige {
    background: $light-beige;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.light-pink {
    background: $light-pink;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.sickly-yellow {
    background: $sickly-yellow;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.pale-red {
    background: $pale-red;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.white-ice {
    background: $white-ice;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.peacock-blue {
    background: $peacock-blue;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
  &.orange {
    background: $orange;
    .heading {
      color: #000;
    }
    .body {
      color: #000;
    }
  }
}
</style>
