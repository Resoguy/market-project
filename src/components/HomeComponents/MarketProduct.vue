<template>
  <div class="column is-2-fullhd is-3-widescreen is-3-desktop is-4-tablet">
    <div class="card">
      <!-- Product Cart Image -->
      <div class="card-image">

          <figure class="image is-1by1">
            <img :src="productPic(product.photo)" :alt="product.productName">
          </figure>

      </div>

      <!-- Product Card Content -->
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <b-tooltip :label="product.productName" type="is-dark" multilined animated>
              <p class="has-text-dark is-6 subtitle limit-line">{{ product.productName }}</p>
            </b-tooltip>
          </div>
        </div>

        <div class="content has-text-right">
          <b-tag type="is-light">
            <span>{{ (product.price || 0).toFixed(2) }}</span>
            <b-icon pack="fa" icon="try" size="is-small"></b-icon>
          </b-tag>
        </div>
      </div>

      <!-- Product Action Buttons -->
      <div class="card-footer">
        <div class="card-footer-item">
          <p class="control">
            <button class="button is-brand" :class="{ 'is-loading': isLoading }" v-on:click="addToCart">
              Sepete Ekle
            </button>
          </p>
        </div>

        <div class="card-footer-item">
          <p class="control">
            <button class="button is-danger"
              :class="{ 'is-loading': isFavoriting }"
              v-on:click="addToFavorites">

              <b-icon :icon="isFav ? 'favorite' : 'favorite_border'"></b-icon>

            </button>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarketProduct',
  props: ['product'],
  data () {
    return {
      isLoading: false,
      isFavoriting: false,
      // Local data...
    }
  },
  computed: {
    picUrl () {
      return this.$store.getters.picUrl
    },

    myFavorites () {
      return this.$store.getters.myFavorites
    },

    isFav () {
      let fav = this.myFavorites.find((p) => p.id === this.product.id)
      return fav
    },
    // Computed properties...
  },
  methods: {
    productPic (pic) {
      return this.picUrl + '/' + JSON.parse(pic).large
    },

    addToCart () {
      this.isLoading = true
      let product = this.product
      this.$store.dispatch('addToCart', { product: this.product })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Error') {
            this.$toast.open({
              message: res.data,
              type: 'is-danger',
              position: 'is-bottom',
            })
          } else if (res.status === 'Success') {
            this.$toast.open({
              message: product.productName + ', başarıyla sepete eklenmiştir.',
              type: 'is-success',
              position: 'is-bottom'
            })
          } else {
            this.$snackbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          }
        })
    },

    addToFavorites () {
      this.isFavoriting = true
      if (this.isFav) {
        this.$store.dispatch('removeFromFavorites', { product: this.product })
          .then((res) => {
            this.isFavoriting = false
            this.errorHandling(res)
          })
      } else {
        this.$store.dispatch('addToFavorites', { product: this.product })
          .then((res) => {
            this.isFavoriting = false
            this.errorHandling(res)
          })
      }
    },

    errorHandling (res) {
      if (res.status === 'Warning') {
        this.$toast.open({
          message: res.data,
          type: 'is-warning',
          position: 'is-bottom',
        })
      } else if (res.status === 'Error') {
        this.$snackbar.open({
          type: 'is-danger',
          message: res.data,
          position: 'is-bottom-left',
          actionText: 'Tamam',
        })
      }
    },
    // Methods...
  }
}
</script>

<style lang="css">
.limit-line {
  max-height: 2.4em;
  line-height: 1.2em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
