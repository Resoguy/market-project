<template>
  <section class="section">
    <div class="container">
      <!-- Special Products of the Market
      <div class="box firsat-slider" v-if="specialProducts.length">
        <special-products :products="specialProducts"/>
      </div>
      <br>
      <hr>
      <h2 class="subtitle is-4 has-text-centered">Çay</h2>
    -->
      <!-- Products of the Market -->
      <div class="box" v-if="products.length">
        <div class="columns is-multiline is-mobile">
          <market-product
            v-for="product in products"
            :key="product.id"
            :product="product"/>
        </div>
        <market-paging v-if="Object.keys(pagingData).length"
          :currentPage="pagingData.current_page"
          :total="pagingData.total"
          :perPage="pagingData.per_page"
          :path="pagingData.path"/>
      </div>
      <!-- If there is no products or market -->
      <div class="box" v-else>
        <div class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="add_location" size="is-large"></b-icon>
            </p>
            <p>Uygulamayı kullanabilmek için konum belirtmeniz gerekmektedir.</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import SpecialProducts from './HomeComponents/SpecialProducts.vue'
import MarketProduct from './HomeComponents/MarketProduct.vue'
import MarketPaging from './HomeComponents/MarketPaging.vue'

export default {
  name: 'Home',
  components: {
    MarketProduct,
    MarketPaging,
    SpecialProducts,
    // Components...
  },
  data () {
    return {
      // Local data...
    }
  },
  created () {
    // On create methods...
  },
  computed: {
    products () {
      return this.$store.getters.products
    },

    specialProducts () {
      return this.$store.getters.specialProducts
    },

    pagingData () {
      return this.$store.getters.pagingData
    },
    // Computed properties...
  },
  methods: {
    // Methods...
  }
}
</script>

<style scoped>
.firsat-slider {
  border: 1px solid orange;
}
</style>
