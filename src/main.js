import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import  'element-ui/lib/theme-chalk/index.css'
import  ElementUI from 'element-ui'

Axios.defaults.baseURL="http://localhost:8888";
Vue.prototype.$axios = Axios;
Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
