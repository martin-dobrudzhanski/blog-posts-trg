<template>
	<section class="click-and-collect-container">

        <iframe
            id="cc-iframe"
            :src="src"
            allow="geolocation"
            frameborder="0"
            data-fullscreen>
        </iframe>

	</section>
</template>

<script>
	export default {
		props: ['zonalsiteid'],
        computed: {
            src () {
                const host = window && window.location && window.location.host
                const siteIdParam = this.zonalsiteid ? `/${this.zonalsiteid}` : ''
                const stageSuffix = /chiquito\.co\.uk/.test(host) ? '' : '-stage'
                if (!siteIdParam) {
                  return `https://clickandcollect${ stageSuffix }.omnifitrgsites.co.uk/chiquito.html`
                } else {
                  return `https://clickandcollect${ stageSuffix }.omnifitrgsites.co.uk/chiquito.html#/locations${ siteIdParam }`
                }
            }
        },
        methods: {
            postMessage (event) {

                if (!/localhost|clickandcollect\.omnifitrgsites\.co\.uk|clickandcollect-stage\.omnifitrgsites\.co\.uk/.test(event.origin)) {
                    return;
                }
                if (event.data.eventType === 'submit') {
                    window.scrollTo(0,0);
                    return;
                }
                if (event.data.eventName === 'clickandcollect.order.success') {
                    this.addToDataLayer(event.data);
                    this.sendGAEvent(event.data);
                }
            },
            sendGAEvent (eventDetail) {
                let gaConfig = {};
                gaConfig['hitType']        = 'event';
                gaConfig['eventCategory']  = 'Click and Collect Order';
                gaConfig['eventAction']    = 'C&CORDERPLACED';
                var labels = [];
                for (var key in eventDetail) {
                    labels.push(key + ': ' + eventDetail[key]);
                }
                gaConfig['eventLabel'] = labels.join(', ');
                window.ga = window.ga || ((...data) => { console.log(data) })
                window.ga('send', gaConfig);
            },
            addToDataLayer (eventDetail) {
                let tagManConfig = eventDetail.order
                tagManConfig.eventType = eventDetail.eventName
                tagManConfig.brand = eventDetail.brand
                tagManConfig['event']   = 'Click and Collect Order';
                tagManConfig['action']  = 'C&CORDERPLACED';

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push(tagManConfig);
            }
        },
        mounted () {
            window.addEventListener('message', this.postMessage)
        },
        beforeDestroy () {
            window.removeEventListener('message', this.postMessage)
        },
	}


</script>

<style lang="scss" scoped>
    .click-and-collect-container {
        width: 100%;
        iframe {
            width: 100%;
            height: 100vh;
        }
    }
</style>
