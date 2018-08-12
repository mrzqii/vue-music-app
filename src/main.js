import 'babel-polyfill' //转换ES6的一些API 这个必须写在最开始位置
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
 
import 'common/stylus/index.styl';

// 这样写的话点击body里面的元素就不会有300ms的延时了
fastclick.attach(document.body)
// Vue.config.productionTip = false

Vue.use(VueLazyload, {
  // preLoad: 1.3,
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
