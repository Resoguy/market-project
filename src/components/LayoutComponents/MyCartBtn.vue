<template lang="html">
  <div :class="{ 'fix-cart-btn': isBtnFixed }">
    <a class="navbar-item" :class="{ 'button is-danger fix-btn': isBtnFixed }" v-on:click="isCartModalActive=true">
      <b-icon icon="shopping_cart" size="is-medium"></b-icon>
      <b-tag type="is-warning" rounded>{{ myCart.length }}</b-tag>
    </a>

    <b-modal :active.sync="isCartModalActive" has-modal-card>
      <my-cart-modal/>
    </b-modal>
  </div>
</template>

<script>
import MyCartModal from './MyCartModal.vue'

export default {
  name: 'MyCartBtn',
  components: {
    MyCartModal,
    // Components...
  },
  data () {
    return {
      isCartModalActive: false,
      isBtnFixed: false,
      // Local data...
    }
  },
  created () {
    window.addEventListener('scroll', this.fixCartBtn)
    // On Create Methods...
  },
  computed: {
    myCart () {
      return this.$store.getters.myCart
    },
    // On Create Methods...
  },
  methods: {
    fixCartBtn () {
      let y = window.pageYOffset
      if (y > 400) {
        this.isBtnFixed = true
      } else {
        this.isBtnFixed = false
      }
    },
    // Methods...
  }
}
</script>

<style lang="css" scoped>
.fix-cart-btn {
  position: fixed;
  bottom: 10px;
  left: 50px;
  z-index: 5;
}

.fix-btn:hover {
  background: red !important;
}
</style>
