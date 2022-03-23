<template>
    <section data-component="payment-success">
        <table>
            <tr v-if="uniqueRef">
                <td class="label">Order ID:</td>
                <td>{{ uniqueRef }}</td>
            </tr>
            <tr v-if="paidby">
                <td class="label">Paid By:</td>
                <td>{{ paidby }}</td>
            </tr>
        </table>
    </section>

</template>
<script>
export default {
    props: ['uniqueRef', 'paidby']
}
</script>

<style lang="scss" scoped>
	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';
    [data-component="payment-success"] {
        padding: 24px;
        width: 390px;
        margin: 0 auto;
        td {
            font-size: 16px;
            line-height: 28px;
            width: 140px;
            &:not(.label) {
                font-weight: 600;
            }
        }

    }
</style>
