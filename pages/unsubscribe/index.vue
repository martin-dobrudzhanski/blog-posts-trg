<template>
  <section class="unsubscribe-page" data-fullscreen>
    <section v-if="!complete">
      <p><a href="#" @click="submit">Click here</a> to unsubscribe</p>
    </section>
    <p v-else-if="error">Oops, we're having trouble processing your request. Please try again later.</p>
    <section v-else>
      <p>Thanks, your request is being processed, it may take up to 24 hours to take effect.</p>
    </section>
  </section>
</template>

<script>
  import { getContent } from '~/libs/templateHelpers.js'
  
  export default {
	  validate({ params, query, store }) {
      return !!query.campaign_id && !!query.contact_uid && !!query.llid
    },
    data () {
      return {
        content: null,
        isLoading: false,
        complete: false,
        error: false
      }
    },
    methods: {
      async submit () {
        if (this.isLoading) {
          return
        }
        this.isLoading = true;
        const payload ={
          contact_uid: this.$route.query.contact_uid,
          campaign_id: this.$route.query.campaign_id,
          llid: this.$route.query.llid
        }
        const success = await this.$store.dispatch('preferences/unsubscribeUser', { payload });
        if (!success) {
          this.isLoading = false;
          this.error = true;
        }
        
        this.isLoading = false;
        this.complete = true; 
      }
 		},
    async asyncData ({ store, params, error }) {
			return await getContent(store, 'terms-page', error);
    }
  }
</script>

<style lang="scss">
  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';
	section.unsubscribe-page {
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    width:100%;
    p {
      margin:16px;
      font-size:18px;
      text-align: center;
      line-height: 20px;
    }
    
	}
</style>