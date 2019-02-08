<template>
  <div>
    <div class="modal-card">
      <!-- Modal Card Head -->
      <header class="modal-card-head">
        <p class="modal-card-title">Telefon Değiştir</p>
      </header>
      <!-- Modal Card Body -->
      <section class="modal-card-body">
        <b-field label="Yeni Telefon No."
          :message="errors.phone.msg"
          :type="errors.phone.type">

          <b-input
            v-model="phone"
            @input="resetForm"
            type="phone"
            placeholder="Yeni telefon numaranızı başında '0' olmadan giriniz (536 ...)"
            required>
          </b-input>

        </b-field>
      </section>
      <!-- Modal Card Foot -->
      <footer class="modal-card-foot">
        <button type="submit"
          class="button is-success"
          :class="{ 'is-loading': isLoading }"
          v-on:click="changePhone">Kaydet</button>

        <button class="button" v-on:click="$parent.close()">Geri Dön</button>
      </footer>
    </div>

    <b-modal :active.sync="isVerificationModalActive" has-modal-card>
      <phone-verification-modal @verificationSuccess="$parent.close()"/>
    </b-modal>
  </div>
</template>

<script>
import PhoneVerificationModal from './PhoneVerificationModal.vue'

export default {
  name: 'ChangePhoneModal',
  components: {
    PhoneVerificationModal,
    // Components...
  },
  data () {
    return {
      isLoading: false,
      isVerificationModalActive: false,
      phone: '',
      errors: {
        phone: {
          msg: '',
          type: '',
        }
      },
      // Local data...
    }
  },
  methods: {
    changePhone () {
      this.isLoading = true
      this.$store.dispatch('changePhone', { phone: this.phone.trim() })
        .then((res) => {
          this.isLoading = false
          console.log('PHONE CHANGE: ', res)
          if (res.status === 'Success') {
            this.isVerificationModalActive = true
          } else if (res.status === 'Error' && typeof res.data === 'object') {
            this.errors.phone.msg = res.data.phone[0]
            this.errors.phone.type = 'is-danger'
          } else {
            this.errorHandling(res)
          }
        })
    },

    resetForm () {
      if (this.errors.phone.msg) {
        this.errors.phone.msg = ''
        this.errors.phone.type = ''
      }
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Telefon Numarası Değiştirme Hatası',
          type: 'is-danger',
          message: res.data,
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa'
        })
      } else if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          position: 'is-top-right',
          message: res.data,
          actionText: 'TAMAM',
        })
      }
    },
    // Methods...
  },
}
</script>

<style>
</style>
