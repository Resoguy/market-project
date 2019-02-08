<template>
  <b-dropdown position="is-bottom-left" ref="loginDropdown">
    <a class="navbar-item" slot="trigger">
      <span>Giriş Yap</span>
      <b-icon icon="arrow_drop_down"></b-icon>
    </a>

    <b-dropdown-item custom paddingless>
      <form v-on:submit.prevent="login">
        <div class="modal-card" style="width:300px;">
          <section class="modal-card-body">
            <b-field label="Email"
              :message="errorMsg"
              :type="formType">

              <b-input
                v-model="email"
                type="email"
                icon="email"
                placeholder="Email adresinizi giriniz..."
                required>
              </b-input>
            </b-field>

            <b-field label="Şifre"
              :message="errorMsg"
              :type="formType">

              <b-input
                v-model="password"
                type="password"
                icon="lock"
                password-reveal
                placeholder="Şifre giriniz"
                required>
              </b-input>
            </b-field>

            <router-link :to="{ name: 'sifremi-unuttum' }">Şifremi Unuttum</router-link>

          </section>
          <footer class="modal-card-foot">
            <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">Giriş Yap</button>
            <button type="button" class="button" v-on:click="goToRegister">Üye Ol</button>
          </footer>
        </div>
      </form>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: 'LoginForm',
  data () {
    return {
      isLoading: false,
      email: '',
      password: '',
      errorMsg: '',
      formType: '',
      // Local data...
    }
  },
  computed: {
    myCart () {
      return this.$store.getters.myCart
    },
    // Computed properties...
  },
  methods: {
    goToRegister () {
      this.$refs.loginDropdown.toggle()
      this.$router.push({ name: 'uye-ol' })
    },

    checkLogin () {
      if (this.email.trim() && this.password.trim()) {
        this.login()
      } else {
        this.errorMsg = 'Kullanıcı adı ya da şifreyi hatalı girdiniz!'
        this.formType = 'is-danger'
      }
    },

    login () {
      this.isLoading = true
      const postData = {
        grant_type: 'password',
        client_id: 2,
        client_secret: 'VumFrrInLD9Ol3Y3QNyDwio41wNXcfefSJAlIW8Z',
        username: this.email.trim(),
        password: this.password.trim(),
        scope: '',
      }
      this.$store.dispatch('login', { postData })
        .then((res) => {
          this.$router.push({ name: 'anasayfa' })
          if (res.status === 'Success') {
            let tokenData = res.tokenData
            this.errorHandling(res)
            // Get Shopping Cart of the current selected market after successful login
            this.$store.dispatch('getFavorites', { accessToken: tokenData.access_token })
              .then((response) => {
                if (res.status === 'Success') {
                  return
                } else {
                  this.errorHandling(response)
                }
              })
            if (this.myCart.length) {
              this.$store.dispatch('postCartData', { accessToken: tokenData.access_token })
                .then((res) => {
                  if (res.status === 'Warning') {
                    this.cartWarning(res)
                  } else if (res.status === 'Error') {
                    this.errorHandling(res)
                  }
                })
            } else {
              this.$store.dispatch('getCarts', { accessToken: tokenData.access_token })
                .then((res) => {
                  if (res.status === 'Warning' || res.status === 'Error') {
                    this.errorHandling(res)
                  }
                })
            }
          } else {
            this.formErrorHandling(res)
          }
        })
    },

    cartWarning (res) {
      this.$dialog.alert({
        title: 'Stokta Eksik Ürün',
        type: 'is-warning',
        message: 'Giriş yapmadan önce eklediğiniz ürünlerin tamamı ya da bir kısmı market stoğunda bulunmadığından sepetiniz güncellenmiştir.',
        hasIcon: true,
        icon: 'warning',
      })
    },

    errorHandling (res) {
      this.isLoading = false
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Hata',
          message: res.data,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          onConfirm: () => window.location.reload(true)
        })
      } else if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          position: 'is-top-right',
          message: res.data,
          actionText: 'TAMAM',
        })
      } else {
        this.$toast.open({
          type: 'is-success',
          position: 'is-top',
          message: res.data,
        })
      }
    },

    formErrorHandling (res) {
      this.isLoading = false
      this.$dialog.alert({
        title: 'Hatalı Giriş',
        message: res.data,
        type: 'is-danger',
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa',
        onConfirm: () => {
          this.$toast.open('Yeniden giriş yapmayı deneyin.')
        }
      })
      this.errorMsg = 'Kullanıcı adı ya da şifreyi hatalı girdiniz!'
      this.formType = 'is-danger'
    },
    // Methods...
  }
}
</script>

<style lang="css">
</style>
