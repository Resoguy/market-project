import initialState from './state'
import Vue from 'vue'

const mutations = {
  setAddress (state, payload) {
    state.address = payload.address
  },

  setCoords (state, payload) {
    state.coords = payload.coords
  },

  setMarkets (state, payload) {
    state.markets = payload.markets
  },

  setCurMarket (state, payload) {
    state.curMarket = payload.market
  },

  emptyMarkets (state, payload) {
    Vue.set(state, 'markets', [])
    Vue.set(state, 'curMarket', {})
    Vue.set(state, 'topCategories', [])
    Vue.set(state, 'subCategories', [])
    Vue.set(state, 'products', [])
    Vue.set(state, 'specialProducts', [])
    Vue.set(state, 'pagingData', {})
  },

  emptyTopCategories (state, payload) {
    state.topCategories = []
  },

  setTopCategories (state, payload) {
    state.topCategories = payload.topCategories
  },

  setSubCategories (state, payload) {
    state.subCategories = payload.subCategories
  },

  setProducts (state, payload) {
    state.products = payload.products
  },

  setSpecialProducts (state, payload) {
    state.specialProducts = payload.specialProducts
  },

  setPaging (state, payload) {
    state.pagingData = payload.pagingData
  },

  setTopCategoryId (state, payload) {
    state.topCategoryId = payload.topCategoryId
  },

  setSubCategoryId (state, payload) {
    state.subCategoryId = payload.subCategoryId
  },

  setProductId (state, payload) {
    state.productId = payload.productId
  },

  loadingState (state, payload) {
    state.isLoading = payload.isLoading
  },
  // Main Vuex Mutations...
}

export default mutations
