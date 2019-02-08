<template>
  <b-collapse class="card" :class="{ 'is-sticky': isSticky }" :open.sync="isOpen">
    <div class="card-header" slot="trigger">
      <div class="container">
        <p class="card-header-icon">
          {{ neighborhood }}
          <b-icon :icon="isOpen ? 'arrow_drop_up' : 'arrow_drop_down'"></b-icon>
        </p>
      </div>
    </div>

    <gmap-map
      class="card-content"
      :center="center"
      :zoom="14"
      :clickable="true"
      v-on:click="markPosition"
      style="width: 100%; height: 250px;">

      <gmap-marker
        v-if="marker.position.lat"
        :position="marker.position">
      </gmap-marker>

    </gmap-map>

  </b-collapse>
</template>

<script>
export default {
  name: 'MapCollapse',
  data () {
    return {
      y: 0,
      isSticky: true,
      isOpen: true,
      center: {
        lat: 36.99497377303985,
        lng: 35.31829833984375
      },
      marker: {
        position: {
          lat: null,
          lng: null
        }
      },
      // Local data...
    }
  },
  created () {
    this.getPosition()
    this.tokenCheckLogin()
    window.addEventListener('scroll', this.handleScroll)
    // On create methods...
  },
  computed: {
    neighborhood () {
      let address = this.$store.getters.address
      return address ? address.split(', ')[0] : 'Konum belirtin'
    }
    // Computed properties...
  },
  methods: {
    handleScroll () {
      let pageY = window.pageYOffset
      let x = Math.abs(pageY - this.y)
      if (x > 5 && x < 100) {
        this.isOpen = false
        this.y = pageY
      } else {
        this.y = pageY
      }
    },

    tokenCheckLogin () {
      let token = JSON.parse(window.localStorage.getItem('AuthUser'))
      if (token && token.access_token) {
        this.$store.dispatch('getUserInfo', { tokenData: token })
          .then((res) => {
            if (res.status === 'Success') {
              this.$store.dispatch('getFavorites', { accessToken: res.tokenData.access_token })
                .then((res) => {
                  this.errorHandling(res)
                })
              this.$store.dispatch('getCarts', { accessToken: res.tokenData.access_token })
                .then((res) => {
                  this.errorHandling(res)
                })
            } else {
              this.errorHandling(res)
            }
          })
      }
    },
    // Method that gets location from browser on start
    getPosition () {
      let self = this
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude
        let lng = position.coords.longitude
        this.center = {
          lat: lat,
          lng: lng
        }
        this.marker.position.lat = lat
        this.marker.position.lng = lng
        this.$store.dispatch('nearbyMarkets', { lat: lat, lng: lng })
          .then((res) => {
            // Sends response to the method that checks status of the response to handle error if there is one
            self.errorHandling(res)
            // Gets user info if there is token in localStorage
          })
      }, err => {
        console.log(err)
        this.$store.commit('loadingState', { isLoading: false })
        this.warningSnack('Uygulamanın düzgün çalışabilmesi için konum bilginiz açmanız ya da haritadan konum belirtmeniz gerekmektedir!')
      })
    },

    // Method to change location on map click
    markPosition (e) {
      let self = this
      let lat = e.latLng.lat()
      let lng = e.latLng.lng()
      this.marker.position.lat = lat
      this.marker.position.lng = lng
      this.$store.dispatch('nearbyMarkets', { lat: lat, lng: lng })
        .then((res) => {
          // Sends response to the method that checks status of the response to handle error if there is one
          if (res.status !== 'Success') {
            self.errorHandling(res)
          }
        })
    },

    // Error handling method
    errorHandling (res) {
      if (res.status === 'Error') {
        this.showDialog(res.data)
      } else if (res.status === 'Warning' && typeof res.data === 'object') {
        this.warningSnack(res.data.Message)
      } else if (res.status === 'Warning') {
        this.warningSnack(res.data)
      }
    },

    // Warning handling method that shows a snackbar on the top right of the page
    warningSnack (msg) {
      this.$snackbar.open({
        type: 'is-warning',
        position: 'is-top-right',
        message: msg,
        actionText: 'TAMAM',
        // onAction: () => {}
      })
    },

    // Error handling method that shows an alert box on confirm reloads the page
    showDialog (msg) {
      this.$dialog.alert({
        title: 'Hata',
        message: msg,
        type: 'is-danger',
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa',
        onConfirm: () => window.location.reload(true)
      })
    },
    // Methods...
  },
}
</script>

<style lang="css" scoped>
.is-sticky {
  position: sticky;
  top: 0px;
  z-index: 5;
}
</style>
