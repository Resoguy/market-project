<template>
  <section class="section">
    <div class="container">
      <!-- Address Box Component -->
      <address-box
        v-for="address in registeredAddresses"
        :key="address.id"
        :addr="address"/>

      <div class="columns is-centered">
        <div class="column is-10">

          <b-collapse :open.sync="isFormOpen">
            <!-- New Address Button -->
              <button class="button is-success is-outlined" slot="trigger">
                <b-icon icon="add"></b-icon>
                <span>Yeni Adres Ekle</span>
              </button>


            <!-- New Address Form -->
            <div class="section">
              <div class="box">
                <!-- Address From Location -->
                <p class="subtitle is-5">{{ curAddress }}</p>
                <p class="control">
                  <small>
                    <strong>Not: </strong>Ekleyeceğiniz adresin lokasyonu yukarıdaki gibi değil ise lütfen haritadan lokasyonunuzu güncelleyiniz.
                  </small>
                </p>
                <hr>

                  <!-- Address Name Input -->
                  <b-field label="Adres Adı">
                    <b-input
                      v-model="addressTitle"
                      placeholder="Ör. Ev, İş, vb."
                      required>
                    </b-input>
                  </b-field>

                  <b-field grouped>
                    <!-- Apartment name -->
                    <b-field label="Apartman Adı">
                      <b-input
                        v-model="apt"
                        placeholder="Ör. Suphi Ramazanoğlu apt.'BOK'"
                        required>
                      </b-input>
                    </b-field>

                    <!-- Apartment roof number -->
                    <b-field label="Kat no.">
                      <b-input
                        v-model="kat"
                        type="number"
                        placeholder="Ör. 2..."
                        required>
                      </b-input>
                    </b-field>

                    <!-- Apartment no -->
                    <b-field label="Daire no.">
                      <b-input
                        v-model="no"
                        type="number"
                        placeholder="Ör. 5..."
                        required>
                      </b-input>
                    </b-field>
                  </b-field>

                  <!-- Address Detail Input -->
                  <b-field label="Adres Açıklaması">
                    <b-input
                      v-model="addressDescription"
                      type="textarea"
                      placeholder="Ör. Kasapın üstü, sarı balkonlu apt..."
                      required>
                    </b-input>
                  </b-field>

                  <!-- Add Address Button -->
                  <p class="control">
                    <button class="button is-success" v-on:click="addAddress">Kaydet</button>
                  </p>

              </div>
            </div>

          </b-collapse>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AddressBox from './MyAddressesComponents/AddressBox.vue'

export default {
  name: 'MyAddresses',
  components: {
    AddressBox,
    // Components...
  },
  data () {
    return {
      isFormOpen: false,
      addressTitle: '',
      apt: '',
      kat: '',
      no: '',
      addressDescription: '',
      // Local data...
    }
  },
  created () {
    this.$store.dispatch('getAddresses')
    // Methods on Create
  },
  computed: {
    registeredAddresses () {
      return this.$store.getters.registeredAddresses
    },

    curAddress () {
      return this.$store.getters.address
    },

    coords () {
      return this.$store.getters.coords
    }
    // Computed properties...
  },
  methods: {
    addAddress () {
      let addressInfo = {
        addressTitle: this.addressTitle.trim(),
        address: this.curAddress + ', Bina: ' + this.apt.trim() + ' kat: ' + this.kat.trim() + ' no: ' + this.no.trim(),
        addressDescription: this.addressDescription.trim(),
        longitude: this.coords.longitude,
        latitude: this.coords.latitude,
      }
      if (this.curAddress && this.addressTitle && this.addressDescription && this.apt && this.kat && this.no) {
        this.$store.dispatch('addAddress', { addressInfo })
          .then((res) => {
            if (res.status === 'Success') {
              this.successToast(this.addressTitle.trim())
              this.$store.dispatch('getAddresses')
              this.addressTitle = ''
              this.apt = ''
              this.kat = ''
              this.no = ''
              this.addressDescription = ''
              this.isFormOpen = false
            } else {
              this.errorHandling(res)
            }
          })
      } else {
        this.errorAlert('Adres eklemek için haritadan konumunuzu seçin ve formun tamamını doldurun.')
      }
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.errorAlert(res.data)
      } else if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          position: 'is-top-right',
          message: res.data,
          actionText: 'TAMAM',
        })
      }
    },

    errorAlert (msg) {
      this.$dialog.alert({
        title: 'Adres Oluşturma Hatası',
        message: msg,
        type: 'is-warning',
        hasIcon: true,
        icon: 'warning',
      })
    },

    successToast (title) {
      this.$toast.open({
        message: title + ' adresi başarıyla kaydedilmiştir.',
        type: 'is-success',
        position: 'is-top',
      })
    },
    // Methods...
  }
}
</script>

<style lang="css">
</style>
