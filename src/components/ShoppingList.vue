<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">
          <div class="box">

            <h2 class="title is-4">Alışveriş Listem</h2>
            <hr>

            <list-panel/>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ListPanel from './ShoppingListComponents/ListPanel.vue'

export default {
  name: 'ShoppingList',
  components: {
    ListPanel,
    // Components...
  },
  data () {
    return {
      // Local data...
    }
  },
  methods: {
    // Methods...
  },
}
</script>

<style lang="css">
</style>
