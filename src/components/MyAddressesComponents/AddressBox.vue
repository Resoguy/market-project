<template>
  <div class="columns is-centered">
    <div class="column is-10">
      <div class="box">
        <h4 class="title is-4">{{ addr.addressTitle }}</h4>

        <p>{{ addr.address }}</p>
        <p><small>{{ addr.addressDescription }}</small></p>
        <hr>

        <p class="control has-text-right">
          <button class="button is-danger is-inverted" v-on:click="deleteConfirmation">
            <span>Sil</span>
            <b-icon icon="delete_forever"></b-icon>
          </button>
        </p>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressBox',
  props: ['addr'],
  data () {
    return {
      // Local data...
    }
  },
  methods: {
    deleteConfirmation () {
      this.$dialog.confirm({
        title: 'Adres Silmeyi Onayla',
        message: "'" + this.addr.addressTitle + "'" + ', adresini kalıcı olarak silmek istediğinizden emin misiniz?',
        confirmText: 'Sil',
        cancelText: 'İptal',
        type: 'is-danger',
        hasIcon: true,
        icon: 'delete_forever',
        onConfirm: () => {
          this.deleteAddress()
        }
      })
    },

    deleteAddress () {
      this.$store.dispatch('deleteAddress', { addressId: this.addr.id })
        .then((res) => {
          if (res.status === 'Success') {
            this.$toast.open({
              type: 'is-success',
              position: 'is-top',
              message: 'Adres başarıyla silindi.'
            })
          } else {
            this.errorHandling(res)
          }
        })
    },

    errorHandling (res) {
      if (res.status === 'Error') {
        this.$dialog.alert({
          title: 'Adres Silinme Hatası',
          message: res.data,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
        })
      } else if (res.status === 'Warning') {
        this.$snackbar.open({
          type: 'is-warning',
          position: 'is-top-right',
          message: res.data,
          actionText: 'TAMAM',
        })
      }
    }
    // Methods...
  }
}
</script>

<style lang="css">
</style>
