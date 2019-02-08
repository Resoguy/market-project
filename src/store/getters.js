const getters = {
  geoUrl (state) {
    return state.geoUrl
  },

  baseUrl (state) {
    return state.baseUrl
  },

  picUrl (state) {
    return state.picUrl
  },

  loginUrl (state) {
    return state.loginUrl
  },

  address (state) {
    return state.address
  },

  coords (state) {
    return state.coords
  },

  markets (state) {
    return state.markets
  },

  curMarket (state) {
    return state.curMarket.marketName
  },

  marketId (state) {
    return state.curMarket.id
  },

  curMinAmount (state) {
    return state.curMarket.minAmount
  },

  topCategories (state) {
    return state.topCategories
  },

  subCategories (state) {
    return state.subCategories
  },

  products (state) {
    return state.products
  },

  specialProducts (state) {
    return state.specialProducts
  },

  pagingData (state) {
    return state.pagingData
  },

  isLoading (state) {
    return state.isLoading
  },
  // Main Vuex Getters...
}

export default getters
