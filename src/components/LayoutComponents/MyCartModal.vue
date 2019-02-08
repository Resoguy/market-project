<template>
  <div>
    <!-- If Shopping Cart Has Item -->
    <div class="modal-card" v-if="myCart.length">
      <!-- Cart Header -->
      <header class="modal-card-head">
        <p class="modal-card-title">
          Sepetim
        </p>
        <small class="has-text-dark">{{ curMarket }}</small>
      </header>

      <!-- Cart Content -->
      <section class="modal-card-body">
        <!-- Product Box -->
        <div class="box" v-for="product in myCart" :key="product.id">
          <a class="delete" v-on:click="deleteFromCart(product)"></a>
          <div class="level">
            <!-- Product Photo -->
            <div class="level-left">
              <div class="level-item">
                <figure class="image is-96x96">
                  <img :src="productPic(product.photo)" alt="product.productName">
                </figure>
              </div>

              <div class="level-item">
                <div class="content">
                  <b-tooltip :label="product.productName" type="is-dark" multilined animated>
                    <p class="control">
                      <strong>{{ nameLengthCheck(product.productName) }}</strong>
                    </p>
                  </b-tooltip>

                  <p class="control">
                    <b-tag type="is-light" size="is-medium">
                      <span>{{ product.price.toFixed(2) }}</span>
                      <b-icon icon="try" pack="fa" size="is-small"></b-icon>
                    </b-tag>
                  </p>


                </div>
              </div>
            </div>


            <!-- Product Box Right -->
            <div class="level-right">
              <div class="level-item">

                <div class="content">
                  <!-- Action Buttons -->
                  <b-field>
                    <p class="control">
                      <button class="button is-outlined is-success is-medium" :class="{ 'is-loading': isLoading }" v-on:click="addToCart(product)">
                        <b-icon icon="add"></b-icon>
                      </button>
                    </p>
                  </b-field>

                    <p class="control">Adet: <strong>{{ product.quantity }}</strong></p>

                  <b-field>
                    <p class="control">
                      <button class="button is-outlined is-danger is-medium" :class="{ 'is-loading': isLoading }" v-on:click="removeFromCart(product)">
                        <b-icon icon="remove"></b-icon>
                      </button>
                    </p>
                  </b-field>
                </div>

              </div>
            </div>
          </div>
        </div>
        <!-- Product Box Ends -->
      </section>

      <div class="modal-card-foot is-radiusless">
        <button class="button is-primary is-outlined"
          :class="{ 'is-loading': isAlternateLoading }"
          v-on:click="showAlternateMarkets">
          Alternatif Marketler
        </button>

        <div class="has-text-dark has-text-right m-text-right">
          <strong>Toplam: </strong> {{ totalPrice.toFixed(2) }}
          <b-icon icon="try" pack="fa" size="is-small"></b-icon>
          (min. tutar: {{ (minAmount || 0).toFixed(2) }} <b-icon icon="try" pack="fa" size="is-small"></b-icon>)
        </div>

        <b-modal :active.sync="isAlternateModalActive" has-card-modal>
          <alternate-market-modal :markets="alternativeMarkets" @marketChanged="$parent.close()" />
        </b-modal>
      </div>

      <!-- Cart Footer -->
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="goToCheckout">Alışverişi Tamamla</button>
        <button class="button" v-on:click="$parent.close()">Geri Dön</button>
      </footer>
    </div>

    <!-- If Shopping Cart is Empty -->
    <div class="modal-card" v-else>
      <!-- Empty Card Head -->
      <div class="modal-card-head">
        <p class="modal-card-title">Sepetim</p>
        <small class="has-text-dark">{{ curMarket }}</small>
      </div>
      <!-- Empty Card Content -->
      <div class="modal-card-body">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="add_shopping_cart"
                size="is-large">
              </b-icon>
            </p>
            <p>Sepetinizde ürün bulunmamaktadır.</p>
          </div>
        </section>
      </div>
      <!-- Empty Card Footer -->
      <footer class="modal-card-foot">
        <button class="button is-success" disabled>Alışverişi Tamamla</button>
        <button class="button" v-on:click="$parent.close()">Geri Dön</button>
      </footer>
    </div>
  </div>
</template>

<script>
import AlternateMarketModal from './AlternateMarketModal.vue'

export default {
  name: 'MyCartModal',
  components: {
    AlternateMarketModal
  },
  data () {
    return {
      isAlternateModalActive: false,
      isLoading: false,
      isAlternateLoading: false,
      // Local data...
    }
  },
  created () {
    // On Created Methods...
  },
  computed: {
    alternativeMarkets () {
      return this.$store.getters.alternativeMarketList
    },

    curMarket () {
      return this.$store.getters.curMarket
    },

    minAmount () {
      return this.$store.getters.curMinAmount
    },

    myCart () {
      return this.$store.getters.myCart
    },

    picUrl () {
      return this.$store.getters.picUrl
    },

    totalPrice () {
      let price = this.$store.getters.cartTotal
      if (price) {
        return price
      } else {
        let totalPrice = 0.0
        for (let p of this.myCart) {
          totalPrice += p.price * p.quantity
        }
        return totalPrice
      }
    },
    // Computed properties...
  },
  methods: {
    showAlternateMarkets () {
      this.isAlternateLoading = true
      let token = JSON.parse(window.localStorage.getItem('AuthUser'))
      if (token && token.access_token) {
        this.$store.dispatch('getAlternativeMarkets', { accessToken: token.access_token })
          .then((res) => {
            this.isAlternateLoading = false
            if (res.status === 'Success') {
              this.isAlternateModalActive = true
            } else if (res.status === 'Warning') {
              this.$snackbar.open({
                type: 'is-warning',
                position: 'is-top-right',
                message: res.data,
                actionText: 'TAMAM',
              })
            } else if (res.status === 'Error') {
              this.$dialog.alert({
                title: 'Hata',
                message: res.data,
                type: 'is-warning',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa'
              })
            }
          })
      } else {
        this.isAlternateLoading = false
        this.$dialog.alert({
          title: 'Giriş Yapmalısınız!',
          message: 'Alternatif Marketleri görüntüleyebilmek için giriş yapmanız gerekmektedir.',
          type: 'is-warning',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa'
        })
      }
    },

    nameLengthCheck (str) {
      if (str.length > 45) {
        return str.substring(0, 42) + '...'
      } else {
        return str
      }
    },

    productPic (pic) {
      return this.picUrl + '/' + JSON.parse(pic).medium
    },

    addToCart (product) {
      this.isLoading = true
      this.$store.dispatch('addToCart', { product })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Error') {
            this.$toast.open({
              message: res.data,
              type: 'is-danger',
              position: 'is-bottom',
            })
          } else if (res.status === 'Warning') {
            this.$snackbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          }
        })
    },

    removeFromCart (product) {
      this.isLoading = true
      this.$store.dispatch('removeFromCart', { product })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Error') {
            this.$toast.open({
              message: res.data,
              type: 'is-danger',
              position: 'is-bottom',
            })
          } else if (res.status === 'Warning') {
            this.$snackbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          }
        })
    },

    deleteFromCart (product) {
      this.isLoading = true
      this.$store.dispatch('deleteItemFromCart', { product })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Error') {
            this.$toast.open({
              message: res.data,
              type: 'is-danger',
              position: 'is-bottom',
            })
          } else if (res.status === 'Warning') {
            this.$snackbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          }
        })
    },

    goToCheckout () {
      let token = JSON.parse(window.localStorage.getItem('AuthUser'))
      if (token && token.access_token) {
        if (this.minAmount <= this.totalPrice) {
          this.$router.push({ name: 'alisverisi-tamamla' })
          this.$parent.close()
        } else {
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
        //this.$parent.close()
        this.$dialog.alert({
          title: 'Giriş Yapmalısınız!',
          message: 'Alışveriş yapabilmek için giriş yapmanız gerekmektedir.',
          type: 'is-warning',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa'
        })
      }
    }
    // Methods...
  }
}
</script>

<style lang="scss" scoped>
.m-text-right {
  width: 100%;
}
</style>
