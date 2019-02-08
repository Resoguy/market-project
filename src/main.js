// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// Buefy
import Buefy from 'buefy'
// import 'buefy/lib/buefy.css'
// Vue2-Google-Maps
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(Buefy)
Vue.use(VueGoogleMaps, {
  load: {
    //key: 'AIzaSyA7DIJ048XamPeX1x2e_DS_NBHVQT4CyrE'
    key: 'AIzaSyBPNm_V4vubA4K84BO2Nk91z9KDQPklwqQ'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
