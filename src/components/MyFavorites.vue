<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">
          <div class="box">

            <h2 class="title is-4">Favorilerim</h2>
            <hr>

            <div v-if="myFavorites.length">
              <favorite-item
                v-for="favorite in myFavorites"
                :key="favorite.id"
                :favorite="favorite"/>
            </div>

            <section class="section" v-else>
              <div class="content has-text-grey has-text-centered">
                <p>
                  <b-icon
                    icon="favorite"
                    size="is-large">
                  </b-icon>
                </p>
                <p>Hiç Favori ürününüz bulunmamaktadır.</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FavoriteItem from './FavoritesComponents/FavoriteItem.vue'

export default {
  name: 'MyFavorites',
  components: {
    FavoriteItem,
    // Components...
  },
  data () {
    return {
      // Local data...
    }
  },
  created () {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      this.$store.dispatch('getFavorites', { accessToken: token.access_token })
    }
    // On Create Methods...
  },
  computed: {
    myFavorites () {
      return this.$store.getters.myFavorites
    },
    // Computed properties...
  },
  methods: {
    // Methods...
  },
}
</script>

<style lang="css">
</style>
