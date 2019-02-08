<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">

        <p class="title is-6">
          - MARKET SİPARİŞİM -
        </p>

        <p>
          <small>Bir <a href="#">Eternal Internet Hizmetleri ve Bilişim Teknolojileri LTD. ŞTİ.</a> 2017&trade; markasıdır.</small>
        </p>

        <div>
          <!-- App Stores Logos -->
          <a href="https://play.google.com/store/apps/details?id=sifirdanbir.marketsiparisim" target="_blank">
            <img class="is-app-store" src="../../assets/google-play-logo.png" alt="google-play-logo">
          </a>

          <a href="https://itunes.apple.com/tr/app/market-sipari%C5%9Fim/id1330224624?l=tr&mt=8" target="_blank">
            <img class="is-app-store" src="../../assets/apple-store-logo.png" alt="apple-store-logo">
          </a>
        </div>

        <div>
          <!-- Payment Logos -->
          <img class="payment-logo" src="../../assets/visa-logo.png" alt="visa-logo">
          <img class="payment-logo" src="../../assets/mastercard-logo.png" alt="mastercard-logo">
        </div>

        <div>
          <a v-on:click="isConfidentialityModalActive=true">Gizlilik Politikası</a> |
          <a v-on:click="isTermsModalActive=true">Kullanıcı ve Hizmet Sözleşmesi</a> |
          <a v-on:click="isProtectionModalActive=true">Kişisel Verilerin Korunması</a> |
          <a v-on:click="isEnlightenmentModalActive=true">Aydınlatma</a> |
          <a v-on:click="isContactModalActive=true">İletişim</a>
        </div>

      </div>

      <b-modal :active.sync="isConfidentialityModalActive" has-modal-card>
        <confidentiality-agreement/>
      </b-modal>
      <b-modal :active.sync="isTermsModalActive" has-modal-card>
        <terms-agreement/>
      </b-modal>
      <b-modal :active.sync="isProtectionModalActive" has-modal-card>
        <protectionof-personal-data/>
      </b-modal>
      <b-modal :active.sync="isEnlightenmentModalActive" has-modal-card>
        <enlightenment-text/>
      </b-modal>
      <b-modal :active.sync="isContactModalActive" has-modal-card>
        <contact-modal/>
      </b-modal>
    </div>
  </footer>
</template>

<script>
import ConfidentialityAgreement from '../ContractsComponents/ConfidentialityAgreement.vue'
import ProtectionofPersonalData from '../ContractsComponents/ProtectionofPersonalData.vue'
import EnlightenmentText from '../ContractsComponents/EnlightenmentText.vue'
import TermsAgreement from '../ContractsComponents/TermsAgreement.vue'
import ContactModal from '../ContractsComponents/ContactModal.vue'

export default {
  name: 'MarketFooter',
  components: {
    ConfidentialityAgreement,
    ProtectionofPersonalData,
    EnlightenmentText,
    TermsAgreement,
    ContactModal,
    // Components...
  },
  data () {
    return {
      isConfidentialityModalActive: false,
      isEnlightenmentModalActive: false,
      isProtectionModalActive: false,
      isTermsModalActive: false,
      isContactModalActive: false,
      // Local data...
    }
  },
  created () {
    // On create functions...
  },
  methods: {

    // Methods...
  },
}
</script>

<style lang="css">
.is-app-store {
  width: 96px;
  height: 30px;
}

.payment-logo {
  width: 36px;
  height: 23.5px;
}
</style>
