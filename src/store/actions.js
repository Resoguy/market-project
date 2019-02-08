import axios from 'axios'

const actions = {
  nearbyMarkets ({ dispatch, commit, state }, { lat, lng }) {
    commit('loadingState', { isLoading: true })
    // Sends coords to Google api to get address
    return dispatch('getAddress', { lat, lng })
      .then((res) => {
        // If it's successful the method returns location
        if (res.hasOwnProperty('location')) {
          // Send that location object to the backend to get nearby markets list
          return dispatch('setMarkets', { location: res.location })
            .then((res) => res)
        } else { // Else return error and restart the page
          commit('loadingState', { isLoading: false })
          return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
        }
      })
  },

  getAddress ({ commit, state }, { lat, lng }) {
    // Takes coords as payload arguments and sends it to google api to calculate location
    return axios.get(state.geoUrl + lat + ',' + lng + '&key=AIzaSyBPNm_V4vubA4K84BO2Nk91z9KDQPklwqQ')
      .then((res) => {
        console.log('GOOGLE API: ', res.data)
        // If response from Google is 'OK'
        if (res.data.status === 'OK') {
          let address = res.data.results[0]['formatted_address']
          let city = res.data.results[0]["address_components"][4].long_name
          let location = {
            latitude: lat,
            longitude: lng,
          }
          // Mutation to set state data according to map's pin location
          commit('setAddress', { address })
          commit('setCoords', { coords: location })
          return { location }
        } else { // If google returns api request quota error return 'Error' status to component
          return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
        }
      })
      .catch((err) => {
        // Simple Error handling for failed request
        console.log(err)
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },

  setMarkets ({ dispatch, commit, state }, { location }) {
    commit('loadingState', { isLoading: true })
    // Request to backend to get nearby markets list
    return axios.post(state.baseUrl + 'findMarkets', location)
      .then((res) => {
        // If incoming data status is success mutate the markets in the state
        if (res.data.Status === 'Success') {
          let markets = Array.from(res.data.Data)
          commit('setMarkets', { markets })
          return dispatch('setTopCategories', { market: markets[0] })
            .then((res) => {
              return res
            })
        // If data status is 'Error' then return error data and status to component for handling error
        } else if (res.data.Status === 'Error') {
          commit('emptyMarkets')
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        // If data status is 'Warning' then return warning data and status to component for handling warning
        } else if (res.data.Status === 'Warning') {
          commit('emptyMarkets')
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        commit('emptyMarkets')
        commit('loadingState', { isLoading: false })
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },

  setTopCategories ({ dispatch, commit, state }, { market }) {
    commit('loadingState', { isLoading: true })
    commit('emptyTopCategories')
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    // Request to the backend to get top category list of the market in the payload
    return axios.get(state.baseUrl + 'Market/' + market.id + '/TopCategories')
      .then((res) => {
        // If data status is 'Success' set top categories in the state
        if (res.data.Status === 'Success') {
          let topCategories = Array.from(res.data.Data)
          // Since request is successful we can set the selected market in the state
          commit('setCurMarket', { market })
          // commit('setMarketId', { marketId: market.id })
          commit('emptySearchResults')
          // If there is token in the localStorage we should get the user's cart data for that market
          if (token && token.access_token) {
            dispatch('getCarts', { accessToken: token.access_token })
            dispatch('getFavorites', { accessToken: token.access_token })
          }
          commit('setTopCategories', { topCategories })
          dispatch('setSpecialProducts')
          if (topCategories.length) {
            return dispatch('setSubCategories', { topCategoryId: topCategories[0].id })
              .then((res) => res)
          } else {
            // DENEME MARKET BOŞ KATEGORİ İLE ÇALIŞMASI İÇİN DAHA SONRA DÜZELTİLECEK
            commit('loadingState', { isLoading: false })
            return { status: 'Success', data: '' }
          }
        // If data status is 'Error' then return error data and status to component for handling error
        } else if (res.data.Status === 'Error') {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        // If data status is 'Warning' then return warning data and status to component for handling warning
        } else if (res.data.Status === 'Warning') {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        commit('loadingState', { isLoading: false })
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },

  setSubCategories ({ dispatch, commit, state }, { topCategoryId }) {
    commit('loadingState', { isLoading: true })
    // Request to get subcategories of a top category with the topCategoryId parameter
    return axios.get(state.baseUrl + 'Market/' + state.curMarket.id + '/TopCategory/' + topCategoryId + '/SubCategories')
      .then((res) => {
        // If data status is 'Success' then we can set the subcategories in the state with the data
        if (res.data.Status === 'Success') {
          let subCategories = Array.from(res.data.Data)
          commit('setSubCategories', { subCategories })
          // Select the first subcategory manually in the data to set the products
          return dispatch('setProducts', { subCategoryId: subCategories[0].id })
            .then((res) => res)
        // If data status is 'Error' then return error data and status to component for handling error
        } else if (res.data.Status === 'Error') {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        // If data status is 'Warning' then return warning data and status to component for handling warning
        } else if (res.data.Status === 'Warning') {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        commit('loadingState', { isLoading: false })
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },

  setProducts ({ commit, state }, { subCategoryId }) {
    commit('loadingState', { isLoading: true })
    // Request to get Products from backend with subCategoryId parameter
    return axios.get(state.baseUrl + 'Market/' + state.curMarket.id + '/SubCategory/' + subCategoryId + '/Products/24')
      .then((res) => {
        // If data status 'Success' then we can set the products in the state with data
        if (res.data.Status === 'Success') {
          commit('setProducts', { products: Array.from(res.data.Data.data) })
          commit('setPaging', { pagingData: res.data.Data })
          commit('loadingState', { isLoading: false }) // Stops loading animation in the component
          return { status: res.data.Status, data: '' }
        // If data status is 'Error' then return error data and status to component for handling error
        } else if (res.data.Status === 'Error') {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        // If data status is 'Warning' then return warning data and status to component for handling warning
        } else if (res.data.Status === 'Warning') {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        commit('loadingState', { isLoading: false })
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },

  setSpecialProducts ({ commit, state, rootState }) {
    return axios.get(rootState.baseUrl + 'Market/' + state.curMarket.id + '/SpecialProducts')
      .then((res) => {
        if (res.data.Status === 'Success') {
          commit('setSpecialProducts', { specialProducts: res.data.Data })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },

  // Action to handle products data according to the page
  setPagingProducts ({ commit, state }, { path, page }) {
    commit('loadingState', { isLoading: true })
    // Request to get Products from Pagination API
    return axios.get(path + '?page=' + page)
      .then((res) => {
        if (res.data.Status === 'Success') {
          commit('setProducts', { products: Array.from(res.data.Data.data) })
          commit('setPaging', { pagingData: res.data.Data })
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: '' }
        } else {
          commit('loadingState', { isLoading: false })
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        commit('loadingState', { isLoading: false })
        return { status: 'Error', data: 'Bir hata oluştu, uygulama yeniden başlatılacak!' }
      })
  },
  // Main Vuex Actions...
}

export default actions
