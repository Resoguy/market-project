<template>
  <div class="box alternative-markets">
    <b-tabs
      v-if="markets.length"
      expanded
      type="is-boxed"
      position="is-centered">

      <div class="box is-radiusless">
        <b-tab-item
          v-for="market in markets"
          :key="market.id"
          :label="market.marketName">


          <div class="level" v-for="product in market.products" :key="product.id">
            <div class="level-left">
              <div class="level-item">
                <figure class="image is-64x64">
                  <img :src="productPic(product.photo)" :alt="product.productName" />
                </figure>
              </div>
              <div class="level-item">
                {{ product.productName }}
              </div>
            </div>

            <div class="level-right">
              <div class="level-item">
                <b-tag type="is-light" size="is-medium">
                  {{ product.price.toFixed(2) }}
                  <b-icon icon="try" pack="fa" size="is-small"></b-icon>
                </b-tag>
              </div>
              <div class="level-item">
                Adet {{ product.quantity }}
              </div>
              <div class="level-item">

              </div>
            </div>
          </div>

          <hr>
          <div>
            <button class="button is-primary" v-on:click="changeToMarket(market)">Marketi Değiştir</button>
            <button class="button" v-on:click="$parent.close()">Geri Dön</button>
          </div>
        </b-tab-item>
      </div>

    </b-tabs>

    <div class="box" v-else>
      <div class="section">
        <div class="content has-text-centered has-text-grey">
          <p>
            <b-icon
              icon="store"
              size="is-large">
            </b-icon>
          </p>
          <p>Sepetinize uygun bir alternatif market çevrenizde bulunmamaktadır.</p>
        </div>
      </div>
      <hr>
      <button class="button" v-on:click="$parent.close()">Geri Dön</button>
    </div>

  </div>
</template>

<script>
export default {
  props: ['markets'],
  data () {
    return {
      // Local data...
    }
  },
  computed: {
    picUrl () {
      return this.$store.getters.picUrl
    },
    // Computed properties...
  },
  methods: {
    changeToMarket (market) {
      let token = JSON.parse(window.localStorage.getItem('AuthUser'))
      if (token && token.access_token) {
        this.$store.dispatch('changeToAlternativeMarket', { accessToken: token.access_token, market })
          .then((res) => {
            this.$router.push({ name: 'anasayfa' })
            this.$emit('marketChanged')
            this.$parent.close()
          })
      }
    },

    productPic (pic) {
      return this.picUrl + JSON.parse(pic).medium
    },
    // Methods...
  },
}
</script>

<style lang="scss">
.alternative-markets {
  background-color: #347998;
}
</style>
