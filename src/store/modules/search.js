import axios from 'axios'
import { authHeaders } from '../helpers.js'

const state = {
  searchResults: [],
  shoppingList: [],
  // Search State...
}

const getters = {
  myShoppingList (state) {
    return state.shoppingList
  },

  searchResults (state) {
    return state.searchResults
  },
  // Search Getters...
}

const actions = {
  getShoppingList ({ commit, state, rootState }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))

    return axios.get(rootState.baseUrl + 'getShoppingList', authHeaders(token.access_token))
      .then((res) => {
        console.log('SHOPPING LİST: ', res)
        if (res.data.Status === 'Success') {
          commit('setShoppingList', { shoppingList: res.data.Data })
        }
        return { status: res.data.Status, data: res.data.Data }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Alışveriş Listesi alınırken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  addToShoppingList ({ commit, state, rootState }, { item }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))

    return axios.post(rootState.baseUrl + 'newShoppingListItem', { item }, authHeaders(token.access_token))
      .then((res) => {
        console.log('ADDED SHOPPİNG LİST: ',res)
        if (res.data.Status === 'Success') {
          commit('setShoppingList', { shoppingList: res.data.Data })
        }
        return { status: res.data.Status, data: res.data.Data }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Ürün alışveriş listesine eklenirken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  removeFromShoppingList ({ commit, state, rootState }, { itemId }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))

    return axios.post(rootState.baseUrl + 'destroyShoppingListItem', { itemId }, authHeaders(token.access_token))
      .then((res) => {
        console.log('DESTROY SHOPPİNG LİST İTEM: ', res)
        if (res.data.Status === 'Success') {
          commit('setShoppingList', { shoppingList: res.data.Data })
        }
        return { status: res.data.Status, data: res.data.Data }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Ürün alışveriş listesinden kaldırılırken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  getSearchResults ({ dispatch, commit, state, rootState }, { searchWord }) {
    commit('loadingState', { isLoading: true })
    return axios.post(rootState.baseUrl + 'searchByKeyword', { keyword: searchWord, marketId: rootState.curMarket.id })
      .then((res) => {
        commit('loadingState', { isLoading: false })
        if (res.data.Status === 'Success') {
          commit('getSearchResults', { searchResults: Array.from(res.data.Data.data) })
          return { status: res.data.Status, data: '' }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
  },

  emptySearchResults ({ commit, state }) {
    commit('emptySearchResults')
  },
  // Search Actions...
}

const mutations = {
  setShoppingList (state, payload) {
    state.shoppingList = payload.shoppingList
  },

  getSearchResults (state, payload) {
    state.searchResults = payload.searchResults
  },

  emptySearchResults (state) {
    state.searchResults = []
  },
  // Search Mutations...
}

export default {
  state,
  getters,
  actions,
  mutations
}
