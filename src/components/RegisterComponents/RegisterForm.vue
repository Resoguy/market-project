<template>
  <div class="box">
    <h2 class="title is-4">Üye Ol</h2>
    <hr>
    <!-- Register Form -->
    <form v-on:submit.prevent="register">
      <b-field label="Ad & Soyad"
        :message="errors.name.msg"
        :type="errors.name.type">

        <b-input
          v-model="name"
          @input="resetForm('name')"
          placeholder="Ad Soyad giriniz..."
          icon="person"
          required>
        </b-input>

      </b-field>

      <b-field label="Email"
        :message="errors.email.msg"
        :type="errors.email.type">

        <b-input
          v-model="email"
          @input="resetForm('email')"
          placeholder="ornek@marketsiparisim.com..."
          type="email"
          icon="email"
          required>
        </b-input>

      </b-field>


      <b-field label="Telefon Numarası"
        :message="errors.phone.msg"
        :type="errors.phone.type">

        <b-input
          v-model="phone"
          @input="resetForm('phone')"
          type="number"
          placeholder="Telefon numaranızı başında sifir olmadan giriniz (536 ...)"
          icon="phone"
          required>
        </b-input>

      </b-field>

      <b-field label="Şifre"
        :message="errors.password.msg"
        :type="errors.password.type">

        <b-input
          v-model="password"
          @input="resetForm('password')"
          type="password"
          placeholder="En az 6 karakterden oluşan bir şifre giriniz."
          icon="lock"
          password-reveal
          required>
        </b-input>

      </b-field>

      <b-field label="Şifre Tekrarla"
        :message="errors.passwordConfirmation.msg"
        :type="errors.passwordConfirmation.type">

        <b-input
          v-model="passwordConfirmation"
          @input="resetForm('passwordConfirmation')"
          placeholder="Yukarıda girmiş olduğunuz şifreyi tekrarlayınız."
          type="password"
          icon="lock"
          password-reveal
          required>
        </b-input>

      </b-field>

      <b-field label="Referans Email*"
        :message="errors.referenceEMail.msg"
        :type="errors.referenceEMail.type">

        <b-input
          v-model="referenceEMail"
          @input="resetForm('referenceEMail')"
          icon="supervisor_account">
        </b-input>

      </b-field>

      <div class="field">
        <b-checkbox
          v-model="isReadTerms">
          <a v-on:click.prevent="isTermsModalActive=true">Kullanıcı ve Hizmet Sözleşmesi</a>ni okudum ve kabul ediyorum.
        </b-checkbox>
      </div>

      <p class="control">
        <button type="submit"
          class="button is-success"
          :class="{ 'is-loading': isLoading }">
          Kayıt Ol
        </button>
      </p>

    </form>
    <hr>

    <small>
      <strong>Not: </strong>*Referans Kodu kullanarak kendinizin ve arkadaşlarınızın Market Para kazanmasını sağlayabilirsiniz.
    </small>

    <b-modal :active.sync="isTermsModalActive" has-modal-card>
      <terms-services @accepted="isReadTerms=true" @declined="isReadTerms=false"/>
    </b-modal/>

  </div>
</template>

<script>
import TermsServices from './TermsServices.vue'

export default {
  name: 'RegisterForm',
  components: {
    TermsServices,
    // Components...
  },
  data () {
    return {
      isLoading: false,
      isTermsModalActive: false,
      isReadTerms: false,
      name: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      referenceEMail: '',
      errors: {
        name: {
          msg: '',
          type: '',
        },
        email: {
          msg: '',
          type: '',
        },
        phone: {
          msg: '',
          type: '',
        },
        password: {
          msg: '',
          type: '',
        },
        passwordConfirmation: {
          msg: '',
          type: '',
        },
        referenceEMail: {
          msg: '',
          type: '',
        },
      },
      // Local data...
    }
  },
  methods: {
    register () {
      if (this.isReadTerms) {
        let registerData = {
          name: this.name.trim(),
          email: this.email.trim(),
          phone: this.phone.trim(),
          password: this.password,
          referenceEMail: this.referenceEMail.trim()
        }
        if (this.password === this.passwordConfirmation) {
          this.isLoading = true
          this.$store.dispatch('register', { registerData })
            .then((res) => {
              this.isLoading = false
              if (res.status === 'Success') {
                console.log('LOGİN STARTED')
                this.login()
              } else {
                if (typeof res.data == 'string') {
                  this.errorHandling(res)
                } else {
                  console.log('FORM HATA: ', res)
                  this.formErrHandler(res)
                }
              }
            })
        } else {
          this.errors.passwordConfirmation.msg = 'Şifreniz ile şifre doğrulamanızın eşleşmesi gerekmektedir.'
          this.errors.passwordConfirmation.type = 'is-danger'
          this.errors.password.msg = 'Şifreniz ile şifre doğrulamanızın eşleşmesi gerekmektedir.'
          this.errors.password.type = 'is-danger'
        }
      } else {
        this.$dialog.alert({
          title: 'Üye Ol Uyarı!',
          message: 'Üye olmak için kullanıcı sözleşmesini kabul etmelisiniz.',
          type: 'is-warning',
          hasIcon: true,
          icon: 'warning',
          iconPack: 'fa',
        })
      }
    },

    login () {
      const postData = {
        grant_type: 'password',
        client_id: 2,
        client_secret: 'VumFrrInLD9Ol3Y3QNyDwio41wNXcfefSJAlIW8Z',
        username: this.email.trim(),
        password: this.password.trim(),
        scope: ''
      }
      this.$store.dispatch('login', { postData })
        .then((res) => {
          if (res.status === 'Success') {
            this.$toast.open({
              type: 'is-success',
              position: 'is-top',
              message: res.data,
            })
            this.$router.push({ name: 'uyelik-onaylama' })
          } else {
            this.errorHandling(res)
          }
        })
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

    formErrHandler (res) {
      if (res.data.hasOwnProperty('name')) {
        this.errors.name.msg = res.data.name[0]
        this.errors.name.type = 'is-danger'
      }
      if (res.data.hasOwnProperty('email')) {
        this.errors.email.msg = res.data.email[0]
        this.errors.email.type = 'is-danger'
      }
      if (res.data.hasOwnProperty('phone')) {
        this.errors.phone.msg = res.data.phone[0]
        this.errors.phone.type = 'is-danger'
      }
      if (res.data.hasOwnProperty('password')) {
        this.errors.password.msg = res.data.password[0]
        this.errors.password.type = 'is-danger'
      }
      if (res.data.hasOwnProperty('passwordConfirmation')) {
        this.errors.passwordConfirmation.msg = res.data.passwordConfirmation[0]
        this.errors.passwordConfirmation.type = 'is-danger'
      }
      if (res.data.hasOwnProperty('referenceEMail')) {
        this.errors.referenceEMail.msg = res.data.referenceEMail[0]
        this.errors.referenceEMail.type = 'is-danger'
      }
    },

    resetForm (key) {
      this.errors[key].msg = ''
      this.errors[key].type = ''
    }
    // Methods...
  },
}
</script>

<style lang="css">
</style>
