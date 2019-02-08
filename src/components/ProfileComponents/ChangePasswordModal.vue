<template>
  <form v-on:submit.prevent="changePassword">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Şifre Değiştir
        </p>
      </header>

      <section class="modal-card-body">
        <b-field label="Eski Şifre"
          :message="errors.password.msg"
          :type="errors.password.type">

          <b-input
            type="password"
            v-model="oldPassword"
            @input="resetForm('password')"
            placeholder="Eski şifrenizi girin..."
            password-reveal
            required>
          </b-input>

        </b-field>

        <b-field label="Yeni Şifre"
          :message="errors.newPassword.msg"
          :type="errors.newPassword.type">

          <b-input
            type="password"
            v-model="newPassword"
            @input="resetForm('newPassword')"
            placeholder="Yeni şifrenizi girin..."
            password-reveal
            required>
          </b-input>

        </b-field>

        <b-field label="Yeni Şifre Tekrar">
          <b-input
            type="password"
            v-model="newPasswordRepeat"
            placeholder="Yeni şifrenizi tekrar girin..."
            password-reveal
            required>
          </b-input>
        </b-field>
      </section>

      <footer class="modal-card-foot">
        <button type="submit" class="button is-success" :class="{ 'is-loading': isLoading }">Kaydet</button>
        <button type="button" class="button" v-on:click="$parent.close()">Geri Dön</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ChangePasswordModal',
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      isLoading: false,
      errors: {
        password: {
          msg: '',
          type: '',
        },
        newPassword: {
          msg: '',
          type: '',
        }
      }
      // Local data...
    }
  },
  methods: {
    changePassword () {
      this.isLoading = true
      if (this.oldPassword && this.newPassword === this.newPasswordRepeat) {
        this.$store.dispatch('changePassword', { password: this.oldPassword, newPassword: this.newPassword })
          .then((res) => {
            this.isLoading = false
            if (res.status === 'Success') {
              this.$toast.open({
                type: 'is-success',
                position: 'is-top',
                message: res.data,
              })
              this.$parent.close()
            } else if (typeof res.data === 'object') {
              if (res.data.hasOwnProperty('password')) {
                this.errors.password.msg = res.data.password[0]
                this.errors.password.type = 'is-danger'
              }
              if (res.data.hasOwnProperty('newPassword')) {
                this.errors.newPassword.msg = res.data.newPassword[0]
                this.errors.newPassword.type = 'is-danger'
              }
            } else {
              this.errorHandling(res)
            }
          })
      } else {
        this.isLoading = false
        this.$dialog.alert({
          title: 'Şifre Değiştirme Hatası',
          type: 'is-warning',
          message: 'Yeni şifreniz doğrulaması ile eşleşmedi.',
          hasIcon: true,
          icon: 'warning'
        })
      }
    },

    resetForm (key) {
      if (this.errors[key].msg) {
        this.errors[key].msg = ''
        this.errors[key].type = ''
      }
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
    // Methods...
  },
}
</script>

<style lang="css">
</style>
