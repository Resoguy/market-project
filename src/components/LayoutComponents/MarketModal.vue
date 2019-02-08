<template>
  <!--
  <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Yakınınızdaki Marketler</p>
      </header>

      <section class="modal-card-body">
        <p>BOK</p>
      </section>

      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
      </footer>
  </div>
-->
  <div class="">
    <b-field>
      <b-select v-model="market" placeholder="Market Seçiniz." multiple>
        <option value="at-market">At Market</option>
        <option value="inönü-market">İnönü Market</option>
        <option value="bok-market">Bok Market</option>
      </b-select>
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'MarketModal',
  data () {
    return {
      market: '',
      // Local data...
    }
  },
  methods: {
    // Methods...
  }
}
</script>

<style lang="css">
</style>
