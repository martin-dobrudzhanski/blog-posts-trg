<template>
  <article
    class="tile"
    v-if="card"
    :class="{
      'tile--wide': isWide,
      'input-cards':
        isCardType('locationCard') || isCardType('newsletterSignUpCard'),
      'auth-cards': isCardType('authCard')
    }"
    :style="{ 'background-color': selectedTheme() }"
  >
    <GraphicCard
      v-if="isCardType('graphicCard')"
      :card="card"
      :restaurant="restaurant"
    />

    <ImageCard
      v-if="isCardType('imageCard')"
      :card="card"
      :restaurant="restaurant"
    />

    <PictureCard
      v-if="isCardType('pictureCard')"
      :card="card"
      :restaurant="restaurant"
    />

    <MomentCard
      v-if="isCardType('momentCard')"
      :card="card"
      :restaurant="restaurant"
    />

    <PlainCard v-if="isCardType('plainCard')" :card="card" />

    <TextCard
      v-if="isCardType('textCard')"
      :card="card"
      :restaurant="restaurant"
    />

    <LocationCard v-if="isCardType('locationCard')" v-bind="card.fields" />

    <ContentCard v-if="isCardType('contentCard')" :card="card" />

    <CardRow v-if="isCardType('cardRow')" :card="card" />

    <GleamCard v-if="isCardType('gleamCard')" :card="card" />

    <Swiper v-if="isCardType('slider') && slides" :slides="slides" />

    <no-app>
      <AppCard v-if="isCardType('appCard')" :card="card" />
    </no-app>

    <BookingCard v-if="isCardType('bookingCard')" :card="card" />

    <PartyCard v-if="isCardType('partyCard')" :card="card" />

    <OfferCard v-if="isCardType('offerCard')" :card="card" />

    <TypeformCard v-if="isCardType('typeformCard')" :card="card" />

    <GenericCard v-if="isCardType('genericCard')" v-bind="card.fields" />

    <MediaCarouselCard
      v-if="isCardType('mediaCarouselCard')"
      :wide="isWide"
      v-bind="card.fields"
    />

    <NewsletterSignUpCard
      v-if="isCardType('newsletterSignUpCard')"
      v-bind="card.fields"
    />

    <AuthCard v-if="isCardType('authCard')" v-bind="card.fields" />
  </article>
</template>

<script>
import get from 'lodash.get';
import CardRow from '~/components/cards/CardRow.vue';
import GleamCard from '~/components/cards/GleamCard.vue';
import ContentCard from '~/components/cards/ContentCard.vue';
import GraphicCard from '~/components/cards/GraphicCard.vue';
import ImageCard from '~/components/cards/ImageCard.vue';
import MomentCard from '~/components/cards/MomentCard.vue';
import PlainCard from '~/components/cards/PlainCard.vue';
import TextCard from '~/components/cards/TextCard.vue';
import LocationCard from '~/components/cards/LocationCard.vue';
import AppCard from '~/components/cards/AppCard.vue';
import Swiper from '~/components/cards/Swiper.vue';
import BookingCard from '~/components/cards/BookingCard.vue';
import PartyCard from '~/components/cards/PartyCard.vue';
import NoApp from '@/components/ui/NoApp';
import PictureCard from '~/components/cards/PictureCard.vue';
import OfferCard from '~/components/cards/OfferCard.vue';
import TypeformCard from '~/components/cards/TypeformCard.vue';
import GenericCard from '~/components/cards/GenericCard.vue';
import NewsletterSignUpCard from '~/components/cards/NewsletterSignUpCard.vue';
import MediaCarouselCard from '~/components/cards/MediaCarouselCard.vue';
import AuthCard from '~/components/cards/AuthCard.vue';

export default {
  name: 'Tile',
  components: {
    PictureCard,
    GraphicCard,
    GleamCard,
    ImageCard,
    MomentCard,
    PlainCard,
    TextCard,
    LocationCard,
    AppCard,
    PartyCard,
    BookingCard,
    Swiper,
    NoApp,
    CardRow,
    ContentCard,
    OfferCard,
    TypeformCard,
    GenericCard,
    NewsletterSignUpCard,
    MediaCarouselCard,
    AuthCard
  },
  props: {
    card: {
      type: Object,
      default: null
    },
    restaurant: {
      type: Object,
      default: null
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isWide() {
      const isWideParam = get(this.card, 'fields.isWide', false);
      return isWideParam || this.wide || this.isCardType('cardRow');
    },
    slides() {
      return this.card.fields.sliderCards &&
        this.card.fields.sliderCards.length > 1
        ? this.card.fields.sliderCards
        : [];
    },
    cards() {
      return this.card.fields.cards && this.card.fields.cards.length > 1
        ? this.card.fields.cards
        : [];
    }
  },
  methods: {
    isCardType(type) {
      if (!this.card.type) {
        return this.card.sys.contentType.sys.id === type;
      }
      if (this.card.type === type) {
        return true;
      }
      return false;
    },
    selectedTheme() {
      const theme = this.card.fields.theme;
      switch (theme) {
        case 'Brown Grey':
          return '#b2b2b24D';
        case 'Greyish Brown':
          return '#3c3c3c4D';
        case 'Light Beige':
          return '#f3f3c34D';
        case 'Light Grey':
          return '#f3f3f34D';
        case 'Light Mustard':
          return '#ffd15c4D';
        case 'Light Pink':
          return '#f3b2bc4D';
        case 'Macaroni And Cheese':
          return '#fdc5334D';
        case 'Orange':
          return '#ee74204D';
        case 'Pale Red':
          return '#ec55404D';
        case 'Pale Sky Blue':
          return '#c3ecf34D';
        case 'Pastel Pink':
          return '#f5c2cb4D';
        case 'Peacock Blue':
          return '#0068a34D';
        case 'Sickly Yellow':
          return '#cdd9374D';
        case 'Sky Blue':
          return '#20b8d14D';
        default:
          return 'transparent';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.tile {
  width: 100%;
  padding: 1.75rem 2rem;

  @include whenScreenIs(mdx) {
    padding: 1.5rem 0.75rem;
  }

  &--wide,
  &.jumbotron {
    width: 100%;
  }

  &.input-cards {
    @include whenScreenIs(lg) {
      max-height: 450px;
    }
  }
}
</style>
