<template>
  <b-dropdown position="is-bottom-left">
    <a class="navbar-item" slot="trigger">
      <b-icon icon="redeem" size="is-medium"></b-icon>
      <b-tag type="is-warning" rounded>{{ (marketMoney || 0).toFixed(2) }}</b-tag>
    </a>

    <b-dropdown-item>
      <p class="has-text-black">
        {{ marketMoney }} MP* (Market Para) bulunmaktadır.<br>
        <small>*MP = Market Para kazanmak için hemen alışverişe başlayın.</small>
      </p>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: 'MyCoins',
  props: ['marketMoney'],
  data () {
    return {
      // Local data...
    }
  },
  computed: {
    // Computed properties...
  },
  methods: {
    // Methods...
  },
}
</script>

<style lang="css">
</style>
