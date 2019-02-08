<template>
  <b-dropdown>
    <a class="navbar-item" slot="trigger">
      <span>Hoşgeldin, {{ user.name }}</span>
      <b-icon icon="arrow_drop_down"></b-icon>
    </a>

    <b-dropdown-item has-link>
      <router-link :to="{ name: 'profilim' }">
        <b-icon icon="settings"></b-icon>
        <span>Profilim</span>
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item has-link>
      <router-link :to="{ name: 'adreslerim' }">
        <b-icon icon="location_city"></b-icon>
        <span>Adreslerim</span>
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item has-link>
      <router-link :to="{ name: 'favorilerim' }">
        <b-icon icon="favorite"></b-icon>
        <span>Favorilerim</span>
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item has-link>
      <router-link :to="{ name: 'alisveris-listem' }">
        <b-icon icon="view_list"></b-icon>
        <span>Alışveriş Listem</span>
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item has-link>
      <router-link :to="{ name: 'gecmis-siparisler' }">
        <b-icon icon="history"></b-icon>
        <span>Geçmiş Siparişlerim</span>
      </router-link>
    </b-dropdown-item>

    <hr class="dropdown-divider">

    <b-dropdown-item v-on:click="logout">
      <b-icon icon="power_settings_new"></b-icon>
      <span>Çıkış Yap</span>
    </b-dropdown-item>

  </b-dropdown>

</template>

<script>
export default {
  name: 'UserMenu',
  data  () {
    return {
      // Local data...
    }
  },
  created () {
    // On Created...
  },
  computed: {
    user () {
      return this.$store.getters.userInfo
    },
    // Computed properties...
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/'))
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
