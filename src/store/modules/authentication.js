import axios from 'axios'
import { authHeaders } from '../helpers.js'

const state = {
  user: null,
  verifyTimer: null,
}


const getters = {
  userInfo (state) {
    return state.user
  },

  verifyTimer (state) {
    return state.verifyTimer
  },
  // Auth getters...
}


const actions = {
  // Takes the form data from component as parameter and register the account to server
  register ({ dispatch, commit, state, rootState }, { registerData }) {
    return axios.post(rootState.baseUrl + 'register', registerData)
      .then((res) => {
        if (res.data.Status === 'Success') {
          return { status: res.data.Status, data: res.data.Data }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Üyeliğiniz oluşturulurken bir hata oluştu, lütfen tekrar deneyin.' }
      })
  },

  // Action to handle the phone code verification of the user
  verifyAccount ({ dispatch, commit, state, rootState }, { code }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'verifyPhone', { code }, authHeaders(token.access_token))
        .then((res) => {
          if (res.data.Status === 'Success') {
            return { status: res.data.Status, data: 'Üyeliğiniz başarıyla onaylanmıştır.' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          return { status: 'Error', data: 'Kod onaylanma esnasında bir hata oluştu, lütfen yeniden deneyin.' }
        })
    } else {
      return { status: 'Error', data: 'Telefonunuza kod gelebilmesi için üye olmanız ya da giriş yapmanız gerekmektedir.' }
    }
  },

  // Action to resend verification code to phone
  resendVerificationCode ({ commit, state, rootState }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.get(rootState.baseUrl + 'sendVerifyCode', authHeaders(token.access_token))
        .then((res) => {
          return { status: res.data.Status, data: res.data.Data }
        })
        .catch((err) => {
          console.log(err)
          return { status: 'Error', data: 'Onay kodu yollanırken bir hata oluştu, lütfen yeniden deneyin' }
        })
    }
  },

  // Action to get code verification timer from api
  getVerifyTimer ({ commit, state, rootState }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.get(rootState.baseUrl + 'getTimeToVerify', authHeaders(token.access_token))
        .then((res) => {
          if (res.data.Status === 'Success') {
            commit('getVerifyTimer', { verifyTimer: res.data.Data })
            return { status: res.data.Data, data: '' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          console.log(err)
          return { status: 'Error', data: 'Kalan süre alınırken bir hata oluştu.' }
        })
    }
  },

  resetPasswordRequest ({ commit, state, rootState }, { email }) {
    return axios.post(rootState.baseUrl + 'resetPasswordRequest', { email })
      .then((res) => {
        console.log(res)
        return { status: res.data.Status, data: 'Şifrenizi sıfırlamak için email adresinize link gönderilmiştir.' }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Bir hata oluştu lütfen yeniden yollayın.' }
      })
  },

  resetPassword ({ commit, state, rootState }, { token, firstPassword, secondPassword }) {
    return axios.post(rootState.baseUrl + 'resetPassword', { token, firstPassword, secondPassword })
      .then((res) => {
        console.log(res)
        if (res.data.Status === 'Success') {
          return { status: res.data.Status, data: 'Şifreniz başarıyla değiştirildi.' }
        } else {
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        console.log(err)
        return { status: 'Error', data: 'Şifreniz sıfırlanırken bir hata oluştu, lütfen yeniden deneyin.' }
      })
  },

  // Action to change user password from Profile menu
  changeName ({ commit, state, rootState }, { name }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'changeName', { name }, authHeaders(token.access_token))
        .then((res) => {
          if (res.data.Status === 'Success') {
            return { status: res.data.Status, data: 'Profiliniz başarıyla güncellendi.' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          console.log(err)
          return { status: 'Error', data: 'İsim değiştirilirken bir hata oluştu, tekrar deneyin.' }
        })
    }
  },

  // Action to change users password from Profile menu
  changePassword ({ commit, state, rootState }, { password, newPassword }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'changePassword', { password, newPassword }, authHeaders(token.access_token))
        .then((res) => {
          if (res.data.Status === 'Success') {
            return { status: res.data.Status, data: 'Şifreniz başarıyla değiştirilmiştir.' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          console.log(err)
          return { status: 'Error', data: 'Şifreniz değiştirilirken bir hata oluştu, lütfen yeniden deneyin.' }
        })
    }
  },

  // Action to change user's phone number from Profile menu
  changePhone ({ commit, state, rootState }, { phone }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'phoneUpdateRequest', { phone }, authHeaders(token.access_token))
        .then((res) => {
          if (res.data.Status === 'Success') {
            return { status: res.data.Status, data: '' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          console.log(err)
          return { status: 'Error', data: 'Telefon numaranız değiştirilirken bir hata oluştu, lütfen yeniden deneyin.' }
        })
    }
  },

  // Action to verify new phone number after changePhone action from Profile menu
  changePhoneVerify ({ commit, state, rootState }, { code }) {
    let token = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (token && token.access_token) {
      return axios.post(rootState.baseUrl + 'completeUpdatePhone', { code }, authHeaders(token.access_token))
        .then((res) => {
          if (res.data.Status === 'Success') {
            return { status: res.data.Status, data: 'Telefon numaranız başarıyla değiştirilmiştir.' }
          } else {
            return { status: res.data.Status, data: res.data.Data }
          }
        })
        .catch((err) => {
          console.log(err)
          return { status: 'Error', data: 'Telefon numaranız değiştirilirken bir hata oluştu, lütfen yeniden deneyin.' }
        })
    }
  },

  // All login steps handled by this action
  login ({ dispatch, commit, state }, { postData }) {
    return dispatch('getTokens', { postData })
      .then((res) => {
        if (res.status === 'Error') {
          return { status: res.status, data: res.data }
        } else {
          return dispatch('getUserInfo', { tokenData: res.data })
            .then((res) => {
              return res
            })
        }
      })
  },

  // Takes login data (client_secret, username, password, etc.) and gets token from oauth and set it to localStorage of the browser
  getTokens ({ commit, state, rootState }, { postData }) {
    return axios.post(rootState.loginUrl, postData)
      .then((res) => {
        // If Oauth response is successful, set token in the localStorage and return token data
        window.localStorage.setItem('AuthUser', JSON.stringify(res.data))
        return res
      })
      .catch((err) => {
        console.log('AUTH: ', err)
        // Return 'Error' status with message to the component
        return { status: 'Error', data: 'Böyle bir kullanıcı bulunamadı, kullanıcı adı ya da şifre hatalı olabilir!' }
      })
  },

  // Takes token data as parameter and send access token in the header to get the user info from db
  getUserInfo ({ dispatch, commit, rootState }, { tokenData }) {
    return axios.get(rootState.userUrl, authHeaders(tokenData.access_token))
      .then((res) => {
        // If response has 'Succcess' status get favorites and cart of the user
        if (res.data.Status === 'Success') {
          commit('setUser', { userData: res.data.Data })
          return { status: 'Success', data: 'Başarıyla giriş yaptınız.', tokenData: tokenData }
        } else { // If has 'Error' or 'Warning' status return status and data to the component
          return { status: res.data.Status, data: res.data.Data }
        }
      })
      .catch((err) => {
        // Return 'Error' status with message to the component
        return { status: 'Error', data: 'Kullanıcı bilgileri alınırken bir hata oluştu, lütfen yeniden giriş yapmayı deneyin.' }
      })
  },

  // Handles the logout mutations
  logout ({ commit, state }) {
    commit('logout')
    commit('emptyFavorites')
    commit('emptyCart')
  }
}


const mutations = {
  getVerifyTimer (state, payload) {
    state.verifyTimer = payload.verifyTimer
  },

  setUser (state, payload) {
    state.user = payload.userData
  },

  logout(state, payload) {
    state.user = null
    window.localStorage.removeItem('AuthUser')
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
