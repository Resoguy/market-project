import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import Home from '@/components/Home'
import PastOrders from '@/components/PastOrders'
import MyAddresses from '@/components/MyAddresses'
import Register from '@/components/Register'
import CodeVerify from '@/components/CodeVerify'
import Checkout from '@/components/Checkout'
import MyFavorites from '@/components/MyFavorites'
import Profile from '@/components/Profile'
import ShoppingList from '@/components/ShoppingList'
import ForgotPassword from '@/components/ForgotPassword'
import ResetPassword from '@/components/ResetPassword'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
      children:[
        {
          path: '',
          name: 'anasayfa',
          component: Home,
        },
        {
          path: 'uye-ol',
          name: 'uye-ol',
          component: Register,
          meta: { anonymousRequired: true }
        },
        {
          path: 'sifremi-unuttum',
          name: 'sifremi-unuttum',
          component: ForgotPassword,
          meta: { anonymousRequired: true }
        },

        {
          path: 'uyelik-onaylama',
          name: 'uyelik-onaylama',
          component: CodeVerify,
          meta: { authRequired: true }
        },
        {
          path: 'profilim',
          name: 'profilim',
          component: Profile,
          meta: { authRequired: true }
        },
        {
          path: 'gecmis-siparisler',
          name: 'gecmis-siparisler',
          component: PastOrders,
          meta: { authRequired: true }
        },
        {
          path: 'adreslerim',
          name: 'adreslerim',
          component: MyAddresses,
          meta: { authRequired: true }
        },
        {
          path: 'favorilerim',
          name: 'favorilerim',
          component: MyFavorites,
          meta: { authRequired: true }
        },
        {
          path: 'alisveris-listem',
          name: 'alisveris-listem',
          component: ShoppingList,
          meta: { authRequired: true }
        },
        {
          path: 'alisverisi-tamamla',
          name: 'alisverisi-tamamla',
          component: Checkout,
          meta: { authRequired: true }
        }
        // Child Routes...
      ]
    },
    {
      path: '/sifremi-sifirla/:token',
      name: 'sifremi-sifirla',
      component: ResetPassword
    },
    // Routes...
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.authRequired)) {
    let user = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (user && user.access_token) {
      next()
    } else {
      next('/')
    }
  } else if (to.matched.some(m => m.meta.anonymousRequired)) {
    let user = JSON.parse(window.localStorage.getItem('AuthUser'))
    if (user && user.access_token) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
