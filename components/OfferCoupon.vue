<template>
  <transition name="fade" appear mode="out-in">
    <div
      v-if="showCoupon"
      class="offer-coupon"
      :class="{
        expired: isExpired,
        redeemed: isRedeemed,
        disabled: !voucherCode
      }"
    >
      <span v-if="isExpired" class="status-overlay status-expired"
        >Expired</span
      >
      <span v-if="isRedeemed" class="status-overlay status-redeemed"
        >Redeemed</span
      >
      <h1 class="heading" data-weight="normal">{{ offer.title }}</h1>
      <div class="offer-detail-container">
        <div class="image">
          <VueQrcode
            v-if="voucherCode"
            :value="voucherCode || '123456789'"
            :options="{ size: 120 }"
          />
          <VueQrcode v-else value="12345678" :options="{ size: 120 }" />
          <div v-if="!isExpired && !isRedeemed" class="offer-code">
            {{ voucherCode }}
          </div>
        </div>
        <div class="details">
          <p>Status:</p>
          <p class="value status">{{ voucherCode ? 'Active' : 'Pending' }}</p>
          <p>Uses remaining:</p>
          <p class="value remaining">{{ remainingUses }}</p>
          <p>End date:</p>
          <p class="value end">{{ offer.expiry }}</p>
        </div>
      </div>
      <div class="footer">
        <a
          v-if="voucherCode"
          class="code-button"
          :class="{ loading: loaders.email }"
          @click.prevent="sendEmail(voucherCode)"
          href="#"
        >
          <span v-if="emailSent">Email sent</span>
          <div v-else-if="loaders.email" class="loader" />
          <span v-else>Email code</span>
        </a>
        <a
          v-else
          class="code-button"
          :class="{ loading: loaders.code }"
          @click.prevent="getCode"
          href="#"
        >
          <div v-if="loaders.code" class="loader" />
          <span v-else>Get code</span>
        </a>

        <p class="view-details">
          <a href="#" @click.prevent="showDetails">View details</a>
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
import { mapActions } from 'vuex';

export default {
  props: ['offer'],
  components: { VueQrcode },
  data() {
    return {
      showCoupon: false,
      requestedCode: null,
      loaders: {
        code: false,
        email: false
      },
      emailSent: false
    };
  },
  computed: {
    offerDetails() {
      return this.offer;
    },
    voucherCode() {
      return this.requestedCode || this.offer.voucherCode;
    },
    remainingUses() {
      const currentUses = (this.offer && this.offer.currentUsage) || 0;
      return this.offer.maxUses - currentUses;
    },
    isExpired() {
      return this.offer.expired;
    },
    isRedeemed() {
      if (this.offer.expired) {
        return false;
      }
      return this.remainingUses === 0;
    },
    isDisabled() {
      return !this.offer.active;
    }
  },
  methods: {
    ...mapActions({
      flash: 'ui/flash',
      issueVoucher: 'auth/issueVoucher',
      emailVoucher: 'auth/emailVoucher',
      logout: 'auth/logout',
      isUserInSegmment: 'segments/isUserInSegment'
    }),
    showDetails() {
      this.$store.commit('ui/showModal', {
        modal: 'OfferTerms',
        modalOptions: {
          heading: 'Terms & Conditions',
          offerTerms: this.offer.tAndC
        }
      });
    },
    getCode() {
      if (!this.loaders.code) {
        this.issueVoucher({
          zonalCampaignId: this.offer.zonalCampaignId,
          campaignId: this.offer.campaignId,
          campaignTitle: this.offer.title
        })
          .then(this.handleCodeSuccess)
          .catch(this.handleError);
      }
      this.loaders.code = true;
    },

    handleCodeSuccess(res) {
      const { voucherId, voucherCode } = res.data;

      this.loaders.code = false;
      this.requestedCode = res.data.voucherCode;
      this.offerDetails.voucherId = res.data.voucherId;

      this.$logExponeaWalletAction({
        action: 'get_code',
        extraProperties: {
          voucherId,
          voucherCode
        }
      });

      this.flash({ message: 'Your voucher code is now ready to use!' });
    },

    handleError(err) {
      this.loaders.code = false;
      this.loaders.email = false;

      if (err.code === 'ECONNABORTED') {
        this.flash({
          message:
            'Looks like it’s taking a bit too long to access your account, try again'
        });
        return;
      }

      if (/400/.test(err.response.status)) {
        this.flash({
          message: 'Oops, this offer hasn’t begun yet! Please check back later.'
        });
        return;
      }

      if (/401|404/.test(err.response.status)) {
        this.logout();
        this.$nuxt.$router.push({ path: '/login' }, () => {
          this.flash({
            message: 'Oops, something went wrong! Please try again'
          });
        });
        return;
      }

      if (/403/.test(err.response.status)) {
        this.logout();
        this.$nuxt.$router.push({ path: '/login' }, () => {
          this.flash({
            message: 'You must be logged in to retrieve a voucher code!'
          });
        });
        return;
      }
      this.flash({ message: 'Oops, something went wrong! Please try again' });
    },
    sendEmail(code) {
      if (!this.emailSent) {
        this.loaders.email = true;
        this.emailVoucher({ voucherId: this.offerDetails.voucherId })
          .then(() => {
            this.loaders.email = false;
            this.emailSent = true;
            this.flash({ message: "We've sent this offer to your account" });
          })
          .catch(this.handleError);
      }
    },
    hideCoupon() {
      this.showCoupon = false;
    },
    async lookupUserInSegement() {
      if (this.voucherCode) {
        this.showCoupon = true;
        return;
      }
      const userIsInSegment = await this.isUserInSegmment({
        segmentId: this.offer.segmentId
      });
      this.showCoupon = userIsInSegment;
    }
  },
  created() {
    if (this.offer.type === 'SEGMENT') {
      this.lookupUserInSegement();
      return;
    }
    this.showCoupon = true;
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.offer-coupon {
  font-family: $font;
  width: 100%;
  max-width: 327px;
  height: 282px;
  padding: 1rem;
  margin: auto;
  border-radius: 11px;
  background-color: #fff;

  &.redeemed,
  &.expired {
    *:not(.status-overlay) {
      opacity: 0.05;
      pointer-events: none;
    }
    .expired-image {
      display: block;
    }
  }

  &.disabled {
    canvas {
      opacity: 0.05;
    }
  }

  .status-overlay {
    position: absolute;
    top: 109px;
    left: 104px;
    transform: rotate(-15deg);
    text-transform: uppercase;
    font-family: $display-font;
    font-size: 28px;
    color: $rebrand-orange;

    &.status-expired {
      top: 47%;
      left: 35%;
    }

    &.status-redeemed {
      top: 47%;
      left: 30%;
    }
  }
}

.heading {
  padding: 0 0 12px;
  font-family: $card-heading-font;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color: $greyish-brown;
  margin: 0;
  border-bottom: $pink dotted 3px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .view-details a {
    color: $black;
    text-decoration: underline;

    &.disabled {
      opacity: 0.3;
      cursor: default;

      &:hover {
        color: $black;
        background-color: #fff;
        cursor: default;
      }
    }
  }
}

.code-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  height: 40px;
  padding: 0.5rem;
  border-radius: 22px;
  background-color: $greyish-brown;
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.5;
  text-align: center;
  color: #fff;

  &.loading {
    background: $grey;
  }
}

.offer-detail-container {
  height: 176px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

  .image {
    padding: 0;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;

    .offer-code {
      width: 120px;
      text-align: center;
      font-weight: 700;
      margin-top: -2px;
    }
  }

  .details {
    color: $black;
    font-weight: bold;

    .value {
      font-family: $card-heading-font;
      font-size: 17px;
      color: $orange;
      margin-bottom: 1rem;
    }
  }
}
</style>
