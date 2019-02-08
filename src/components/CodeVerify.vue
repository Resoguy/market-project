<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-4">
          <div class="box">
            <h2 class="title is-4">Üyeliğinizi Onaylayınız</h2>
            <hr>

            <form v-on:submit.prevent="codeVerify">
              <b-field label="Onay Kodu"
                :message="errors.code.msg"
                :type="errors.code.type">

                <b-input
                  v-model="phoneCode"
                  @input="resetForm"
                  placeholder="Telefonunuza gelen 4 haneli onay kodunu girin."
                  type="number"
                  icon="message"
                  min="1000"
                  max="9999"
                  required>
                </b-input>

              </b-field>

              <p class="control">
                <button type="submit"
                  class="button is-success"
                  :class="{ 'is-loading': isLoading }">
                  Onayla
                </button>
              </p>
            </form>

            <br>
            <div class="control">
              <b-taglist attached>
                <b-tag type="is-dark">Kalan Süre: </b-tag>
                <b-tag :type="tagColor">{{ counter }} sn.</b-tag>
              </b-taglist>
            </div>
            <a v-on:click="resendCode"><small>Şifreyi yeniden yolla</small> </a>

            <hr>
            <small>
              <strong>Not: </strong>Üye olmak için telefonunuza gönderilen onay kodunu giriniz.
            </small>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CodeVerify',
  data () {
    return {
      isLoading: false,
      tagColor: 'is-light',
      counter: 180,
      phoneCode: '',
      errors: {
        code: {
          msg: '',
          type: '',
        }
      }
      // Local data...
    }
  },
  mounted () {
    setInterval(this.setCounter, 1000)
    // Methods to run after component mounted...
  },
  computed: {
    verifyTimer () {
      return this.$store.getters.verifyTimer
    },
    // Computed properties...
  },
  methods: {
    setCounter () {
      if (this.counter > 0) {
        if (this.counter === 11) {
          this.tagColor = 'is-danger'
        }
        this.counter--
        return
      }
      this.counter = 'Süre doldu!'
    },

    codeVerify () {
      if (this.phoneCode.trim().length == 4) {
        this.isLoading = true
        this.$store.dispatch('verifyAccount', { code: this.phoneCode.trim() })
          .then((res) => {
            this.isLoading = false
            if (res.status === 'Success') {
              this.$toast.open({
                type: 'is-success',
                position: 'is-top',
                message: res.data,
              })
              this.$router.push({ name: 'anasayfa' })
            } else if (res.status === 'Error' && res.data.hasOwnProperty('code')) {
              this.errors.code.msg = res.data.code[0]
              this.errors.code.type = 'is-danger'
            } else {
              this.errorHandling(res)
            }
          })
      } else {
        this.$dialog.alert({
          title: 'Onay Kodu Hatası',
          type: 'is-warning',
          message: 'Telefonunuza gelen 4 haneli onay kodunu girmeniz gerekmektedir.',
          hasIcon: true,
          icon: 'message',
        })
      }
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Üye Ol Hatası',
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

    resetForm () {
      this.errors.code.msg = ''
      this.errors.code.type = ''
    },

    resendCode () {
      this.$store.dispatch('resendVerificationCode')
        .then((res) => {
          console.log('COMPONENT ', res)
          if (res.status === 'Error') {
            this.$dialog.alert({
              title: 'Onay Kodu Hatası',
              message: res.data,
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa'
            })
          } else if (res.status === 'Warning') {
            this.$snacbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          } else if (res.status === 'Success') {
            this.counter = 180
            this.tagColor = ''
          }
        })
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
