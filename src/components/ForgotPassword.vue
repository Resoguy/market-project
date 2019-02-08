<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">

          <div class="box">
            <h2 class="title is-4">Şifremi Unuttum</h2>
            <hr>

            <form v-on:submit.prevent="sendMail">
              <b-field label="Email Adresiniz"
                :message="errors.email.msg"
                :type="errors.email.type">

                <b-input
                  v-model="email"
                  type="email"
                  icon="email"
                  @input="resetForm"
                  placeholder="Email adresinizi giriniz..."
                  required>
                </b-input>

              </b-field>

              <button class="button is-primary"
                :class="{ 'is-loading': isLoading }"
                type="submit">
                Gönder
              </button>
            </form>

            <hr>
            <small><strong>Not: </strong>Hesabınıza ait e-mail adresinizi girdikten sonra, e-mail adresinize gönderilecek link yardımıyla şifrenizi değiştirebilirisiniz.</small>

          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data () {
    return {
      isLoading: false,
      email: '',
      errors: {
        email: {
          msg: '',
          type: ''
        }
      },
      // Local data...
    }
  },
  methods: {
    sendMail () {
      this.isLoading = true
      this.$store.dispatch('resetPasswordRequest', { email: this.email.trim() })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Success') {
            this.$toast.open({
              type: 'is-success',
              position: 'is-top',
              message: res.data
            })
            this.$router.push({ name: 'anasayfa' })
          } else {
            this.errorHandling(res)
          }
        })
    },

    resetForm () {
      this.errors.email.msg = ''
      this.errors.email.type = ''
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Hata',
          message: res.data,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          //onConfirm: () => window.location.reload(true)
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
