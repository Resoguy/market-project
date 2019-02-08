<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">
          <!-- Shopping Cart Box -->
          <div class="box">

            <h4 class="title is-4">Sepetimdeki Ürünler <small class="subtitle">( {{ curMarket }} )</small> </h4>
            <hr>

            <div v-if="myCart.length">
              <checkout-cart
                v-for="product in myCart"
                :key="product.id"
                :product="product"/>

              <hr>

              <p class="control has-text-right">
                <span class="title is-6">Toplam Tutar: </span>
                <span class="subtitle is-6">
                  <span>{{ totalPrice }}</span>
                  <b-icon icon="try" pack="fa" size="is-small"></b-icon>
                </span>
                <span class="subtitle is-6">
                  (
                  <span>min. tutar: {{ minAmount }}</span>
                  <b-icon icon="try" pack="fa" size="is-small"></b-icon>
                  )
                </span>
              </p>
            </div>
            <!-- If Shopping Cart is Empty -->
            <div v-else>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon
                      icon="add_shopping_cart"
                      size="is-large">
                    </b-icon>
                  </p>
                  <p>Alışveriş yapabilmek için sepetinize market reyonundan ürün eklemelisiniz.</p>
                </div>
                </section>
            </div>

          </div>

          <!-- Address Selection Box -->
          <div class="box">

            <h4 class="title is-4">Adres Seçimi</h4>
            <hr>

            <checkout-addresses @addressChanged="changeAddress"/>

          </div>

          <!-- Payment Method -->
          <div class="box">

            <h4 class="title is-4">Ödeme Şekli</h4>
            <hr>

            <checkout-payment @paymentChanged="changePayment"/>

          </div>

          <!-- Note to Market and Order Button -->
          <div class="box">

            <h4 class="title is-4">Siparişi Onayla</h4>
            <hr>

            <b-field label="Sipariş Notu">
              <b-input
                v-model="orderNote"
                placeholder="Ör. 200 tl para üstü getirebilirseniz sevinirim..."
                maxlength="200"
                type="textarea">
              </b-input>
            </b-field>

            <p class="control has-text-right">
              <button class="button is-success is-large"
                :class="{ 'is-loading': isLoading }"
                v-on:click="checkout">
                Sipariş Ver
              </button>
            </p>

          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CheckoutAddresses from './CheckoutComponents/CheckoutAddresses.vue'
import CheckoutPayment from './CheckoutComponents/CheckoutPayment.vue'
import CheckoutCart from './CheckoutComponents/CheckoutCart.vue'

export default {
  name: 'Checkout',
  components: {
    CheckoutCart,
    CheckoutPayment,
    CheckoutAddresses,
    // Components...
  },
  data () {
    return {
      isLoading: false,
      orderAddress: {},
      orderPayment: '',
      orderNote: '',
      // Local data...
    }
  },
  created () {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    this.$store.dispatch('getCarts', { accessToken: token.access_token })
    // On Create Methods...
  },
  computed: {
    myCart () {
      return this.$store.getters.myCart
    },

    totalPrice () {
      return this.$store.getters.cartTotal
    },

    curMarket () {
      return this.$store.getters.curMarket
    },

    marketId () {
      return this.$store.getters.marketId
    },

    minAmount () {
      return this.$store.getters.curMinAmount
    },
    // Computed properties...
  },
  methods: {
    changeAddress (val) {
      this.orderAddress = val
    },

    changePayment (val) {
      this.orderPayment = val
    },

    checkout () {
      this.isLoading = true
      if (this.orderPayment === '1') {
        if (this.minAmount <= this.totalPrice) {
          let orderData = {
            marketId: this.marketId,
            products: JSON.stringify(this.myCart),
            addressId: this.orderAddress.id,
            paymentMethod: this.orderPayment,
            note: this.orderNote.trim()
          }
          if (this.marketId && this.myCart.length && this.orderAddress.id && this.orderPayment) {
            this.$store.dispatch('checkout', { orderData })
              .then((res) => {
                this.isLoading = false
                if (res.status === 'Success') {
                  this.$toast.open({
                    type: 'is-success',
                    position: 'is-top',
                    message: res.data
                  })
                  this.$router.push({ name: 'anasayfa' })
                } else {
                  this.errorHandling(res)
                }
              })
          } else {
            this.isLoading = false
            this.$dialog.alert({
              title: 'Sipariş Ayarları Hatası',
              message: 'Sipariş verebilmek için bir sipariş adresi ve/veya ödeme şeklinizi seçmelisiniz.',
              type: 'is-warning',
              hasIcon: true,
              iconPack: 'fa',
              icon: 'warning'
            })
          }
        } else {
          this.isLoading = false
          // Alert if cart total amount doesn't meet the min. amount of the market
          this.$dialog.alert({
            title: 'Düşük Sepet Tutarı',
            message: 'Alışverişi tamamlayabilmeniz için sepet tutarınız, marketin belirlediği minimum paket tutarının üzerinde olmalı.',
            type: 'is-warning',
            hasIcon: true,
            iconPack: 'fa',
            icon: 'try'
          })
        }
      } else {
        this.isLoading = false
        this.$dialog.alert({
          title: 'Ödeme Şekli Uyarısı',
          type: 'is-warning',
          hasIcon: true,
          icon: 'warning',
          message: 'Kısa bir süre için alışverişlerinizi yalnızca Kapıda Ödeme seçeneği ile tamamlayabilirsiniz.'
        })
      }
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Sipariş Hatası',
          type: 'is-danger',
          message: res.data,
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa'
        })
      } else if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          position: 'is-top-right',
          message: res.data,
          actionText: 'TAMAM',
        })
      }
    }
    // Methods...
  },
}
</script>

<style lang="css">
</style>
