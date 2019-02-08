import axios from 'axios'
import { authHeaders } from '../helpers.js'

// Past orders state...
const state = {
  orders: [],
  orderDetails: null,
}


// Past orders geters...
const getters = {
  myOrders (state) {
    return state.orders
  },

  myOrderDetails (state) {
    return state.orderDetails
  },
  // Getters...
}


// Past orders actions...
const actions = {
  getOrders ({ commit, state, rootState }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.get(rootState.baseUrl + 'getPastOrders', authHeaders(token.access_token))
      .then((res) => {
        console.log(res.data)
        commit('getOrders', { orders: res.data.Data })
      })
      .catch((err) => {
        console.log(err)
      })
  },

  getOrderDetails ({ commit, state, rootState }, { orderId }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.post(rootState.baseUrl + 'getOrderDetails', { orderId }, authHeaders(token.access_token))
      .then((res) => {
        console.log('ORDER DETAİLS: ', res.data)
        commit('getOrderDetails', { orderDetails: res.data.Data })
      })
      .catch((err) => {
        console.log(err)
      })
  },

  emptyOrderDetails ({ commit, state, rootState }) {
    commit('emptyOrderDetails')
  },
  // Actions...
}


// Past orders mutations...
const mutations = {
  getOrders (state, payload) {
    state.orders = payload.orders
  },

  getOrderDetails (state, payload) {
    state.orderDetails = payload.orderDetails
  },

  emptyOrderDetails (state) {
    state.orderDetails = []
  },
  // Mutations...
}


export default {
  state,
  getters,
  actions,
  mutations,
}
