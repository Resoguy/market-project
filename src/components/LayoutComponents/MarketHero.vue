<template>
  <div>
    <section class="hero is-primary is-bold">
      <!-- Hero Head Will Stick at the top -->
      <div class="hero-head">
        <header class="navbar is-light is-transparent">
          <div class="container">
            <!-- Change Market Button -->
            <div class="navbar-start">
              <b-dropdown>
                <a class="navbar-item" slot="trigger">
                  <b-icon icon="store"></b-icon>
                  <strong>Marketi Değiştir</strong>
                </a>

                <b-dropdown-item
                  v-for="market in markets"
                  :key="market.id"
                  v-on:click="setTopCategories(market)">
                  <p class="has-text-dark">{{ market.marketName }}</p>
                </b-dropdown-item>
              </b-dropdown>

              <market-search/>
            </div>

            <!-- Shopping Cart And MarketCoins Buttons -->
            <div class="navbar-end">

              <my-coins-btn :marketMoney="user ? user.marketMoney : 0" />
              <my-cart-btn/>
            </div>
          </div>
        </header>
      </div>

      <!-- Hero Content -->
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            <router-link :to="{ name: 'anasayfa' }">{{ curMarket || 'Konum Belirtin' }}</router-link>
          </h1>
          <h2 class="subtitle">
            <!-- Ekmeğe mi ihtiyacınız var? -->
          </h2>
        </div>
      </div>

      <!-- Hero Footer -->
      <div class="hero-foot">
        <div class="container">
          <!-- TopCategories Tabs -->
          <b-tabs type="is-boxed"
            expanded
            v-if="topCategories.length"
            @change="setSubCategories">

            <b-tab-item
              v-for="topCategory in topCategories"
              :key="topCategory.id"
              :label="topCategory.categoryName">
            </b-tab-item>

          </b-tabs>
        </div>
      </div>

    </section>

    <!-- SubCategories Tabs -->
    <nav class="navbar has-shadow">
      <div class="container">
        <div class="navbar-tabs" v-if="subCategories.length">
          <a class="navbar-item is-tab" :class="{ 'is-active': activeTab == ix }"
            v-for="subCategory, ix in subCategories"
            :key="subCategory.id"
            v-on:click="setProducts(subCategory.id, ix)">
            {{ subCategory.categoryName }}
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
//import MarketModal from './MarketModal.vue'
import MyCartBtn from './MyCartBtn.vue'
import MyCoinsBtn from './MyCoinsBtn.vue'
import MarketSearch from './MarketSearch.vue'

export default {
  name: 'MarketHero',
  components: {
    //MarketModal,
    MyCartBtn,
    MyCoinsBtn,
    MarketSearch,
    // Components...
  },
  data () {
    return {
      isMarketModalActive: false,
      activeTab: 0,
      // Local data...
    }
  },
  created () {
    // On Create Methods...
  },
  computed: {
    user () {
      const user = this.$store.getters.userInfo
      if (user) {
        return user
      }
    },

    markets () {
      return this.$store.getters.markets
    },

    curMarket () {
      return this.$store.getters.curMarket
    },

    topCategories () {
      return this.$store.getters.topCategories
    },

    subCategories () {
      return this.$store.getters.subCategories
    },
    // On Create...
  },
  methods: {
    setTopCategories (market) {
      this.$store.dispatch('setTopCategories', { market })
        .then((res) => {
          this.$router.push({ name: 'anasayfa' })
        })
    },

    setSubCategories (ix) {
      const id = this.topCategories[ix].id
      this.$store.dispatch('setSubCategories', { topCategoryId: id })
        .then(() => {
          this.activeTab = 0
          this.$router.push({ name: 'anasayfa' })
        })
    },

    setProducts (id, ix) {
      this.activeTab = ix
      this.$store.dispatch('setProducts', { subCategoryId: id })
        .then((res) => {
          this.$router.push({ name: 'anasayfa' })
        })
    },
    // Methods...
  },
}
</script>

<style lang="css" scoped>
.m-transparent {
  background-color: transparent;
}
</style>
