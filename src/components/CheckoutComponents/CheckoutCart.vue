<template lang="html">
  <div class="card">
    <div class="level">
      <!-- Left Side Items -->
      <div class="level-left">
        <div class="level-item">
          <!-- Empty Item Slot for the space at the beginning of the Card -->
        </div>

        <div class="level-item">
          <p class="control">
            <button class="button is-danger is-inverted" v-on:click="deleteItemConfirmation">
              <span><small>Sil</small></span>
              <b-icon icon="delete_forever"></b-icon>
            </button>
          </p>
        </div>

        <div class="level-item">
          <figure class="image is-64x64">
            <img :src="productPic(product.photo)" :alt="product.productName">
          </figure>
        </div>

        <div class="level-item">
          <p class="subtitle is-6">{{ product.productName }}</p>
        </div>
      </div>

      <!-- Right Side Items -->
      <div class="level-right">
        <div class="level-item">
          <p class="control">
            <b-tag type="is-light" size="is-medium">
              <span>{{ (product.price || 0).toFixed(2) }}</span>
              <b-icon icon="try" pack="fa" size="is-small"></b-icon>
            </b-tag>
          </p>
        </div>

        <div class="level-item">
          <p class="control">
            <button class="button is-danger is-outlined" :class="{ 'is-loading': isLoading }" v-on:click="removeFromCart">
              <b-icon icon="remove"></b-icon>
            </button>
          </p>
        </div>

        <div class="level-item">
          <p class="control">Adet: {{ product.quantity }}</p>
        </div>

        <div class="level-item">
          <p class="control">
            <button class="button is-success is-outlined" :class="{ 'is-loading': isLoading }" v-on:click="addToCart">
              <b-icon icon="add"></b-icon>
            </button>
          </p>
        </div>

        <div class="level-item">
          <!-- Empty Item Slot for the space at the beginning of the Card -->
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutCart',
  props: ['product'],
  data () {
    return {
      isLoading: false,
      // Local data...
    }
  },
  created () {
    // On Create Methods...
  },
  computed: {
    picUrl () {
      return this.$store.getters.picUrl
    },

    curMarket () {
      return this.$store.getters.curMarket
    },

    minAmount () {
      return this.$store.getters.curMinAmount
    },
    // Computed properties...
  },
  methods: {
    productPic (pic) {
      return this.picUrl + '/' + JSON.parse(pic).large
    },

    addToCart () {
      this.isLoading = true
      this.$store.dispatch('addToCart', { product: this.product })
        .then((res) => {
          this.isLoading = false
        })
    },

    removeFromCart () {
      this.isLoading = true
      this.$store.dispatch('removeFromCart', { product: this.product })
        .then((res) => {
          this.isLoading = false
        })
    },

    deleteItemFromCart () {
      this.$store.dispatch('deleteItemFromCart', { product: this.product })
    },

    deleteItemConfirmation () {
      this.$dialog.confirm({
        title: 'Ürünü Silmeyi Onayla',
        message: "'" + this.product.productName + "'" + ', ürününü sepetinizden kaldırmak istediğinizden emin misiniz?',
        confirmText: 'Sil',
        cancelText: 'İptal',
        type: 'is-danger',
        hasIcon: true,
        icon: 'delete_forever',
        onConfirm: () => {
          this.deleteItemFromCart()
        }
      })
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
