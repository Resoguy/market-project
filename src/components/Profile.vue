<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">
          <div class="box">

            <h2 class="title is-4">Profilim</h2>
            <hr>

            <div class="card">
              <div class="section" v-if="userInfo">

                <b-field label="Ad & Soyad"
                  :message="this.errors.name.msg"
                  :type="this.errors.name.type">

                  <b-input
                    icon="person"
                    :value="userInfo.name"
                    @input="updateName"
                    required>
                  </b-input>

                </b-field>
                <br>
                <p><strong>Email: </strong>{{ userInfo.email }} </p><br>
                <p>
                  <strong>Market Para: </strong>
                  {{ (userInfo.marketMoney || 0).toFixed(2) }}
                </p>

              </div>
            </div>
            <br>

            <p class="control">
              <button class="button is-primary is-outlined" v-on:click="isPasswordModalActive=true">
                <b-icon icon="lock"></b-icon>
                <span>Şifre Değiştir</span>
              </button>

              <button class="button is-primary is-outlined" v-on:click="isPhoneModalActive=true">
                <b-icon icon="smartphone"></b-icon>
                <span>Telefon Değiştir</span>
              </button>
            </p>
            <hr>

            <p class="control">
              <button class="button is-success"
                :class="{ 'is-loading': isLoading }"
                v-on:click="updateProfile">
                Kaydet
              </button>
            </p>

            <b-modal :active.sync="isPasswordModalActive" has-modal-card>
              <change-password-modal/>
            </b-modal>

            <b-modal :active.sync="isPhoneModalActive" has-modal-card>
              <change-phone-modal/>
            </b-modal>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ChangePasswordModal from './ProfileComponents/ChangePasswordModal.vue'
import ChangePhoneModal from './ProfileComponents/ChangePhoneModal.vue'

export default {
  name: 'Profile',
  components: {
    ChangePasswordModal,
    ChangePhoneModal,
    // Components...
  },
  data () {
    return {
      isLoading: false,
      isPasswordModalActive: false,
      isPhoneModalActive: false,
      name: '',
      errors: {
        name: {
          msg: '',
          type: '',
        }
      },
      // Local data..
    }
  },
  mounted () {
    this.name = this.$refs.nameInput.value
    // On create methods...
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    // Computed properties...
  },
  methods: {
    updateProfile () {
      this.isLoading = true
      this.$store.dispatch('changeName', { name: this.name })
        .then((res) => {
          this.isLoading = false
          if (res.status === 'Success') {
            this.$toast.open({
              message: res.data,
              type: 'is-success',
              position: 'is-top'
            })
            let token = JSON.parse(window.localStorage.getItem('AuthUser'))
            this.$store.dispatch('getUserInfo', { tokenData: token.access_token })
              .then((res) => {
                this.$router.push({ name: 'anasayfa' })
              })
          } else if (res.status === 'Error' && res.data.hasOwnProperty('name')) {
            this.errors.name.msg = res.data.name[0]
            this.errors.name.type = 'is-danger'
          } else {
            this.errorHandling(res)
          }
        })
    },

    updateName (val) {
      this.name = val
      if (this.errors.name.msg) {
        this.errors.name.msg = ''
        this.errors.name.type = ''
      }
    },

    errorHandling (res) {
      if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          message: res.data,
          position: 'is-bottom-left',
          actionText: 'Tamam',
        })
      } else if (res.status === 'Error') {
        this.$snackbar.open({
          type: 'is-danger',
          message: res.data,
          position: 'is-bottom-left',
          actionText: 'Tamam',
        })
      }
    },
    // Methods...
  },
}
</script>

<style lang="scss">
</style>
