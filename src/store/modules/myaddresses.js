
import axios from 'axios'
import { authHeaders } from '../helpers.js'

// Profile State
const state = {
  myAddresses: [],
  orderAddresses: [],
}

// Profile getters
const getters = {
  registeredAddresses (state) {
    return state.myAddresses
  },

  orderAddresses (state) {
    return state.orderAddresses
  },
}

// Profile actions
const actions = {
  // Action to get address list of nearby markets of the current order in the Checkout Page
  getOrderAddresses ({ commit, state, rootState }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.post(rootState.baseUrl + 'getAddressesForOrder', { marketId: rootState.curMarket.id }, authHeaders(token.access_token))
      .then((res) => {
        console.log('ORDER ADDRESSES: ', res)
        if (res.data.Status === 'Success') {
          commit('getOrderAddresses', { orderAddresses: res.data.Data })
          return { status: res.data.Status, data: '' }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Marketin hizmet bölgesindeki adresleriniz alınırken bir hata oluştu, lütfen yeniden deneyin.' }
      })
  },

  getAddresses ({ commit, state, rootState }) {
    let tokens = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.get(rootState.baseUrl + 'getAddresses', authHeaders(tokens.access_token))
      .then((res) => {
        if (res.data.Status === 'Success') {
          commit('getAddresses', { addresses: Array.from(res.data.Data) })
          return { status: res.data.Status, data: '' }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Kayıtlı adresleriniz alınırken bir hata oluştu, lütfen yeniden deneyin.' }
      })
  },

  addAddress ({ commit, state, rootState }, { addressInfo }) {
    let tokens = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.post(rootState.baseUrl + 'newAddress', addressInfo, authHeaders(tokens.access_token))
      .then((res) => {
        // If response status is succes mutate the updated address list from response and return 'Success'
        if (res.data.Status === 'Success') {
          /*
          commit('updateAddresses', { newAddresses: Array.from(res.data.Data) })
          */
          return { status: res.data.Status, data: '' }
        // If any Error or Warning return the data to component for alert
      } else if (res.data.Status === 'Error' && res.data.Data.addressTitle) {
          return { status: res.data.Status, data: res.data.Data.addressTitle[0] }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Adres eklenirken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  deleteAddress ({ commit, state, rootState }, { addressId }) {
    let tokens = JSON.parse(window.localStorage.getItem('AuthUser'))
    return axios.post(rootState.baseUrl + 'destroyAddress', { addressId }, authHeaders(tokens.access_token))
      .then((res) => {
        // If response status is success mutate the address list according to response data
        if (res.data.Status === 'Success') {
          /*
          commit('updateAddresses', { newAddresses: Array.from(res.data.Data) })
          */
          let address = state.myAddresses.find((a) => a.id === addressId)
          commit('deleteAddress', { address })
          return { status: res.data.Status, data: '' }
        // If Error or Warning return it to the component
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Adres silinirken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  }

}

// Profile mutations
const mutations = {
  getOrderAddresses (state, payload) {
    state.orderAddresses = payload.orderAddresses
  },

  getAddresses (state, payload) {
    state.myAddresses = payload.addresses
  },

  deleteAddress (state, payload) {
    let ix = state.myAddresses.indexOf(payload.address)
    state.myAddresses.splice(ix, 1)
  },

  updateAddresses (state, payload) {
    state.myAddresses = payload.newAddresses
  },
  // Mutations...
}


export default {
  state,
  getters,
  actions,
  mutations
}
