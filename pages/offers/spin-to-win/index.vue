<template>
  <div class="spin-to-win">
    <transition name="fade" mode="out-in">
      <div v-if="!pageIsReady" class="loader-container">
        <spinner />
      </div>

      <div v-else>
        <section class="hero">
          <h1 class="hero__title">
            <span
              v-if="content.heroTitleIntro"
              class="title__intro"
              v-text="content.heroTitleIntro"
            />
            <span
              v-if="content.heroTitleMain"
              class="title__main"
              v-text="content.heroTitleMain"
            />
          </h1>
          <img
            class="hero__background-left"
            src="../../../assets/img/holly.svg"
          />
          <img
            class="hero__background-right"
            src="../../../assets/img/holly.svg"
          />
        </section>
        <section>
          <v-countdown
            v-if="showCountdown"
            title="Time until your next chance to win"
            linkText="Go to homepage"
            linkTo="/"
            :endTime="nextSpinDateMilliseconds"
            @finish="handleCountdownFinish"
          />

          <div v-else class="body" :style="getBackground">
            <h2
              v-if="content.bodyTitle"
              class="body__title"
              v-text="content.bodyTitle"
            />
            <p
              v-if="content.bodyCopy"
              class="body__copy"
              v-text="content.bodyCopy"
            />
            <div class="wheel-container" :class="{ 'no-wheel': !showWheel }">
              <img
                v-if="showWheel"
                class="wheel-container__pointer"
                src="@/assets/img/chilli.svg"
              />
              <spin-wheel
                v-if="showWheel"
                ref="wheel"
                class="wheel-container__wheel"
                :prizeOne="validPrizes[0]"
                :prizeTwo="validPrizes[1]"
                :prizeThree="validPrizes[2]"
                :prizeFour="validPrizes[3]"
                :prizeFive="validPrizes[4]"
                :prizeSix="validPrizes[5]"
                :prizeSeven="validPrizes[6]"
                :prizeEight="validPrizes[7]"
                :prizeNine="validPrizes[8]"
                :prizeTen="validPrizes[9]"
              />
              <div v-else class="wheel-container__error-message">
                <p>We're sorry, there has been a problem</p>
                <p v-for="(prize, index) in erroneousPrizes" :key="index">
                  {{ `[${prize.name}]` }}
                </p>
              </div>
            </div>
            <button v-if="showWheel" class="body__btn btn" @click="spin">
              Spin!
            </button>
          </div>
        </section>
        <section>
          <card-row v-if="content.cardRow" :card="content.cardRow" />
        </section>
      </div>
    </transition>

    <transition name="fade">
      <v-modal-container v-if="showModal">
        <v-modal
          :title="modalTitle"
          :textFirst="modalTextFirst"
          :textSecond="modalTextSecond"
          :btnText="modalBtnText"
          @btn-click="handleModalBtnClick"
          @close="closeModal"
        />
      </v-modal-container>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { TweenLite, Power4 } from 'gsap'
import dayjs from 'dayjs'
import get from 'lodash.get'
import * as cookieman from 'cookieman'

import { getContent } from '~/libs/templateHelpers.js'
import meta from '~/mixins/meta'

const CardRow = () => import('@/components/cards/CardRow')
const Spinner = () => import('@/components/iOrder-core/ui/GenericLoader')
const SpinWheel = () => import('@/components/SpinWheel')
const VCountdown = () => import('@/components/VCountdown')
const VModal = () => import('@/components/VModal')
const VModalContainer = () => import('@/components/VModalContainer')

const degreesArray = [342, 306, 270, 234, 198, 162, 126, 90, 54, 18]

export default {
  components: {
    CardRow,
    Spinner,
    SpinWheel,
    VCountdown,
    VModal,
    VModalContainer
  },
  mixins: [meta],
  async asyncData({ store, params, error }) {
    return await getContent(store, 'spin', error)
  },
  data: () => ({
    content: null,
    nextSpinDate: null,
    pageIsReady: null,
    showCountdown: null,
    showModal: null,
    spinBtnIsInactive: null,
    userVouchersAll: [],
    winningSlice: {}
  }),
  computed: {
    ...mapGetters({
      userIsAuthenticated: 'auth/userAuthenticated'
    }),
    userVouchersGame() {
      return this.userVouchersAll.filter(
        voucher => voucher.type === 'GAME' && voucher.createdAt
      )
    },
    erroneousPrizes() {
      const prizes = get(this.content, 'prizes') || []
      const invalidPrizes = prizes.filter(prize => {
        const zonalCampaignId = prize.fields && prize.fields.zonalCampaignId
        if (zonalCampaignId) {
          return !this.validZonalCampaignIds.includes(zonalCampaignId)
        }
      })

      return invalidPrizes.map(prize => {
        if (prize.fields && prize.fields.name) {
          return { ...prize.fields }
        }
      })
    },
    formattedPrizes() {
      const prizes = get(this.content, 'prizes') || []
      return prizes.map((prize, index) => {
        if (prize.fields) {
          const rotationDeg = degreesArray[index]
          const campaign = this.userVouchersAll.find(
            userVoucher =>
              userVoucher.zonalCampaignId === prize.fields.zonalCampaignId &&
              userVoucher.type === 'GAME' &&
              userVoucher.title
          )
          const campaignId = campaign && campaign.campaignId
          const title = campaign && campaign.title
          return { ...prize.fields, rotationDeg, campaignId, title }
        }
      })
    },
    gameIsEnabled() {
      const status = get(this.content, 'gameEnabled')
      return status === 'Enabled'
    },
    gameVoucherIssuedThisWeek() {
      const oneWeekAgo = dayjs().subtract(7, 'day')

      return this.userVouchersGame.find(voucher => {
        const issueDate = dayjs(voucher.createdAt)
        return issueDate > oneWeekAgo
      })
    },
    getBackground() {
      const backgroundImg = get(
        this.content,
        'bodyBackgroundDesktop.fields.file.url'
      )
      if (backgroundImg) {
        return `backgroundImage: url(https:${backgroundImg});`
      }
      return false
    },
    isWinner() {
      return (
        this.winningSlice &&
        this.winningSlice.prize &&
        this.winningSlice.prize === 'Prize'
      )
    },
    oneWeekFromGameVoucherIssuedJS() {
      const issueDate = get(this.gameVoucherIssuedThisWeek, 'createdAt')
      if (!issueDate) {
        return
      }
      const issueDateDayJS = dayjs(issueDate)
      const futureDate = issueDateDayJS.add(7, 'day')

      return futureDate.toDate()
    },
    modalTitle() {
      const winTitle = get(this.content, 'winTitle') || ''
      const loseTitle = get(this.content, 'loseTitle') || ''
      return this.isWinner ? winTitle : loseTitle
    },
    modalTextFirst() {
      const winTextFirst = get(this.winningSlice, 'title') || ''
      const loseTextFirst = get(this.content, 'loseTextFirst') || ''
      return this.isWinner ? winTextFirst : loseTextFirst
    },
    modalTextSecond() {
      const winTextSecond = get(this.content, 'winText') || ''
      const loseTextSecond = get(this.content, 'loseTextSecond') || ''
      return this.isWinner ? winTextSecond : loseTextSecond
    },
    modalBtnText() {
      return this.isWinner ? 'Go to wallet' : 'Go to homepage'
    },
    nextSpinDateMilliseconds() {
      if (!this.nextSpinDate) {
        return 0
      }
      return this.nextSpinDate.getTime()
    },
    showWheel() {
      return this.validPrizes.length === 10
    },
    validZonalCampaignIds() {
      return this.validPrizes.map(prize => prize.zonalCampaignId)
    },
    validPrizes() {
      return this.formattedPrizes.filter(prize => {
        return (
          (prize.campaignId && prize.title && prize.zonalCampaignId) ||
          prize.prize === 'No prize'
        )
      })
    }
  },
  methods: {
    ...mapActions({
      getVouchers: 'auth/getVouchers',
      logout: 'auth/logout',
      flash: 'ui/flash',
      issueVoucher: 'auth/issueVoucher',
      sendGoogleAnalyticsEvent: 'auth/sendGoogleAnalyticsEvent',
      showOptInModal: 'ui/showModal'
    }),
    closeModal() {
      this.showCountdownComponent()
      this.showModal = false
    },
    getPreviousSpinCookie() {
      const cookies = cookieman.cookies()
      return cookies.find(cookie => cookie.name === 'stwps')
    },
    handleFailedVoucherApplication() {
      TweenLite.set(this.$refs.wheel.$el, { rotation: 0 })
      this.resetData()
      this.flash({
        message: 'Oops, something went wrong. Have another spin.'
      })
    },
    handleCountdownFinish() {
      this.pageIsReady = null
      this.resetData()
      this.init()
    },
    handleModalBtnClick() {
      if (this.isWinner) {
        return this.$router.push('/offers/profile')
      }
      return this.$router.push('/')
    },
    handleResult() {
      setTimeout(() => {
        if (this.isWinner) {
          return this.handleWin()
        }
        return this.setCookieAndShowResult()
      }, 1000)
    },
    handleSuccessfulVoucherApplication() {
      this.setCookieAndShowResult()
    },
    async handleWin() {
      try {
        const campaignId = this.winningSlice.campaignId
        const campaignTitle = this.winningSlice.title
        const zonalCampaignId = this.winningSlice.zonalCampaignId

        const voucherApplied = await this.issueVoucher({
          zonalCampaignId,
          campaignId,
          campaignTitle,
          gameCampaign: true
        })

        if (voucherApplied.statusCode === 201) {
          return this.handleSuccessfulVoucherApplication()
        }

        this.handleFailedVoucherApplication()
      } catch (err) {
        console.log(err)
        this.handleFailedVoucherApplication()
      }
    },
    hasPrize(slice) {
      return slice.prize === 'Prize'
    },
    async init() {
      if (!this.gameIsEnabled) {
        return this.$router.replace({ path: '/offers/spin-to-win/unavailable' })
      }

      const userIsAuthenticated = await this.userIsAuthenticated
      if (!userIsAuthenticated) {
        return setTimeout(() => {
          this.$router.replace(
            { path: `/login?redirect=offers/spin-to-win` },
            () => {
              this.flash({
                message: 'Oops, you must be logged in to see this page'
              })
            }
          )
        }, 2000)
      }

      const isFirstLogin = get(this.$route, 'query.firstLogin')
      if (isFirstLogin) {
        this.showOptInModal({
          modal: 'OptIn',
          modalOptions: {
            heading: 'Offers'
          }
        })
      }

      const previousSpinCookie = this.getPreviousSpinCookie()
      const previousSpinCookieAddedThisWeek = this.isFewerThanSevenDaysOld(
        previousSpinCookie
      )
      if (previousSpinCookieAddedThisWeek) {
        return setTimeout(() => {
          this.setNextSpinDateFromCookie(previousSpinCookie.value)
          this.showCountdownComponent()
        }, 2000)
      }

      this.userVouchersAll = await this.getVouchers()

      if (this.gameVoucherIssuedThisWeek) {
        return setTimeout(() => {
          this.nextSpinDate = this.oneWeekFromGameVoucherIssuedJS
          this.showCountdownComponent()
        }, 2000)
      }

      setTimeout(() => {
        this.pageIsReady = true
      }, 2000)
    },
    isFewerThanSevenDaysOld(cookie) {
      const cookieValue = get(cookie, 'value')
      if (!cookieValue) {
        return false
      }

      const dateOfLastSpin = dayjs(cookieValue)
      const oneWeekAgo = dayjs().subtract(7, 'day')
      return dateOfLastSpin > oneWeekAgo
    },
    resetData() {
      this.nextSpinDate = null
      this.showCountdown = null
      this.showModal = null
      this.spinBtnIsInactive = null
      this.winningSlice = {}
    },
    setCookie() {
      const now = new Date()
      const oneWeekFromNow = dayjs()
        .add(7, 'day')
        .toDate()

      return cookieman.set('stwps', now, { expires: oneWeekFromNow })
    },
    setCookieAndShowResult() {
      this.setCookie()
      this.showModal = true

      const previousSpinCookie = this.getPreviousSpinCookie()

      this.setNextSpinDateFromCookie(previousSpinCookie.value)
    },
    setNextSpinDateFromCookie(previousSpinDate) {
      const previousDateDayJS = dayjs(previousSpinDate)
      const nextDateDayJS = previousDateDayJS.add(7, 'day')

      return (this.nextSpinDate = nextDateDayJS.toDate())
    },
    showCountdownComponent() {
      this.pageIsReady = true
      this.showCountdown = true
    },
    async spin() {
      if (this.spinBtnIsInactive) {
        return
      }
      this.spinBtnIsInactive = true

      this.sendGoogleAnalyticsEvent({
        hitType: 'event',
        eventCategory: 'spin_to_win',
        eventAction: 'spin'
      })

      const winningIndex = Math.floor(Math.random() * 10)
      this.winningSlice = this.validPrizes[winningIndex]

      const winningSliceRotation = this.winningSlice.rotationDeg
      const spinRotation = winningSliceRotation + 2160

      TweenLite.to(this.$refs.wheel.$el, 4, {
        rotation: spinRotation,
        ease: Power4.easeInOut,
        onComplete: () => this.handleResult()
      })
    }
  },
  async created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.spin-to-win {
  min-height: calc(100vh - 56px - 135px);

  @include whenScreenIs(sm) {
    min-height: calc(100vh - 64px - 135px);
  }
}

.loader-container {
  padding-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 233px;
  width: 100%;
  background: $red-xmas;
  position: relative;

  @include whenScreenIs(sm) {
    height: 352px;
  }

  &__title {
    width: 328px;

    @include whenScreenIs(sm) {
      width: 525px;
    }
  }

  &__background-left,
  &__background-right {
    position: absolute;
    top: 4px;
    -webkit-transform: scaleY(-1);
    transform: scaleY(-1);
  }

  &__background-left {
    left: 4px;
  }

  &__background-right {
    right: 4px;
    -webkit-transform: scaleX(-1) scaleY(-1);
    transform: scaleX(-1) scaleY(-1);
  }
}

.title {
  &__intro,
  &__main {
    display: block;
    font-family: $display-font;
    text-align: center;
    text-transform: uppercase;
  }

  &__intro {
    color: $charcoal;
    font-size: 38px;
    line-height: 0.89;

    @include whenScreenIs(sm) {
      font-size: 61px;
    }
  }

  &__main {
    color: $white;
    font-size: 68px;
    line-height: 0.71;

    @include whenScreenIs(sm) {
      font-size: 109px;
    }
  }
}

.body {
  padding: 0 16px 48px;
  background-color: $green-xmas;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title,
  &__copy {
    color: $white;
    text-align: center;
    width: 100%;
  }

  &__title {
    font-family: $display-font;
    font-size: 42px;
    line-height: 0.86;
    padding-top: 40px;
  }

  &__copy {
    color: $white;
    font-size: 16px;
    line-height: 1.25;
    padding-top: 16px;
  }

  &__btn {
    width: 160px;
    background-color: $white;
    color: $rebrand-red;
  }
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  position: relative;
  height: 380px;
  width: 100%;
  margin-top: 20px;

  @media (min-width: 345px) {
    height: 440px;
  }

  @media (min-width: 390px) {
    height: 460px;
  }

  @media (min-width: 420px) {
    height: 480px;
  }

  @media (min-width: 445px) {
    height: 500px;
  }

  @media (min-width: 460px) {
    height: 530px;
  }

  &.no-wheel {
    height: auto;
  }

  &__pointer {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
    z-index: 100;
  }

  &__wheel {
    width: 100%;
    min-height: 1px;
    max-width: 463px;
    max-height: 463px;
    display: inline-block;
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;
    margin: 0 auto;
  }

  &__error-message {
    color: $white;
    font-family: $display-font;
    font-size: 42px;
    line-height: 0.86;
    width: 100%;
    max-width: 368px;
    text-align: center;
  }
}
</style>
