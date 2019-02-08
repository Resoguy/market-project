<template>
  <div>
    <!-- Map navigation -->
    <map-collapse/>
    <!-- Layout Header -->
    <market-nav/>
    <!-- Layout Hero Section -->
    <market-hero/>
    <!-- Page views -->
    <router-view/>
    <!-- Layout Footer -->
    <market-footer/>
    <!-- Loading Component -->
    <b-loading :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import MapCollapse from './LayoutComponents/MapCollapse.vue'
import MarketNav from './LayoutComponents/MarketNav.vue'
import MarketHero from './LayoutComponents/MarketHero.vue'
import MarketFooter from './LayoutComponents/MarketFooter.vue'

export default {
  name: 'Layout',
  components: {
    MapCollapse,
    MarketNav,
    MarketHero,
    MarketFooter,
  },
  created () {
    // On Create Methods...
  },
  data () {
    return {
      // Local data...
    }
  },
  computed: {
    isLoading () {
      return this.$store.getters.isLoading
    },
    // Computed properties...
  },
  methods: {
    // Methods...
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
