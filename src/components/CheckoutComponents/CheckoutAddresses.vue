<template>
  <div>

    <b-dropdown v-model="orderAddress" @change="selectAddress">
      <button class="button" slot="trigger">
        {{ orderAddress.addressTitle || 'Adres Seçiniz...' }}
      </button>

      <b-dropdown-item
        v-for="address in orderAddresses"
        :key="address.id"
        :value="address">

        <div class="media">
          <div class="media-content">
            <h3>{{ address.addressTitle }}</h3>
            <small>{{ address.address }}</small>
          </div>
        </div>

      </b-dropdown-item>
    </b-dropdown>
    <br><br>
    <p class="subtitle is-6"><strong>Adres: </strong> {{ orderAddress.address || '' }}</p>
    <p><small><strong>Adres Açıklaması: </strong>{{ orderAddress.addressDescription || '' }}</small></p>

  </div>
</template>

<script>
export default {
  name: 'CheckoutAddresses',
  data () {
    return {
      orderAddress: {},
      // Local data...
    }
  },
  created () {
    this.$store.dispatch('getOrderAddresses')
    // On Create Methods...
  },
  computed: {
    orderAddresses () {
      return this.$store.getters.orderAddresses
    },
    // Computed properties...
  },
  methods: {
    selectAddress (val) {
      this.$emit('addressChanged', val)
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
