<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">

          <div class="box">

            <h2 class="title is-4">Geçmiş Siparişlerim</h2>
            <hr>

            <b-table
              :data="myOrders"
              :loading="isLoading">

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="sentiment_very_dissatisfied" size="is-large"></b-icon>
                    </p>
                    <p>Daha önce hiç siparişiniz bulunmamaktadır.</p>
                  </div>
                </section>
              </template>

              <template slot-scope="props">
                <b-table-column label="Sipariş Tarihi" centered>
                  {{ props.row.date }}
                </b-table-column>

                <b-table-column label="Market Adı" centered>
                  {{ props.row.marketName }}
                </b-table-column>

                <b-table-column label="Ödeme Şekli" centered>
                  {{ props.row.paymentMethod }}
                </b-table-column>

                <b-table-column label="Toplam" centered>
                  <b-tag type="is-light" size="is-medium">
                    {{ props.row.price }}
                    <b-icon icon="try" pack="fa" size="is-small"></b-icon>
                  </b-tag>
                </b-table-column>

                <b-table-column label="Sipariş Detayı" centered>
                  <!-- Order Details Button -->
                  <button class="button is-primary" v-on:click="showSelectedOrder(props.row.id)">
                    <span>İncele</span>
                    <b-icon icon="search"></b-icon>
                  </button>
                </b-table-column>
              </template>

            </b-table>

            <!-- Order Details Modal -->
            <b-modal :active.sync="isModalActive" has-modal-card>
              <order-detail-modal :orderId="selectedOrder"/>
            </b-modal>

          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import OrderDetailModal from './PastOrdersComponents/OrderDetailModal.vue'

export default {
  name: 'PastOrders',
  components: {
    OrderDetailModal,
  },
  data () {
    return {
      isModalActive: false,
      selectedOrder: null,
      isLoading: true,
      isEmpty: false,
      // Local data...
    }
  },
  created () {
    let self = this
    this.$store.dispatch('getOrders')
      .then(() => self.isLoading = false)
    // On Create Methods...
  },
  computed: {
    myOrders () {
      return this.$store.getters.myOrders
    },
    // Computed properties...
  },
  methods: {
    showSelectedOrder (id) {
      this.selectedOrder = id
      this.isModalActive = true
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
