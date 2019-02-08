<template>
  <div>
    <a class="navbar-item m-search-btn"
      v-on:click="activateSearchModal">
      <b-icon icon="search"></b-icon>
      <strong>Markette Ara</strong>
    </a>

    <b-modal :active.sync="isSearchModalActive" has-modal-card>
      <div class="modal-card">
        <!-- Modal Head -->
        <div class="modal-card-head">
          <b-field class="modal-card-title" label="Arama">
            <b-input v-model="searchWord"
              icon="search"
              placeholder="Ör. Aynes Taze Kaşar"
              :loading="isLoading"
              @input="getSearchResults">
            </b-input>
          </b-field>
        </div>

        <!-- Modal Body -->
        <div class="modal-card-body">
          <div class="columns is-mobile is-multiline" v-if="searchResults.length">
            <div class="column is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile" v-for="product in searchResults" :key="product.id">
              <!-- Product Card -->
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
                  <!-- If Item not in Cart -->
                  <div class="card-footer-item is-paddingless">
                    <p class="control">
                      <button class="button is-brand"
                        :class="{ 'is-loading': isAdding }"
                        v-on:click="addToCart(product)">

                        Sepete Ekle
                      </button>
                    </p>
                    &nbsp;
                    <p class="control">
                      <button class="button is-danger"
                        :class="{ 'is-loading': isFavoriting }"
                        v-on:click="addToFavorites(product)">

                        <b-icon :icon="isFav(product) ? 'favorite' : 'favorite_border'"></b-icon>
                      </button>
                    </p>
                  </div>

                </div>
              </div>
              <!-- Product Card End -->
            </div>

          </div>

          <!-- Empty Search -->
          <div class="section" v-else>
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon
                  icon="search"
                  size="is-large">
                </b-icon>
              </p>
              <p>Ürün görebilmek için markette arama yapmalısınız.</p>
            </div>
          </div>
        </div>

      </div>
    </b-modal>

  </div>
</template>

<script>
export default {
  name: 'MarketSearch',
  data () {
    return {
      searchWord: '',
      isLoading: false,
      isAdding: false,
      isFavoriting: false,
      isSearchModalActive: false,
      // Local data...
    }
  },
  computed: {
    searchResults () {
      return this.$store.getters.searchResults
    },

    picUrl () {
      return this.$store.getters.picUrl
    },

    myFavs () {
      return this.$store.getters.myFavorites
    },
    // Computed Properties...
  },
  methods: {
    activateSearchModal () {
      this.searchWord = ''
      this.isSearchModalActive = true
    },

    getSearchResults () {
      if (this.searchWord.length > 2) {
        this.isLoading = true
        this.$store.dispatch('getSearchResults', { searchWord: this.searchWord })
          .then((res) => {
            if (res.status === 'Success') {
              this.isLoading = false
            }
          })
      } else {
        this.$store.dispatch('emptySearchResults')
      }
    },

    productPic (pic) {
      return this.picUrl + '/' + JSON.parse(pic).medium
    },

    addToCart (product) {
      this.isAdding = true
      this.$store.dispatch('addToCart', { product })
        .then((res) => {
          this.isAdding = false
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
  },
}
</script>

<style lang="css" scoped>
.card-footer {
  border-top-color: transparent;
}

.m-search-btn {
  height: 100%;
}

.limit-line {
  max-height: 2.4em;
  line-height: 1.2em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
