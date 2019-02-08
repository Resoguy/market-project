import axios from 'axios'
import { authHeaders } from '../helpers.js'

// Wishlist State
const state = {
  wishlist: [],
}


// Wishlist Getters
const getters = {
  myFavorites (state) {
    return state.wishlist
  },

  totalPriceWl (state) {
    if (state.wishlist.length) {
      let totalPriceWl = 0
      for (let w of state.wishlist) {
        totalPriceWl += w.price
      }
      return totalPriceWl
    }
    return '0'
  },
}

// Wishlist Actions
const actions = {
  getFavorites ({ commit, state, rootState }, { accessToken }) {
    // Get Favorite items of the user with access token
    return axios.post(rootState.baseUrl + 'getFavoriteProducts', { marketId: rootState.curMarket.id }, authHeaders(accessToken))
      .then((res) => {
        if (res.data.Status === 'Success') {
          commit('getFavorites', { wishlist: Array.from(res.data.Data) })
          return { status: res.data.Status, data: 'Favori ürünler başarıyla alındı.' }
        } else { // Return Error or Warning to component if something's wrong with the response
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
      // Return Error to component if there is a http error
        console.log(err)
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },

  addToFavorites ({ commit, state, rootState }, { product }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'newFavoriteProduct', { stockId: product.id }, authHeaders(token.access_token))
        .then((res) => {
          // If response status is 'Success' return success status to component
          if (res.data.Status === 'Success') {
            commit('addToFavorites', { product })
            return { status: res.data.Status, data: res.data.Data }
          // If any other Error or Warning return message with the status to the component
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          // If network error occurs return a custom error message to component to display
          console.log(err)
          return { status: 'Error', data: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.' }
        })
    } else {
      // If user is not logged in return a warning message saying 'You need to login.'
      return { status: 'Warning',  data: 'Bir ürünü favorilerinize eklemek için giriş yapmalısınız.' }
    }
  },

  removeFromFavorites ({ commit, state, rootState }, { product }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.post(rootState.baseUrl + 'destroyFavoriteProduct', { stockId: product.id }, authHeaders(token.access_token))
      .then((res) => {
        // If response status is success return success status to component
        if (res.data.Status === 'Success') {
          commit('removeFromFavorites', { product })
          return { status: res.data.Status, data: '' }
        // If response has favoriteId Error return error message to component
        } else if (res.data.Status === 'Error' && res.data.Data.favoriteId) {
          return { status: res.data.Status, data: res.data.Data.favoriteId[0] }
        // If other Error or Warning return the message data to component
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.' }
      })
  },

}


// Wishlist Mutations
const mutations = {
  getFavorites (state, payload) {
    state.wishlist = payload.wishlist
  },

  addToFavorites (state, payload) {
    state.wishlist.push(payload.product)
  },

  removeFromFavorites (state, payload) {
    let wish = state.wishlist.find((w) => w.id === payload.product.id)
    let ix = state.wishlist.indexOf(wish)
    state.wishlist.splice(ix, 1)
  },

  emptyFavorites (state) {
    state.wishlist = []
  },

}

export default {
  state,
  getters,
  actions,
  mutations,
}
