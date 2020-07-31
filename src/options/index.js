import Vue from 'vue'
import 'bulma-fluent/bulma.sass'

import VueToastr from "vue-toastr";

import App from './App.vue'

Vue.use(VueToastr, {
  /* OverWrite Plugin Options if you need */
});


// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
})
