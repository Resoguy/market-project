<template>
  <div>
    <b-field>
      <!-- Payment Choices -->
      <b-radio-button v-model="paymentMethod"
        native-value="2">
        Kredi Kartı
      </b-radio-button>

      <b-radio-button v-model="paymentMethod"
        native-value="1">
        Kapıda Ödeme
      </b-radio-button>

      <b-radio-button v-model="paymentMethod"
        native-value="3">
        Market Para
      </b-radio-button>

    </b-field>
    <br>

    <!-- Credit Card Form -->
    <b-message type="is-info" has-icon v-if="paymentMethod === '2'">
      <strong>Market Siparişim&trade;</strong> uygulamasında kredi kartı ile ödeme işlemlerinizi <strong>çok yakında</strong>  gerçekleştirebileceksiniz.
    </b-message>
    <!--
    <div v-if="paymentMethod === 'credit-card'">
      <b-field label="Kredi Kart No.">

        <b-input placeholder="0023 2300..."
          icon="payment"
          minlength="16"
          maxlength="19">
        </b-input>

      </b-field>

      <b-field group-multiline grouped>

        <b-field label="Son Kul.">

          <b-input placeholder="12/22"
            icon="date_range"
            maxlength="5">
          </b-input>

        </b-field>

        <b-field label="CVC">

          <b-input placeholder="Ör. 123"
            icon="payment"
            maxlength="3">
          </b-input>

        </b-field>

      </b-field>
    </div>
  -->

    <br>
  </div>
</template>

<script>
export default {
  name: 'CheckoutPayment',
  data () {
    return {
      paymentMethod: '',
      // Local data...
    }
  },
  watch: {
    paymentMethod (val) {
      this.$emit('paymentChanged', this.paymentMethod)
    },
    // Watchers for local data...
  },
  methods: {
    // Local data...
  },
}
</script>

<style lang="css">
</style>
