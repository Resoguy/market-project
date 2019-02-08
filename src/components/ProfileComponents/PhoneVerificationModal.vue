<template>
  <div class="modal-card">
    <!-- Modal Card Head -->
    <div class="modal-card-head">
      <p class="modal-card-title">Yeni Telefon Onaylama</p>
    </div>
    <!-- Modal Card Body -->
    <div class="modal-card-body">

      <b-field label="Onay Kodu"
        :message="errors.code.msg"
        :type="errors.code.type">

        <b-input
          v-model="code"
          @input="resetForm"
          type="number"
          placeholder="Telefonunuza gelen 4 haneli onay kodunu giriniz..."
          required>
        </b-input>

      </b-field>

    </div>
    <!-- Modal Card Foot -->
    <div class="modal-card-foot">
      <button class="button is-success"
        :class="{ 'is-loading': isLoading }"
        v-on:click="codeVerify">Onayla</button>
      <button class="button" v-on:click="$parent.close()">İptal</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhoneVerificationModal',
  data () {
    return {
      isLoading: false,
      code: '',
      errors: {
        code: {
          msg: '',
          type: '',
        }
      },
      // Local data...
    }
  },
  methods: {
    codeVerify () {
      this.isLoading = true
      this.$store.dispatch('changePhoneVerify', { code: this.code.trim() })
        .then((res) => {
          this.isLoading = false
          console.log('CODE VERİFİCATİON: ', res)
          if (res.status === 'Success') {
            this.$toast.open({
              type: 'is-success',
              position: 'is-top',
              message: res.data
            })
            this.$emit('verificationSuccess')
            this.$parent.close()
          } else if (res.status === 'Error' && typeof res.data === 'object') {
            this.errors.code.msg = res.data.code[0]
            this.errors.code.type = 'is-danger'
          } else {
            this.errorHandling(res)
          }
        })
    },

    resetForm () {
      if (this.errors.code.msg) {
        this.errors.code.msg = ''
        this.errors.code.type = ''
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

<style lang="css">
</style>
