import axios from 'axios'
import Vue from 'vue'
import { authHeaders } from '../helpers.js'

// Cart State
const state = {
  addedProducts: [],
  alternativeMarkets: [],
  total: 0.0,
}

// Cart Getters
const getters = {
  myCart (state) {
    return state.addedProducts
  },

  cartTotal (state) {
    return state.total
  },

  alternativeMarketList (state) {
    return state.alternativeMarkets
  },
}


// Cart Actions
const actions = {
  reOrder ({ commit, state, rootState }, { orderId }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'reOrder', { orderId }, authHeaders(token.access_token))
        .then((res) => {
          console.log('ReOrder: ',res)
          if (res.data.Status === 'Success') {
            commit('updateCart', { newCart: res.data.Data.shoppingCarts, total: res.data.Data.amount })
            return { status: res.data.Status, data: '' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          console.log(err)
          return { status: res.data.Status, data: res.data.Data }
        })
    }
  },

  postCartData ({ commit, state, rootState }, { accessToken }) {
    return axios.post(rootState.baseUrl + 'postShoppingCarts', { shoppingCarts: JSON.stringify(state.addedProducts), marketId: rootState.curMarket.id }, authHeaders(accessToken))
      .then ((res) => {
        console.log('POST CART DATA: ', res)
        if (res.data.Status === 'Success') {
          commit('updateCart', { newCart: res.data.Data.shoppingCarts, total: res.data.Data.amount })
          return { status: res.data.Status, data: '' }
        // If cartWarnings array in the response has any item in it check that and call it in the component
        } else if (res.data.Status === 'Warning') {
          commit('updateCart', { newCart: res.data.Data.shoppingCarts, total: res.data.Data.amount })
          return { status: res.data.Status, data: res.data.Data.cartWarnings }
        } else {
          return { status: res.data.Status, data: res.data.Data}
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Bir sorun oluştu, lütfen daha sonra tekrar deneyin.' }
      })
  },

  getCarts ({ dispatch, commit, state, rootState }, { accessToken }) {
    // Checking if there is a selected market in the state so we can get the shopping cart of the selected market
    if (rootState.curMarket.id) {
      return axios.post(rootState.baseUrl + 'getShoppingCarts', { marketId: rootState.curMarket.id }, authHeaders(accessToken))
        .then((res) => {
          // If Cart response is 'Success' then mutate the state
          if (res.data.Status === 'Success') {
            commit('getCarts', { addedProducts: res.data.Data.shoppingCarts, total: res.data.Data.amount })
            return { status: res.data.Status, data: '' }
          } else { // Return Errors or Warnings to component to handle the error
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => { // Return Error from Http errors to component
          console.log(err)
          return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
        })
    } else {
    // If there is no selected market return a warning (Will be updated)
      return { status: 'Warning', data: 'Seçili market bulunamamıştır.' }
    }
  },

  // Adds an item to Cart if it exists then add quantity
  addToCart ({ dispatch, commit, state }, { product }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    // If logged in create that product in the database cart too else only localStorage
    if (token && token.access_token) {
      return dispatch('dbCart', { stockId: product.id, accessToken: token.access_token })
        .then((res) => {
        // Response status is success update the state cart according to the data from response
          if (res.status === 'Success') {
            commit('updateCart', { newCart: res.data.shoppingCarts, total: res.data.amount })
            return { status: res.status, data: res.data }
          // If 'Error' is because of Stock Error
          } else if (res.status === 'Error' && res.data.hasOwnProperty('stockId')) {
            return { status: res.status, data: res.data.stockId[0] }
          } else {
            return { status: res.status, data: res.data }
          }
        })
    } else { // Not logged in just use localStorage and vuex state
      commit('addToCart', { product })
      return { status: 'Success', data: '' }
    }
  },

  dbCart ({ commit, state, rootState }, { stockId, accessToken }) {
    // Make a request to the database
    return axios.post(rootState.baseUrl + 'newShoppingCart', { stockId }, authHeaders(accessToken))
      .then((res) => {
        return { status: res.data.Status, data: res.data.Data }
      })
      .catch((err) => {
        return { status: 'Error', data: 'Ürün sepete eklenirken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  // Decrements an item in the Cart
  removeFromCart ({ dispatch, commit, state }, { product }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    // If user logged in remove that item from db cart too else just remove
    if (token && token.access_token){
      return dispatch('removeFromDbCart', { stockId: product.id, accessToken: token.access_token })
        .then((res) => {
          // If response is successful then update the cart according to the response
          if (res.status === 'Success') {
            commit('updateCart', { newCart: res.data.shoppingCarts, total: res.data.amount })
            return { status: res.status, data: res.data }
          } else {
            return { status: res.status, data: res.data }
          }
        })
    } else {
      commit('removeFromCart', { product })
      return { status: 'Success', data: '' }
    }
  },

  removeFromDbCart ({ commit, state, rootState }, { stockId, accessToken }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    // Makes a request for decrementing item from the Cart
    return axios.post(rootState.baseUrl + 'destroyShoppingCart', { stockId }, authHeaders(accessToken))
      .then((res) => {
        return { status: res.data.Status, data: res.data.Data }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Ürün sepetten silinirken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  // Deletes an item from the cart completely
  deleteItemFromCart ({ dispatch, commit, state }, { product }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return dispatch('deleteItemFromDbCart', { stockId: product.id, accessToken: token.access_token })
        .then((res) => {
          if (res.status === 'Success') {
            commit('updateCart', { newCart: res.data.shoppingCarts, total: res.data.amount })
            return { status: res.status, data: res.data }
          } else {
            return { status: res.status, data: res.data }
          }
        })
    } else {
      commit('deleteItemFromCart', { product })
      return { status: 'Success', data: 'Ürün sepetinizden başarıyla kaldırıldı.' }
    }
  },

  deleteItemFromDbCart ({ commit, state, rootState }, { stockId, accessToken }) {
    // Makes request to api to delete the item from users cart
    return axios.post(rootState.baseUrl + 'destroyShoppingCartItem', { stockId }, authHeaders(accessToken))
      .then((res) => {
        return { status: res.data.Status, data: res.data.Data }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Ürün sepetten kaldırılırken bir hata oluştu!' }
      })
  },

  getAlternativeMarkets ({ dispatch, commit, state, rootState }, { accessToken }) {
    let data = {
      longitude: rootState.coords.longitude,
      latitude: rootState.coords.latitude,
      marketId: rootState.curMarket.id,
      products: JSON.stringify(state.addedProducts)
    }
    return axios.post(rootState.baseUrl + 'getAlternativesForShopping', data, authHeaders(accessToken))
      .then((res) => {
        if (res.data.Status === 'Success') {
          console.log('ALTERNATİF MARKETLER ', res)
          commit('setAlternativeMarkets', { alternativeMarkets: res.data.Data })
          return { status: res.data.Status, data: res.data.Data }
        } else {
          console.log('Alternatif Market ', res)
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Alternatif marketlerin bilgileri alınırken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  changeToAlternativeMarket ({ dispatch, commit, state, rootState }, { accessToken, market }) {
    // Object that we are going to send to the api to change cart and market
    let cartData = {
      marketId: market.id,
      shoppingCarts: JSON.stringify(market.products),
    }
    return axios.post(rootState.baseUrl + 'postShoppingCartsForAlternatives', cartData, authHeaders(accessToken))
      .then((res) => {
        // If request status is 'Success' change market to the alternative market and update cart
        if (res.data.Status === 'Success') {
          dispatch('setTopCategories', { market })
          return { status: res.data.Status, data: '' }
        } else {
        // If there are any Error or Warning return it to the component
          console.log('ALTERNATİF MARKET HATASI: ', res)
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Alternatif market seçilirken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  checkout ({ commit, state, rootState }, { orderData }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.post(rootState.baseUrl + 'order', orderData, authHeaders(token.access_token))
      .then((res) => {
        console.log('CHECKOUT: ', res)
        if (res.data.Status === 'Success') {
          commit('emptyCart')
          return { status: res.data.Status, data: 'Siparişiniz markete ulaşmıştır.' }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Bir hata oluştu lütfen tekrar deneyin.' }
      })
  },

  emptyCart ({ commit, state, rootState }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    axios.get(rootState.baseUrl + 'destroyShoppingCarts', authHeaders(token.access_token))
      .then((res) => {
        commit('emptyCart')
      })
      .catch((err) => {
        console.log(err)
      })
  },
}

// Cart Mutations
const mutations = {
  addToCart (state, payload) {
    const record = state.addedProducts.find((p) => p.id === payload.product.id)
    if (record) {
      record.quantity++
    } else {
      Vue.set(payload.product, 'quantity', 1)
      state.addedProducts.push(payload.product)
    }
  },

  updateCart (state, payload) {
    state.addedProducts = []
    state.addedProducts = payload.newCart
    state.total = payload.total
  },

  getCarts (state, payload) {
    state.addedProducts = payload.addedProducts
    state.total = payload.total
  },

  removeFromCart (state, payload) {
    const record = state.addedProducts.find((p) => p.id === payload.product.id)
    if (record.quantity > 1) {
      record.quantity--
    } else {
      let ix = state.addedProducts.indexOf(record)
      state.addedProducts.splice(ix, 1)
    }
  },

  deleteItemFromCart (state, payload) {
    const record = state.addedProducts.find((p) => p.id === payload.product.id)
    let ix = state.addedProducts.indexOf(record)
    state.addedProducts.splice(ix, 1)
  },

  setAlternativeMarkets (state, payload) {
    state.alternativeMarkets = payload.alternativeMarkets
  },

  emptyCart (state) {
    state.addedProducts = []
    state.total = 0.0
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
