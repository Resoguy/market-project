import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
// Modules imports...
import authentication from './modules/authentication'
import cart from './modules/cart'
import pastOrders from './modules/pastOrders'
import myaddresses from './modules/myaddresses'
import favorites from './modules/favorites'
import search from './modules/search'


Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    authentication,
    cart,
    pastOrders,
    myaddresses,
    favorites,
    search,
    // Module Files...
  }
})
