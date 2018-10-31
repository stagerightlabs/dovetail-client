import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCoffee);

// Register the FA icon plugin
Vue.component('fa-icon', FontAwesomeIcon);

// Register the VeeValidate plugin
Vue.use(VeeValidate, { inject: false, delay: 1 });

Vue.config.productionTip = false;

// Attempt to read credentials from local storage
store.dispatch('auth/tryAutoLogin');

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
