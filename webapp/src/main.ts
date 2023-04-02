import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import App from './App.vue'
// import routes from './router.js'
//
// const router = new VueRouter({ routes })
//
// Vue.config.productionTip = false
//
// Vue.use(VueRouter)
//
// new Vue({
//   router,
//   render: h => h(App),
// }).$mount('#app')
