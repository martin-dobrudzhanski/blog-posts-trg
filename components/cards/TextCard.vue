<template>
  <div class="card text-card" :class="card.fields.color">
    <div class="text-container">
      <div class="heading-container" :class="titleClasses">
        <h1 class="heading" data-weight="normal" data-size="xl">
          {{ card.fields.title }}<br v-if="card.fields.titleLine2" /><span
            v-if="card.fields.titleLine2"
            >{{ card.fields.titleLine2 }}</span
          ><br v-if="card.fields.titleLine3" /><span
            v-if="card.fields.titleLine3"
            >{{ card.fields.titleLine3 }}</span
          >
        </h1>
      </div>
      <p class="subheading">{{ card.fields.text }}</p>
    </div>
    <dual-link
      class="btn"
      :linkInfo="card.fields"
      :href="card.fields.buttonLink"
      data-size="md"
    >
      {{ card.fields.buttonText }}
    </dual-link>
  </div>
</template>

<script>
import DualLink from '@/components/ui/DualLink';

export default {
  props: ['card'],
  components: {
    DualLink
  },
  methods: {
    longTitle() {
      let greatestLength = null;
      const titleData = [
        this.card.fields.title,
        this.card.fields.titleLine2,
        this.card.fields.titleLine3
      ];
      titleData.forEach(title => {
        if (title) {
          greatestLength >= title.length
            ? false
            : (greatestLength = title.length);
        }
      });
      return greatestLength > 21 ? 'long-title' : '';
    },
    multipleLines() {
      if (this.card.fields.titleLine2) {
        return this.card.fields.titleLine3 ? 'three-lines' : 'two-lines';
      } else return 'one-line';
    },
    hasParagraphText() {
      return this.card.fields.text ? 'has-paragraph-text' : '';
    }
  },
  computed: {
    titleClasses() {
      if (this.card && this.card.fields && this.card.fields.title) {
        return `${this.longTitle()} ${this.multipleLines()} ${this.hasParagraphText()}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/elements/card.scss';

.heading {
  font-size: 38px;
}
.subheading {
  font-size: 18px;
  line-height: 1.22;
  margin-top: 18px;
  font-family: $secondary-body-font;
}
.text-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 104px;
  height: 100%;
  padding: 2rem 3rem;
  text-align: center;

  @include whenScreenIs(mdx) {
    height: $card-height-desktop;
  }
  .text-container {
    width: 100%;
    @include whenScreenIs(mdx) {
      margin-top: 40px;
    }
    .heading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 6px;
      &.long-title {
        h1 {
          font-size: 28px;
          @include whenScreenIs(mdx) {
            font-size: 38px;
            line-height: 0.88;
          }
        }
        &:not(.has-paragraph-text) {
          &.three-lines {
            min-height: 63px;
          }
        }
      }
      &.has-paragraph-text {
        &.two-lines {
          margin-bottom: 4px;
        }
      }
      &.two-lines {
        min-height: 59px;
      }
      &:not(.has-paragraph-text) {
        &.three-lines {
          min-height: 90px;
        }
      }
      h1 {
        margin-bottom: 0;
      }
    }
  }
  p {
    margin-bottom: 4px;
    @include whenScreenIs(mdx) {
      margin-bottom: 0;
    }
  }

  .btn {
    margin-top: 20px;
    @include whenScreenIs(mdx) {
      margin-bottom: 25px;
    }
  }
}
</style>
