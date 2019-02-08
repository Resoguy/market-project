<template>
  <div class="card">
    <div class="level">
      <!-- Left Side of the Card -->
      <div class="level-left">
        <div class="level-item">
          <figure class="image is-96x96">
            <img :src="favoritePic" :alt="favorite.productName">
          </figure>
        </div>

        <div class="level-item">
          <div class="has-text-centered">
            <b-tooltip :label="favorite.productName" type="is-dark" multilined animated>
              <p class="subtitle is-6">
                {{ favoriteProductName }}
              </p>
            </b-tooltip>

            <p class="control">
              <small>{{ favorite.marketName }}</small>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side of the Card -->
      <div class="level-right">
        <div class="level-item">
          <p class="control">
            <b-tag type="is-light" size="is-medium">
              <span>{{ favorite.price.toFixed(2) }}</span>
              <b-icon icon="try" pack="fa" size="is-small"></b-icon>
            </b-tag>
          </p>
        </div>

        <div class="level-item">
            <p class="control">
              <button class="button is-brand"
                :class="{ 'is-loading': isLoading }"
                v-on:click="addToCart">

                Sepete Ekle

              </button>
            </p>
        </div>

        <div class="level-item">
          <button class="button is-danger is-outlined"
            :class="{ 'is-loading': isDeleting }"
            v-on:click="removeConfirmation">

            <b-icon icon="delete_forever"></b-icon>
            <span><small>Sil</small></span>

          </button>
        </div>

        <div class="level-item">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoriteItem',
  props: ['favorite'],
  data () {
    return {
      isLoading: false,
      isDeleting: false,
      // Local data...
    }
  },
  created () {
    // On Create Methods...
  },
  computed: {
    picUrl () {
      return this.$store.getters.picUrl
    },

    favoritePic () {
      return this.picUrl + '/' + JSON.parse(this.favorite.photo).medium
    },

    favoriteProductName () {
      if (this.favorite.productName.length > 70) {
        return this.favorite.productName.substring(0, 70) + '...'
      }
      return this.favorite.productName
    },
    // Computed Properties...
  },
  methods: {
    addToCart () {
      this.isLoading = true
      this.$store.dispatch('addToCart', { product: this.favorite })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Success') {
            this.$toast.open({
              message: this.favorite.productName + ', başarıyla sepete eklenmiştir.',
              type: 'is-success',
              position: 'is-bottom'
            })
          } else if (res.status === 'Error') {
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

    removeFromFavorites () {
      this.isDeleting = true
      this.$store.dispatch('removeFromFavorites', { product: this.favorite })
        .then((res) => {
          this.isDeleting = false
          if (res.status === 'Success') {
            this.$toast.open({
              type: 'is-success',
              position: 'is-top',
              message: 'Favori ürün başarıyla listeden kaldırıldı.'
            })
          } else if (res.status === 'Error') {
            this.$dialog.alert({
              title: 'Favori Silme Hatası',
              message: res.data,
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
            })
          } else if (res.status === 'Warning') {
            this.$snackbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          }
        })
    },

    removeConfirmation () {
      this.$dialog.confirm({
        title: 'Favori Silmeyi Onayla',
        message: "'" + this.favorite.productName + "'" + ', ürününü favorilerinizden kaldırmak istediğinize emin misiniz?',
        confirmText: 'Sil',
        cancelText: 'İptal',
        type: 'is-danger',
        hasIcon: true,
        icon: 'delete_forever',
        onConfirm: () => {
          this.removeFromFavorites()
        }
      })
    }
    // Methods...
  },
}
</script>

<style lang="css">
</style>
