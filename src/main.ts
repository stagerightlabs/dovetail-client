import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCoffee);

Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

// Attempt to read credentials from local storage
store.dispatch('auth/tryAutoLogin');

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
