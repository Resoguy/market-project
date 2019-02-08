<template>
  <div>
    <h2 class="title is-4 has-text-grey has-text-centered">Fırsat Ürünleri</h2>
    <carousel :perPage="1"
      :autoplay="true"
      :perPageCustom="[[768, 2], [1024, 3]]"
      :navigationEnabled="true">

      <slide v-for="product in products" :key="product.id">
        <div class="box is-borderless">
          <div class="media">
            <div class="media-left">
              <figure class="image is-128x128">
                <img :src="productPic(product.photo)" :alt="product.productName">
              </figure>
            </div>

            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{ product.productName }}</strong>
                </p>
                <p class="has-text-right">
                  <b-tag type="is-light">
                    <span>{{ (product.price || 0).toFixed(2) }}</span>
                    <b-icon pack="fa" icon="try" size="is-small"></b-icon>
                  </b-tag>
                </p>
              </div>

              <div class="level is-mobile">
                <div class="level-left">
                  <div class="level-item">
                    <button class="button is-brand"
                      :class="{ 'is-loading': isLoading }"
                      v-on:click="addToCart(product)">

                      Sepete Ekle
                    </button>
                  </div>
                  <div class="level-item">
                    <button class="button is-danger"
                      :class="{ 'is-loading': isFavoriting }"
                      v-on:click="addToFavorites(product)">

                      <b-icon :icon="isFav(product) ? 'favorite' : 'favorite_border'"></b-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'SpecialProducts',
  props: ['products'],
  components: {
    Carousel,
    Slide,
    // Components...
  },
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

    myFavs () {
      return this.$store.getters.myFavorites
    },
    // Computed properties...
  },
  methods: {
    // Method to add the item to cart
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
    // Method to add or remove the item from favorites
    addToFavorites (product) {
      this.isFavoriting = true
      if (this.isFav(product)) {
        this.$store.dispatch('removeFromFavorites', { product })
          .then((res) => {
            this.isFavoriting = false
            this.errorHandling(res)
          })
      } else {
        this.$store.dispatch('addToFavorites', { product })
          .then((res) => {
            this.isFavoriting = false
            this.errorHandling(res)
          })
      }
    },

    isFav (product) {
      let fav = this.myFavs.find((p) => p.id === product.id)
      return fav
    },

    // Error Handling method
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

    productPic (pic) {
      return this.picUrl + JSON.parse(pic).medium
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
