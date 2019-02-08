<template>
  <nav class="panel">

    <form v-on:submit.prevent="addToShoppingList">
      <div class="panel-block">
          <div class="control has-icons-left">
            <input
              v-model="listItem"
              @blur="isError=false"
              class="input"
              :class="{ 'is-danger': isError }"
              type="text"
              placeholder="Alışveriş listenize eklemek istediğiniz ürünün adını yazın..."/>
            <b-icon icon="playlist_add"></b-icon>
            <p class="help is-danger" v-show="isError">{{ errorMsg }}</p>
          </div>
      </div>

      <div class="panel-block">
        <p class="control">
          <button type="submit"
            class="button is-primary is-outlined is-fullwidth"
            :class="{ 'is-loading': isLoading }">
            Ekle
          </button>
        </p>
      </div>
    </form>

    <a class="panel-block has-text-centered" v-for="item in myShoppingList" v-on:click="itemSearchModal(item.item)">
      <b-icon icon="youtube_searched_for"></b-icon>
      &nbsp;
      <p class="control">
        {{ item.item }}
      </p>

      <button class="button is-outlined is-danger"
        :class="{ 'is-loading': isDeleting }"
        v-on:click.stop="removeFromShoppingList(item)">

        <b-icon icon="delete"></b-icon>
        <span><small>Sil</small></span>

      </button>
    </a>

    <b-modal :active.sync="isSearchModalActive" has-modal-card>
      <search-modal v-bind="searchProps" />
    </b-modal>

  </nav>
</template>

<script>
import SearchModal from './SearchModal.vue'

export default {
  name: 'ListPanel',
  components: {
    SearchModal,
    // Components...
  },
  data () {
    return {
      isLoading: false,
      isDeleting: false,
      isError: false,
      errorMsg: '',
      listItem: '',
      isSearchModalActive: false,
      searchProps: {
        searchItem: null,
      },
      // Local data...
    }
  },
  created () {
    this.$store.dispatch('getShoppingList')
    // On create methods...
  },
  computed: {
    myShoppingList () {
      return this.$store.getters.myShoppingList
    },
    // Computed Properties...
  },
  methods: {
    addToShoppingList () {
      if (this.listItem.trim().length > 2) {
        this.isLoading = true
        this.isError = false
        this.$store.dispatch('addToShoppingList', { item: this.listItem.trim() })
          .then((res) => {
            this.isLoading = false
            if (res.status === 'Warning') {
              this.$snackbar.open({
                type: 'is-warning',
                position: 'is-top-right',
                message: res.data,
                actionText: 'TAMAM',
              })
            } else if (res.status === 'Error') {
              this.$snackbar.open({
                type: 'is-danger',
                position: 'is-bottom-right',
                message: res.data,
                actionText: 'TAMAM'
              })
            } else if (res.status === 'Success') {
              this.listItem = ''
            }
          })
      } else {
        this.errorMsg = 'Alışveriş listesine eklemek istediğiniz ürün en az 3 karakter uzunluğunda olmalıdır.'
        this.isError = true
      }
    },

    removeFromShoppingList (item) {
      this.isDeleting = true
      this.$store.dispatch('removeFromShoppingList', { itemId: item.id })
        .then((res) => {
          this.isDeleting = false
          if (res.status === 'Success') {
            this.$toast.open({
              type: 'is-success',
              position: 'is-top',
              message: item.item + ', alışveriş listenizden başarıyla silinmiştir.',
            })
          } else if (res.status === 'Warning') {
            this.$snackbar.open({
              type: 'is-warning',
              position: 'is-top-right',
              message: res.data,
              actionText: 'TAMAM',
            })
          } else if (res.status === 'Error') {
            this.$snackbar.open({
              type: 'is-danger',
              position: 'is-bottom-right',
              message: res.data,
              actionText: 'TAMAM'
            })
          }
        })
    },

    itemSearchModal (item) {
      this.searchProps.searchItem = item
      this.isSearchModalActive = true
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
