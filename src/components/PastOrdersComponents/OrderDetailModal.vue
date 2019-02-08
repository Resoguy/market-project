<template>
  <div class="modal-card">
    <!-- Order Details Header -->
    <header class="modal-card-head">
      <p class="modal-card-title">At Market Sipariş Detayı</p>
    </header>

    <!-- Order Details Table -->
    <section class="modal-card-body" v-if="orderDetails.hasOwnProperty('products')">
      <b-table
        :data="orderDetails.products"
        :loading="isLoading">

        <template slot-scope="props">
          <b-table-column label="Ürün Adı">
            {{ props.row.productName }}
          </b-table-column>

          <b-table-column label="Adet">
            {{ props.row.count }}
          </b-table-column>

          <b-table-column label="Fiyat">
            <b-tag type="is-light" size="is-medium">
              <span>{{ props.row.price.toFixed(2) }}</span>
              <b-icon icon="try" pack="fa" size="is-small"></b-icon>
            </b-tag>
          </b-table-column>
        </template>

      </b-table>
      <hr>

      <p class="control has-text-right">
        <span><strong>Toplam: </strong>{{ orderDetails.price.price }}</span>
        <b-icon icon="try" pack="fa" size="is-small"></b-icon>
      </p>
    </section>

    <!-- Order Detail Footer -->
    <footer class="modal-card-foot">
      <button class="button is-success"
        :class="{ 'is-loading': isReordering }"
        v-on:click="reOrder">
        Siparişi Tekrarla
      </button>
      <button class="button" v-on:click="$parent.close()">Geri Dön</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailModal',
  props: ['orderId'],
  data () {
    return {
      isReordering: false,
      isLoading: true,
      // Local data...
    }
  },
  created () {
    this.$store.dispatch('getOrderDetails', { orderId: this.orderId })
      .then(() => {
        this.isLoading = false
      })
    // On Create methods...
  },
  computed: {
    orderDetails () {
      return this.$store.getters.myOrderDetails
    },
    // Computed properties...
  },
  methods: {
    reOrder () {
      this.$store.dispatch('reOrder', { orderId: this.orderId })
        .then((res) => {
          if (res.status === 'Success') {
            this.$router.push({ name: 'alisverisi-tamamla' })
          } else {
            this.errorHandling(res)
          }
        })
        this.$parent.close()
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Hata',
          message: res.data,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          //onConfirm: () => window.location.reload(true)
        })
      } else if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          position: 'is-top-right',
          message: res.data,
          actionText: 'TAMAM',
        })
      }
    },
    // Local Methods...
  },
}
</script>

<style lang="css">
</style>
