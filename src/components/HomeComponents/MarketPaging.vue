<template>
  <div>
    <b-pagination
      @change="changePage"
      :total="total"
      :per-page="perPage"
      :current.sync="currentPage"
      :order="order"
      :simple="isSimple"
      :size="size">
    </b-pagination>
  </div>
</template>

<script>
export default {
  name: 'MarketPaging',
  props: ['currentPage', 'total', 'perPage', 'path'],
  data () {
    return {
      // total: 200,
      // perPage: 10,
      //current: 1,
      order: '',
      size: '',
      isSimple: false,
      // Local data...
    }
  },
  computed: {
    // Computed properties...
  },
  methods: {
    changePage (e) {
      this.$store.dispatch('setPagingProducts', { path: this.path, page: e })
        .then((res) => {
          console.log('NEW PAGE: ', res)
        })
    },
    // Methods...
  },
}
</script>

<style lang="css">
</style>
