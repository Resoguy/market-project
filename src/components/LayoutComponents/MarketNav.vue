<template>
  <nav class="navbar">
    <div class="container">
      <!-- Brand Logo -->
      <div class="navbar-brand">
        <router-link class="navbar-item" :to="{ name: 'anasayfa' }">
          <img src="../../assets/marketsiparisim_brand.png" alt="Bulma" height="50">
        </router-link>
        <div class="navbar-burger burger" :class="{ 'is-active': isMobileNavActive }" data-target="marketLoginNavbar" v-on:click="mobileNavToggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="marketLoginNavbar" class="navbar-menu" :class="{ 'is-active': isMobileNavActive }">
        <!-- Login or Profile Button -->
        <div class="navbar-end">
          <user-menu v-if="user"/>
          <login-form v-else/>
        </div>
      </div>

    </div>
  </nav>
</template>

<script>
import LoginForm from './LoginForm.vue'
import UserMenu from './UserMenu.vue'

export default {
  name: 'MarketNav',
  components: {
    LoginForm,
    UserMenu,
    // Components...
  },
  data () {
    return {
      isMobileNavActive: false,
      // Local data...
    }
  },
  computed: {
    user () {
      return this.$store.getters.userInfo
    },
    // Computed properties...
  },
  methods: {
    mobileNavToggle (e) {
      this.isMobileNavActive = !this.isMobileNavActive
    },
    // Methods...
  },
}
</script>

<style lang="css" scoped>
.is-sticky {
  position: sticky;
  top: 48px;
  z-index: 10;
}
</style>
