<template>
  <div>
    <market-nav/>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-10">
            <div class="box">

              <h2 class="title is-4">Şifre Sıfırlama</h2>
              <hr>

              <form v-on:submit.prevent="resetPassword">
                <b-field label="Yeni Şifrenizi Girin"
                  :message="errors.newPassword.msg"
                  :type="errors.newPassword.type">

                  <b-input
                    v-model="newPassword"
                    type="password"
                    placeholder="Yeni şifrenizi giriniz..."
                    icon="lock"
                    @input="resetForm('newPassword')"
                    password-reveal
                    required>
                  </b-input>

                </b-field>

                <b-field label="Yeni Şifrenizi Doğrulayın"
                  :message="errors.confirmNewPassword.msg"
                  :type="errors.confirmNewPassword.type">

                  <b-input
                    v-model="confirmNewPassword"
                    type="password"
                    icon="lock"
                    @input="resetForm('confirmNewPassword')"
                    password-reveal
                    placeholder="Tekrar yeni şifrenizi girin..."
                    required>
                  </b-input>

                </b-field>

                <button class="button is-success"
                  :class="{ 'is-loading': isLoading }">
                  Şifre Değiştir
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MarketNav from './LayoutComponents/MarketNav.vue'

export default {
  name: 'ResetPassword',
  components: {
    MarketNav,
    // Components...
  },
  data () {
    return {
      isLoading: false,
      newPassword: '',
      confirmNewPassword: '',
      errors: {
        newPassword: {
          msg: '',
          type: '',
        },
        confirmNewPassword: {
          msg: '',
          type: ''
        }
      },
      // Local data...
    }
  },
  methods: {
    resetPassword () {
      this.isLoading = true
      if (this.newPassword === this.confirmNewPassword) {
        this.$store.dispatch('resetPassword', { token: this.$route.params.token, firstPassword: this.newPassword, secondPassword: this.confirmNewPassword })
          .then((res) => {
            this.isLoading = false
            if (res.status === 'Success') {
              this.$toast.open({
                type: 'is-success',
                position: 'is-top',
                message: res.data
              })
              this.$router.push({ name: 'anasayfa' })
            } else if (typeof res.data === 'object') {
              if (res.data.hasOwnProperty('firstPassword')) {
                this.errors.newPassword.msg = res.data.firstPassword[0]
                this.errors.newPassword.type = 'is-danger'
              }
              if (res.data.hasOwnProperty('secondPassword')) {
                this.errors.confirmNewPassword.msg = res.data.secondPassword[0]
                this.errors.confirmNewPassword.type = 'is-danger'
              }
            } else {
              this.isLoading = false
              this.errorHandling(res)
            }
          })
      } else {
        console.log('Eski şifre ile yeni şifre eşleşmiyor.')
      }
    },

    resetForm (key) {
      this.errors[key].msg = ''
      this.errors[key].type = ''
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Şifre Değiştirme Hatası',
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
    // Local data...
  },
}
</script>

<style lang="css">
</style>
